
import * as React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HealthRecord } from "@/data/health";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const healthRecordSchema = z.object({
  animalTag: z.string().min(1, "Hayvan küpesi gerekli."),
  date: z.string().min(1, "Tarih gerekli.").transform((str) => str.split('T')[0]), // Tarih formatını YYYY-MM-DD olarak ayarla
  diagnosis: z.string().min(1, "Teşhis gerekli."),
  treatment: z.string().min(1, "Tedavi gerekli."),
  notes: z.string().optional(),
  vetName: z.string().min(1, "Veteriner adı gerekli."),
  imageUrls: z.string().optional(),
});

type HealthRecordFormData = z.infer<typeof healthRecordSchema>;

interface HealthRecordDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: HealthRecord) => void;
  initialData?: HealthRecord | null;
}

const HealthRecordDialog = ({ isOpen, onOpenChange, onSubmit, initialData }: HealthRecordDialogProps) => {
  const form = useForm<HealthRecordFormData>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      animalTag: '',
      date: '',
      diagnosis: '',
      treatment: '',
      notes: '',
      vetName: '',
      imageUrls: '',
    },
  });

  React.useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        imageUrls: initialData.imageUrls?.join(', ') || '',
      });
    } else {
      form.reset({
        animalTag: '',
        date: new Date().toISOString().split('T')[0],
        diagnosis: '',
        treatment: '',
        notes: '',
        vetName: '',
        imageUrls: '',
      });
    }
  }, [initialData, form]);

  const handleSubmit = (data: HealthRecordFormData) => {
    const recordToSubmit: HealthRecord = {
      id: initialData?.id || Date.now(),
      isArchived: initialData?.isArchived || false,
      ...data,
      imageUrls: data.imageUrls ? data.imageUrls.split(',').map(url => url.trim()).filter(url => url) : [],
    };
    onSubmit(recordToSubmit);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Kaydı Düzenle' : 'Yeni Muayene Ekle'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Mevcut sağlık kaydını güncelleyin.' : 'Yeni bir sağlık kaydı oluşturun.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField control={form.control} name="animalTag" render={({ field }) => ( <FormItem><FormLabel>Hayvan Küpe No</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Tarih</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="diagnosis" render={({ field }) => ( <FormItem><FormLabel>Teşhis</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="treatment" render={({ field }) => ( <FormItem><FormLabel>Tedavi</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="notes" render={({ field }) => ( <FormItem><FormLabel>Notlar</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="vetName" render={({ field }) => ( <FormItem><FormLabel>Veteriner Hekim</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="imageUrls" render={({ field }) => ( <FormItem><FormLabel>Görsel URL'leri (virgülle ayırın)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
            <DialogFooter>
              <Button type="submit">Kaydet</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default HealthRecordDialog;
