import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeedItem } from "@/data/feedStock";

const feedItemFormSchema = z.object({
  name: z.string().min(2, { message: "Yem adı en az 2 karakter olmalıdır." }),
  type: z.enum(['Tahıl', 'Kaba Yem', 'Konsantre', 'Katkı'], { required_error: "Lütfen bir tür seçin." }),
  stockAmount: z.coerce.number().min(0, { message: "Stok miktarı 0'dan küçük olamaz." }),
  unit: z.enum(['kg', 'ton'], { required_error: "Lütfen bir birim seçin." }),
  supplier: z.string().min(2, { message: "Tedarikçi adı en az 2 karakter olmalıdır." }),
});

type FeedItemFormValues = z.infer<typeof feedItemFormSchema>;

interface FeedItemDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: FeedItemFormValues) => void;
  initialData?: FeedItem | null;
}

export function FeedItemDialog({ isOpen, onOpenChange, onSubmit, initialData }: FeedItemDialogProps) {
  const form = useForm<FeedItemFormValues>({
    resolver: zodResolver(feedItemFormSchema),
    defaultValues: {
        name: "",
        type: undefined,
        stockAmount: 0,
        unit: undefined,
        supplier: "",
    }
  });

  React.useEffect(() => {
    if (isOpen) {
        if (initialData) {
            form.reset(initialData);
        } else {
            form.reset({
                name: "",
                type: undefined,
                stockAmount: 0,
                unit: undefined,
                supplier: "",
            });
        }
    }
  }, [initialData, isOpen, form]);

  const handleFormSubmit = (data: FeedItemFormValues) => {
    onSubmit(data);
  };
  
  const isEditMode = !!initialData;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Yemi Düzenle' : 'Yeni Yem Ekle'}</DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Yem bilgilerini güncelleyin.' : 'Yeni bir yem eklemek için formu doldurun.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yem Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Mısır Silajı" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Türü</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir yem türü seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Kaba Yem">Kaba Yem</SelectItem>
                        <SelectItem value="Konsantre">Konsantre</SelectItem>
                        <SelectItem value="Tahıl">Tahıl</SelectItem>
                        <SelectItem value="Katkı">Katkı</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stockAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Miktarı</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Miktar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birim</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Birim seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="ton">ton</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tedarikçi</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: YemSan A.Ş." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>İptal</Button>
              <Button type="submit">{isEditMode ? 'Değişiklikleri Kaydet' : 'Yemi Kaydet'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
