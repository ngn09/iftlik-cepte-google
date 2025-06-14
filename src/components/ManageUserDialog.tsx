import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/pages/Users";
import { useEffect, useState } from "react";
import { ROLES, roleOptions } from "@/config/roles";
import type { Role } from "@/config/roles";

const userFormSchema = z.object({
  id: z.string().optional(),
  full_name: z.string().min(2, { message: "Ad soyad en az 2 karakter olmalıdır." }),
  email: z.string().email({ message: "Geçersiz e-posta adresi." }),
  role: z.string().refine(val => Object.keys(ROLES).includes(val), { message: "Geçersiz rol."}),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(data => {
  if (!data.id) { // New user
    if (!data.password || data.password.length < 6) {
        return false;
    }
    return data.password === data.confirmPassword;
  }
  return true; // Existing user, no password validation needed
}, {
  message: "Yeni kullanıcılar için şifreler eşleşmeli ve en az 6 karakter olmalıdır.",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userFormSchema>;

interface ManageUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageUserDialog({ user, open, onOpenChange }: ManageUserDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<Role | undefined>(user?.role as Role || undefined);

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      role: "İşçi",
      password: "",
      confirmPassword: "",
    }
  });

  useEffect(() => {
    if (open) {
      if (user) {
        form.reset({
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
        });
        setSelectedRole(user.role as Role);
      } else {
        form.reset({
          full_name: "",
          email: "",
          role: "İşçi",
          password: "",
          confirmPassword: "",
        });
        setSelectedRole("İşçi");
      }
    }
  }, [user, open, form]);
  
  const userMutation = useMutation({
    mutationFn: async (data: UserFormData) => {
        const { id, password, confirmPassword, ...updateData } = data;
        
        if (id) {
            const { error } = await supabase.from('profiles').update(updateData).eq('id', id);
            if (error) throw new Error(error.message);
            return { ...updateData, id };
        } else {
            const { error } = await supabase.functions.invoke('create-user', {
                body: {
                    email: updateData.email,
                    password: password,
                    full_name: updateData.full_name,
                    role: updateData.role,
                }
            });
            if (error) {
              // The error from invoke is sometimes an object, let's stringify it
              throw new Error(`Kullanıcı oluşturulamadı: ${typeof error === 'object' ? JSON.stringify(error) : error.message}`);
            }
        }
    },
    onSuccess: (data) => {
        toast({ title: "Başarılı", description: user ? "Kullanıcı bilgileri güncellendi." : "Kullanıcı oluşturuldu." });
        queryClient.invalidateQueries({ queryKey: ['users'] });
        onOpenChange(false);
    },
    onError: (error) => {
        toast({ variant: "destructive", title: "Hata", description: `İşlem sırasında bir hata oluştu: ${error.message}` });
    }
  });
  
  const onSubmit = (data: UserFormData) => {
    userMutation.mutate(data);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}</DialogTitle>
          <DialogDescription>
            {user ? "Kullanıcının bilgilerini ve rolünü güncelleyin." : "Yeni bir kullanıcı oluşturun ve rol atayın."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad Soyad</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-posta</FormLabel>
                  <FormControl>
                    <Input placeholder="test@example.com" {...field} disabled={!!user} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!user && (
              <>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şifre</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Şifre Tekrar</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
                  <Select onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedRole(value as Role);
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Rol seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {roleOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedRole && <p className="text-sm text-muted-foreground mt-2">{ROLES[selectedRole]}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={userMutation.isPending}>
                {userMutation.isPending ? (user ? 'Kaydediliyor...' : 'Oluşturuluyor...') : (user ? 'Kaydet' : 'Oluştur')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
