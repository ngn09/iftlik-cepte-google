
import { useParams, Link } from "react-router-dom";
import { fixedAssets } from "@/data/inventory";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const InventoryItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const asset = fixedAssets.find(a => a.id === Number(id));

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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{asset.name}</h1>
        <Button asChild variant="outline">
          <Link to="/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Geri Dön
          </Link>
        </Button>
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
      </Card>
    </div>
  );
};

export default InventoryItemDetails;
