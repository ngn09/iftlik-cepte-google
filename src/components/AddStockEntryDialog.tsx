
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
import { FeedStockItem } from "@/hooks/useFeedStock";

const addStockEntryFormSchema = z.object({
  amountToAdd: z.coerce.number().positive({ message: "Eklenecek miktar pozitif olmalıdır." }),
  supplier: z.string().min(2, { message: "Tedarikçi adı en az 2 karakter olmalıdır." }),
  document: z.instanceof(File).optional(),
});

type AddStockEntryFormValues = z.infer<typeof addStockEntryFormSchema>;

interface AddStockEntryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: AddStockEntryFormValues) => void;
  feedItem: FeedStockItem | null;
}

export function AddStockEntryDialog({ isOpen, onOpenChange, onSubmit, feedItem }: AddStockEntryDialogProps) {
  const form = useForm<AddStockEntryFormValues>({
    resolver: zodResolver(addStockEntryFormSchema),
    defaultValues: {
      amountToAdd: 0,
      supplier: "",
      document: undefined,
    }
  });

  React.useEffect(() => {
    if (isOpen && feedItem) {
      form.reset({
        amountToAdd: 0,
        supplier: feedItem.supplier || "",
        document: undefined
      });
    }
  }, [feedItem, isOpen, form]);

  const handleFormSubmit = (data: AddStockEntryFormValues) => {
    onSubmit(data);
    form.reset();
  };

  if (!feedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{feedItem.name} - Yeni Stok Girişi</DialogTitle>
          <DialogDescription>
            Bu yem için yeni stok giriş bilgilerini girin. Mevcut stok: {feedItem.stock_amount} {feedItem.unit}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="amountToAdd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eklenecek Miktar ({feedItem.unit})</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
            <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Belge Yükle (Fatura, İrsaliye vb.)</FormLabel>
                  <FormControl>
                    <Input 
                      type="file" 
                      onChange={(e) => field.onChange(e.target.files?.[0])} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit">Girişi Kaydet</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
