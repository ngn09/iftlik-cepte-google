
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Plus, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimalTable } from "@/components/AnimalTable";
import { parseISO, format, differenceInMonths } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Label } from "@/components/ui/label";

const mockAnimals = [
  {
    id: 'TR-34001',
    species: 'Sığır',
    breed: 'Holstein',
    status: 'Aktif',
    lastUpdated: '2025-06-14',
    dateOfBirth: '2022-03-15',
    gender: 'Dişi',
  },
  {
    id: 'TR-35012',
    species: 'Koyun',
    breed: 'Merinos',
    status: 'Aktif',
    lastUpdated: '2025-06-12',
    dateOfBirth: '2023-01-20',
    gender: 'Erkek',
  },
  {
    id: 'TR-06055',
    species: 'Sığır',
    breed: 'Angus',
    status: 'Satıldı',
    lastUpdated: '2025-05-28',
    dateOfBirth: '2021-08-10',
    gender: 'Erkek',
  },
  {
    id: 'TR-16089',
    species: 'Koyun',
    breed: 'Akkaraman',
    status: 'Arşivlendi',
    lastUpdated: '2025-04-10',
    dateOfBirth: '2020-05-01',
    gender: 'Dişi',
  },
  {
    id: 'TR-34002',
    species: 'Sığır',
    breed: 'Holstein',
    status: 'Aktif',
    lastUpdated: '2025-06-10',
    dateOfBirth: '2025-03-01',
    gender: 'Dişi',
  },
  {
    id: 'TR-35013',
    species: 'Koyun',
    breed: 'Merinos',
    status: 'Aktif',
    lastUpdated: '2025-06-11',
    dateOfBirth: '2024-11-15',
    gender: 'Erkek',
  },
];


const Animals = () => {
  const [filter, setFilter] = useState('');
  const [calfAgeLimit, setCalfAgeLimit] = useState(12); // months

  const getLatestUpdateDate = () => {
    if (mockAnimals.length === 0) return new Date();
    const dates = mockAnimals.map(a => parseISO(a.lastUpdated));
    return new Date(Math.max.apply(null, dates as any));
  };

  const latestUpdateDate = getLatestUpdateDate();

  const getAgeInMonths = (dob: string): number => {
    return differenceInMonths(new Date(), parseISO(dob));
  };

  const animalsForStats = mockAnimals.filter(a => a.status !== 'Arşivlendi');
  
  const totalAnimalsStat = animalsForStats.length;
  const maleAnimalsStat = animalsForStats.filter(a => a.gender === 'Erkek').length;
  const femaleAnimalsStat = animalsForStats.filter(a => a.gender === 'Dişi').length;
  const calfCountStat = animalsForStats.filter(a => getAgeInMonths(a.dateOfBirth) <= calfAgeLimit).length;

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
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Hayvan</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAnimalsStat}</div>
            <p className="text-xs text-muted-foreground">Aktif hayvan sayısı</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erkek</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maleAnimalsStat}</div>
            <p className="text-xs text-muted-foreground">Toplam erkek hayvan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dişi</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{femaleAnimalsStat}</div>
            <p className="text-xs text-muted-foreground">Toplam dişi hayvan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buzağı/Kuzu</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calfCountStat}</div>
            <div className="flex items-center gap-2 mt-1">
              <Label htmlFor="calf-age" className="text-xs text-muted-foreground whitespace-nowrap">Yaş sınırı (ay):</Label>
              <Input
                id="calf-age"
                type="number"
                value={calfAgeLimit}
                onChange={(e) => setCalfAgeLimit(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                min="1"
                className="h-7 w-16 text-xs p-1"
              />
            </div>
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
