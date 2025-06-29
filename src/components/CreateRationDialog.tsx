
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus } from "lucide-react";
import { FeedStockItem } from "@/hooks/useFeedStock";

const rationFormSchema = z.object({
  name: z.string().min(2, { message: "Rasyon adı en az 2 karakter olmalıdır." }),
  animalGroupId: z.string().min(1, { message: "Hayvan grubu seçilmelidir." }),
  items: z.array(z.object({
    feedStockId: z.string().min(1, { message: "Yem seçilmelidir." }),
    amount: z.coerce.number().positive({ message: "Miktar pozitif olmalıdır." }),
  })).min(1, { message: "En az bir yem öğesi eklenmelidir." }),
});

type RationFormValues = z.infer<typeof rationFormSchema>;

interface AnimalGroup {
  id: number;
  name: string;
  animalCount: number;
}

interface CreateRationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: RationFormValues) => void;
  animalGroups: AnimalGroup[];
  feedStock: FeedStockItem[];
  defaultGroupId?: string;
  initialData?: any;
  onUpdateAnimalCount: (groupId: number, count: number) => void;
}

export function CreateRationDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  animalGroups,
  feedStock,
  defaultGroupId,
  initialData,
  onUpdateAnimalCount,
}: CreateRationDialogProps) {
  const form = useForm<RationFormValues>({
    resolver: zodResolver(rationFormSchema),
    defaultValues: {
      name: "",
      animalGroupId: defaultGroupId || "",
      items: [{ feedStockId: "", amount: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  React.useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          name: initialData.name,
          animalGroupId: initialData.animalGroupId.toString(),
          items: initialData.items.map((item: any) => ({
            feedStockId: item.feedStockId.toString(),
            amount: item.amount,
          })),
        });
      } else {
        form.reset({
          name: "",
          animalGroupId: defaultGroupId || "",
          items: [{ feedStockId: "", amount: 0 }],
        });
      }
    }
  }, [isOpen, initialData, defaultGroupId, form]);

  const handleFormSubmit = (data: RationFormValues) => {
    onSubmit(data);
    form.reset();
  };

  const selectedGroupId = form.watch("animalGroupId");
  const selectedGroup = animalGroups.find(g => g.id.toString() === selectedGroupId);

  const handleAnimalCountChange = (count: number) => {
    if (selectedGroup) {
      onUpdateAnimalCount(selectedGroup.id, count);
    }
  };

  const addFeedItem = () => {
    append({ feedStockId: "", amount: 0 });
  };

  const removeFeedItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Rasyon Düzenle" : "Yeni Rasyon Oluştur"}
          </DialogTitle>
          <DialogDescription>
            Hayvan grubu için günlük yem rasyonu oluşturun.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rasyon Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Süt İneği Günlük Rasyonu" {...field} />
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
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Hayvan grubunu seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {animalGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.name} ({group.animalCount} hayvan)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedGroup && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Hayvan Sayısı Güncelle</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Input
                      type="number"
                      value={selectedGroup.animalCount}
                      onChange={(e) => handleAnimalCountChange(parseInt(e.target.value) || 0)}
                      className="w-24"
                    />
                    <Badge variant="secondary">
                      Mevcut: {selectedGroup.animalCount} hayvan
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Yem Öğeleri</FormLabel>
                <Button type="button" variant="outline" size="sm" onClick={addFeedItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Yem Ekle
                </Button>
              </div>

              {fields.map((field, index) => (
                <Card key={field.id}>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                      <FormField
                        control={form.control}
                        name={`items.${index}.feedStockId`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Yem</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Yem seçin" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {feedStock.map((feed) => (
                                  <SelectItem key={feed.id} value={feed.id.toString()}>
                                    {feed.name} (Stok: {feed.stock_amount} {feed.unit})
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
                            <FormLabel>Miktar (kg/gün)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeedItem(index)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
                İptal
              </Button>
              <Button type="submit">
                {initialData ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
