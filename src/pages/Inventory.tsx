
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const fixedAssets = [
  {
    id: 1,
    name: 'John Deere 5050E Traktör',
    category: 'Araç',
    purchaseDate: '20.05.2021',
    value: 1250000,
    status: 'Aktif',
  },
  {
    id: 2,
    name: 'Süt Sağım Makinesi (2x4)',
    category: 'Ekipman',
    purchaseDate: '15.01.2022',
    value: 180000,
    status: 'Aktif',
  },
  {
    id: 3,
    name: 'Tarla Pülverizatörü',
    category: 'Ekipman',
    purchaseDate: '10.03.2023',
    value: 95000,
    status: 'Aktif',
  },
  {
    id: 4,
    name: 'Ford Transit Kamyonet',
    category: 'Araç',
    purchaseDate: '02.09.2019',
    value: 780000,
    status: 'Bakımda',
  },
  {
    id: 5,
    name: 'Otomatik Yem Karma Makinesi',
    category: 'Ekipman',
    purchaseDate: '25.11.2023',
    value: 230000,
    status: 'Arızalı',
  },
];


const Inventory = () => {
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
                <TableRow key={asset.id}>
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

