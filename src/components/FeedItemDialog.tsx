
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
import { FeedStockItem } from "@/hooks/useFeedStock";

const feedItemFormSchema = z.object({
  name: z.string().min(2, { message: "Yem adı en az 2 karakter olmalıdır." }),
  type: z.enum(["Tahıl", "Kaba Yem", "Konsantre", "Katkı"], {
    required_error: "Yem türü seçilmelidir.",
  }),
  stock_amount: z.coerce.number().min(0, { message: "Stok miktarı 0 veya daha büyük olmalıdır." }),
  unit: z.enum(["kg", "ton"], {
    required_error: "Birim seçilmelidir.",
  }),
  supplier: z.string().optional(),
});

type FeedItemFormValues = z.infer<typeof feedItemFormSchema>;

interface FeedItemDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: FeedItemFormValues) => void;
  initialData?: FeedStockItem | null;
}

export function FeedItemDialog({ isOpen, onOpenChange, onSubmit, initialData }: FeedItemDialogProps) {
  const form = useForm<FeedItemFormValues>({
    resolver: zodResolver(feedItemFormSchema),
    defaultValues: {
      name: "",
      type: "Tahıl",
      stock_amount: 0,
      unit: "kg",
      supplier: "",
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          type: initialData.type,
          stock_amount: Number(initialData.stock_amount),
          unit: initialData.unit,
          supplier: initialData.supplier || "",
        });
      } else {
        form.reset({
          name: "",
          type: "Tahıl",
          stock_amount: 0,
          unit: "kg",
          supplier: "",
        });
      }
    }
  }, [initialData, isOpen, form]);

  const handleFormSubmit = (data: FeedItemFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Yem Bilgilerini Düzenle" : "Yeni Yem Ekle"}
          </DialogTitle>
          <DialogDescription>
            {initialData 
              ? "Mevcut yem bilgilerini güncelleyin." 
              : "Yeni bir yem öğesi ekleyin."
            }
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
                  <FormLabel>Yem Türü</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Yem türünü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Tahıl">Tahıl</SelectItem>
                      <SelectItem value="Kaba Yem">Kaba Yem</SelectItem>
                      <SelectItem value="Konsantre">Konsantre</SelectItem>
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
                name="stock_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok Miktarı</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
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
                          <SelectValue />
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
                  <FormLabel>Tedarikçi (İsteğe Bağlı)</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: YemSan A.Ş." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit">
                {initialData ? "Güncelle" : "Ekle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
