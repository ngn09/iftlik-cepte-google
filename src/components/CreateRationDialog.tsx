
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
import { Separator } from "@/components/ui/separator";
import { AnimalGroup, Ration } from "@/data/rations";
import { FeedItem } from "@/data/feedStock";
import { Plus, Trash2 } from "lucide-react";

const rationFormSchema = z.object({
  name: z.string().min(2, { message: "Rasyon adı en az 2 karakter olmalıdır." }),
  animalGroupId: z.string({ required_error: "Lütfen bir hayvan grubu seçin." }),
  items: z.array(
    z.object({
      feedStockId: z.string({ required_error: "Lütfen bir yem seçin." }),
      amount: z.coerce.number().gt(0, { message: "Miktar 0'dan büyük olmalıdır." }),
    })
  ).min(1, { message: "Rasyona en az bir yem eklemelisiniz." }),
});

type RationFormValues = z.infer<typeof rationFormSchema>;

interface CreateRationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: RationFormValues) => void;
  animalGroups: AnimalGroup[];
  feedStock: FeedItem[];
  defaultGroupId?: string;
  initialData?: Ration | null;
}

export function CreateRationDialog({ isOpen, onOpenChange, onSubmit, animalGroups, feedStock, defaultGroupId, initialData }: CreateRationDialogProps) {
  const isEditMode = !!initialData;

  const form = useForm<RationFormValues>({
    resolver: zodResolver(rationFormSchema),
    defaultValues: {
      name: "",
      items: [{ feedStockId: "", amount: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  React.useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        form.reset({
          name: initialData.name,
          animalGroupId: initialData.animalGroupId.toString(),
          items: initialData.items.map(item => ({
            feedStockId: item.feedStockId.toString(),
            amount: item.amount,
          })),
        });
      } else {
        form.reset({
          name: "",
          animalGroupId: defaultGroupId || undefined,
          items: [{ feedStockId: "", amount: 1 }],
        });
      }
    }
  }, [isOpen, isEditMode, initialData, defaultGroupId, form]);

  const handleFormSubmit = (data: RationFormValues) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Rasyonu Düzenle" : "Yeni Rasyon Oluştur"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Rasyon bilgilerini düzenlemek için aşağıdaki alanları güncelleyin."
              : "Yeni bir yem rasyonu oluşturmak için aşağıdaki alanları doldurun."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rasyon Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: Yüksek Verim Rasyonu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="animalGroupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hayvan Grubu</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Bir hayvan grubu seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {animalGroups.map((group) => (
                          <SelectItem key={group.id} value={group.id.toString()}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Rasyon İçeriği</h3>
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-end gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.feedStockId`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Yem</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Bir yem seçin" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {feedStock.map((item) => (
                              <SelectItem key={item.id} value={item.id.toString()}>
                                {item.name} ({item.stockAmount} {item.unit} stokta)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Miktar (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Miktar" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)} disabled={fields.length <= 1}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
               <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ feedStockId: "", amount: 1 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Yem Ekle
                </Button>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>İptal</Button>
              <Button type="submit">{isEditMode ? "Değişiklikleri Kaydet" : "Rasyonu Kaydet"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
