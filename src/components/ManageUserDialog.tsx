
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import type { User } from "@/pages/Users";
import { useEffect } from "react";
import { userFormSchema, type UserFormData } from "@/config/schemas/userSchema";
import { useUserMutation } from "@/hooks/useUserMutation";
import { UserFormFields } from "./UserFormFields";

interface ManageUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageUserDialog({ user, open, onOpenChange }: ManageUserDialogProps) {
  const isEditing = !!user;

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
          password: "",
          confirmPassword: "",
        });
      } else {
        form.reset({
          id: undefined,
          full_name: "",
          email: "",
          role: "İşçi",
          password: "",
          confirmPassword: "",
        });
      }
    }
  }, [user, open, form]);

  const { mutate: userMutation, isPending } = useUserMutation(() => onOpenChange(false), isEditing);
  
  const onSubmit = (data: UserFormData) => {
    userMutation(data);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Kullanıcıyı Düzenle" : "Yeni Kullanıcı Ekle"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Kullanıcının bilgilerini ve rolünü güncelleyin." : "Yeni bir kullanıcı oluşturun ve rol atayın."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <UserFormFields control={form.control} watch={form.watch} isEditing={isEditing} />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (isEditing ? 'Kaydediliyor...' : 'Oluşturuluyor...') : (isEditing ? 'Kaydet' : 'Oluştur')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
