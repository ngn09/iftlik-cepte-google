
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fixedAssets } from "@/data/inventory";

const Inventory = () => {
  const navigate = useNavigate();

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

  const handleRowClick = (id: number) => {
    navigate(`/inventory/${id}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Demirbaş Yönetimi</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Demirbaş Ekle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demirbaş Listesi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Demirbaş Adı</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Alım Tarihi</TableHead>
                <TableHead className="text-right">Mevcut Değeri (₺)</TableHead>
                <TableHead>Durum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fixedAssets.map((asset) => (
                <TableRow
                  key={asset.id}
                  onClick={() => handleRowClick(asset.id)}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.category}</TableCell>
                  <TableCell>{asset.purchaseDate}</TableCell>
                  <TableCell className="text-right">{asset.value.toLocaleString('tr-TR')}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(asset.status)}`}
                    >
                      {asset.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
