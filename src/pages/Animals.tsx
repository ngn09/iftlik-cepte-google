
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Plus, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimalTable } from "@/components/AnimalTable";
import { parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';

const mockAnimals = [
  {
    id: 'TR-34001',
    species: 'Sığır',
    breed: 'Holstein',
    status: 'Aktif',
    lastUpdated: '2025-06-14',
    dateOfBirth: '2022-03-15',
  },
  {
    id: 'TR-35012',
    species: 'Koyun',
    breed: 'Merinos',
    status: 'Aktif',
    lastUpdated: '2025-06-12',
    dateOfBirth: '2023-01-20',
  },
  {
    id: 'TR-06055',
    species: 'Sığır',
    breed: 'Angus',
    status: 'Satıldı',
    lastUpdated: '2025-05-28',
    dateOfBirth: '2021-08-10',
  },
    {
    id: 'TR-16089',
    species: 'Koyun',
    breed: 'Akkaraman',
    status: 'Arşivlendi',
    lastUpdated: '2025-04-10',
    dateOfBirth: '2020-05-01',
  },
];


const Animals = () => {
  const [filter, setFilter] = useState('');

  const getLatestUpdateDate = () => {
    if (mockAnimals.length === 0) return new Date();
    const dates = mockAnimals.map(a => parseISO(a.lastUpdated));
    return new Date(Math.max.apply(null, dates as any));
  };

  const latestUpdateDate = getLatestUpdateDate();

  const filteredAnimals = mockAnimals.filter(animal => 
    animal.id.toLowerCase().includes(filter.toLowerCase()) ||
    animal.breed.toLowerCase().includes(filter.toLowerCase()) ||
    animal.species.toLowerCase().includes(filter.toLowerCase())
  );

  const activeAnimals = filteredAnimals.filter(a => a.status !== 'Arşivlendi');
  const archivedAnimals = filteredAnimals.filter(a => a.status === 'Arşivlendi');

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
            <CardTitle className="flex items-baseline">
              Hayvan Listesi
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Son Güncelleme: {format(latestUpdateDate, 'dd MMMM yyyy', { locale: tr })})
              </span>
            </CardTitle>
            <CardDescription>Çiftliğinizdeki hayvanları yönetin.</CardDescription>
          </div>
          <div className="relative w-full max-w-sm">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Hayvanları filtrele (örn: Holstein, TR-34001)" 
              className="pl-10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="active">
            <TabsList className="grid w-full grid-cols-2 md:w-1/3">
              <TabsTrigger value="active">Aktif ({activeAnimals.length})</TabsTrigger>
              <TabsTrigger value="archived">Arşiv ({archivedAnimals.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <AnimalTable animals={activeAnimals} />
            </TabsContent>
            <TabsContent value="archived" className="mt-4">
              <AnimalTable animals={archivedAnimals} />
            </TabsContent>
           </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Animals;
