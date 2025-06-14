import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Plus, FileText, Filter, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const mockAnimals = [
  {
    id: 'TR-34001',
    species: 'Sığır',
    breed: 'Holstein',
    status: 'Aktif',
    lastUpdated: '2025-06-14',
  },
  {
    id: 'TR-35012',
    species: 'Koyun',
    breed: 'Merinos',
    status: 'Aktif',
    lastUpdated: '2025-06-12',
  },
  {
    id: 'TR-06055',
    species: 'Sığır',
    breed: 'Angus',
    status: 'Satıldı',
    lastUpdated: '2025-05-28',
  },
    {
    id: 'TR-16089',
    species: 'Koyun',
    breed: 'Akkaraman',
    status: 'Arşivlendi',
    lastUpdated: '2025-04-10',
  },
];


const Animals = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hayvanlar</h1>
        <div className="flex items-center gap-2">
            <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                PDF Aktar
            </Button>
            <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Excel Aktar
            </Button>
            <Button>
                <Plus className="h-4 w-4" />
                Yeni Hayvan Ekle
            </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Hayvan</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">Aktif hayvan sayısı</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sığır</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">856</div>
            <p className="text-xs text-muted-foreground">Holstein, Angus</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Koyun</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">398</div>
            <p className="text-xs text-muted-foreground">Merino, Akkaraman</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hayvan Listesi</CardTitle>
            <CardDescription>Çiftliğinizdeki hayvanları yönetin.</CardDescription>
          </div>
          <div className="relative w-full max-w-sm">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Hayvanları filtrele (örn: Holstein, TR-34001)" className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Küpe No</TableHead>
                <TableHead>Tür</TableHead>
                <TableHead>Cins</TableHead>
                <TableHead>Durum</TableHead>
                <TableHead>Son Güncelleme</TableHead>
                <TableHead className="text-right">İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAnimals.map((animal) => (
                <TableRow key={animal.id}>
                  <TableCell className="font-medium">{animal.id}</TableCell>
                  <TableCell>{animal.species}</TableCell>
                  <TableCell>{animal.breed}</TableCell>
                  <TableCell>{animal.status}</TableCell>
                  <TableCell>{animal.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Archive className="h-4 w-4" />
                      <span className="sr-only">Arşivle</span>
                    </Button>
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

export default Animals;
