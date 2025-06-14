
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { fixedAssets } from "@/data/inventory";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, File, Image, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "İsim en az 2 karakter olmalıdır." }),
  description: z.string().min(10, { message: "Açıklama en az 10 karakter olmalıdır." }),
  value: z.coerce.number().positive({ message: "Değer pozitif bir sayı olmalıdır." }),
});

const InventoryItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  // We use state to hold the asset data, so we can update it after editing
  const [asset, setAsset] = useState(() => fixedAssets.find(a => a.id === Number(id)));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      name: asset?.name || '',
      description: asset?.description || '',
      value: asset?.value || 0,
    }
  });

  // This effect synchronizes the form with the asset state when it changes.
  useEffect(() => {
    if (asset) {
      form.reset({
        name: asset.name,
        description: asset.description,
        value: asset.value,
      });
    }
  }, [asset, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (asset) {
      const updatedAsset = { ...asset, ...values };
      setAsset(updatedAsset);
      // NOTE: This will only update the data on the client-side for the current session.
      // The original `fixedAssets` array is not modified.
      const assetIndex = fixedAssets.findIndex(a => a.id === asset.id);
      if (assetIndex !== -1) {
          fixedAssets[assetIndex] = { ...fixedAssets[assetIndex], ...values };
      }

      toast({
        title: "Başarılı!",
        description: `${values.name} bilgileri güncellendi.`,
      });
      setIsEditDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Bakımda':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Arızalı':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (!asset) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Demirbaş Bulunamadı</h2>
        <p className="text-muted-foreground mb-4">Aradığınız demirbaş envanterde mevcut değil.</p>
        <Button asChild>
          <Link to="/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Envanter Listesine Geri Dön
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{asset.name}</h1>
        <div className="flex gap-2">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Düzenle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Demirbaşı Düzenle</DialogTitle>
                <DialogDescription>
                  Demirbaş bilgilerini güncelleyin. Kaydetmek için değişiklikleri tamamlayın.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demirbaş Adı</FormLabel>
                        <FormControl>
                          <Input placeholder="Örn: John Deere Traktör" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mevcut Değer (₺)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Örn: 1250000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Açıklama</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Demirbaş hakkında detaylı açıklama..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        İptal
                      </Button>
                    </DialogClose>
                    <Button type="submit">Değişiklikleri Kaydet</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Button asChild variant="outline">
            <Link to="/inventory">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Geri Dön
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demirbaş Detayları</CardTitle>
          <CardDescription>Demirbaş hakkında ayrıntılı bilgiler.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <p><span className="font-semibold">Kategori:</span> {asset.category}</p>
            <p><span className="font-semibold">Alım Tarihi:</span> {asset.purchaseDate}</p>
            <p><span className="font-semibold">Mevcut Değeri:</span> {asset.value.toLocaleString('tr-TR')} ₺</p>
            <div>
              <span className="font-semibold">Durum: </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(asset.status)}`}>
                {asset.status}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <p><span className="font-semibold">Son Bakım:</span> {asset.lastMaintenance}</p>
            <p><span className="font-semibold">Sıradaki Bakım:</span> {asset.nextMaintenance}</p>
          </div>
          <div className="md:col-span-2">
            <p className="font-semibold">Açıklama:</p>
            <p className="text-muted-foreground">{asset.description}</p>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2 border-t p-6">
          <Button variant="outline">
            <File className="mr-2 h-4 w-4" />
            Belge Yükle
          </Button>
          <Button variant="outline">
            <Image className="mr-2 h-4 w-4" />
            Resim Yükle
          </Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Ekli Dosyalar ve Resimler</CardTitle>
            <CardDescription>Bu demirbaşa ait yüklenmiş dosyalar ve resimler.</CardDescription>
        </CardHeader>
        <CardContent>
            {(asset.images?.length > 0 || asset.documents?.length > 0) ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {asset.images?.map((img, index) => (
                        <div key={`img-${index}`} className="relative group">
                            <img src={img} alt={`${asset.name} resmi ${index + 1}`} className="rounded-lg object-cover aspect-square w-full" />
                             <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                <p className="text-white text-sm font-bold">Resim {index + 1}</p>
                            </div>
                        </div>
                    ))}
                    {asset.documents?.map((doc, index) => (
                        <a key={`doc-${index}`} href="#" className="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg hover:bg-accent transition-colors">
                            <File className="h-10 w-10 text-muted-foreground"/>
                            <span className="text-sm text-center text-muted-foreground">{doc}</span>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>Yüklenmiş resim veya belge bulunmamaktadır.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryItemDetails;

