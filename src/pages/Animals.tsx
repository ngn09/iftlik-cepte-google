
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Plus, FileText, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnimalTable } from "@/components/AnimalTable";
import { useAnimals } from "@/hooks/useAnimals";
import { differenceInMonths, parseISO, format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

const Animals = () => {
  const { animals, isLoading } = useAnimals();
  const [filter, setFilter] = useState('');
  const [calfAgeLimit, setCalfAgeLimit] = useState(12);

  const getAgeInMonths = (dob: string): number => {
    return differenceInMonths(new Date(), parseISO(dob));
  };

  const activeAnimals = animals.filter(a => a.status !== 'Arşivlendi');
  const archivedAnimals = animals.filter(a => a.status === 'Arşivlendi');

  const filteredActiveAnimals = activeAnimals.filter(animal => 
    animal.id.toLowerCase().includes(filter.toLowerCase()) ||
    animal.breed.toLowerCase().includes(filter.toLowerCase()) ||
    animal.species.toLowerCase().includes(filter.toLowerCase())
  );

  const filteredArchivedAnimals = archivedAnimals.filter(animal => 
    animal.id.toLowerCase().includes(filter.toLowerCase()) ||
    animal.breed.toLowerCase().includes(filter.toLowerCase()) ||
    animal.species.toLowerCase().includes(filter.toLowerCase())
  );

  const getLatestUpdateDate = () => {
    if (animals.length === 0) return new Date();
    const dates = animals.map(a => parseISO(a.updated_at));
    return new Date(Math.max.apply(null, dates as any));
  };

  const latestUpdateDate = getLatestUpdateDate();

  const totalAnimals = activeAnimals.length;
  const maleAnimals = activeAnimals.filter(a => a.gender === 'Erkek').length;
  const femaleAnimals = activeAnimals.filter(a => a.gender === 'Dişi').length;
  const calfCount = activeAnimals.filter(a => getAgeInMonths(a.date_of_birth) <= calfAgeLimit).length;

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Hayvanlar</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled>
              <FileText className="h-4 w-4 mr-2" />
              PDF Aktar
            </Button>
            <Button variant="outline" disabled>
              <FileText className="h-4 w-4 mr-2" />
              Excel Aktar
            </Button>
            <Button disabled>
              <Plus className="h-4 w-4" />
              Yeni Hayvan Ekle
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="text-2xl font-bold">{totalAnimals}</div>
            <p className="text-xs text-muted-foreground">Aktif hayvan sayısı</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erkek</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{maleAnimals}</div>
            <p className="text-xs text-muted-foreground">Toplam erkek hayvan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dişi</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{femaleAnimals}</div>
            <p className="text-xs text-muted-foreground">Toplam dişi hayvan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Buzağı/Kuzu</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calfCount}</div>
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
              {animals.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Son Güncelleme: {format(latestUpdateDate, 'dd MMMM yyyy', { locale: tr })})
                </span>
              )}
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
              <TabsTrigger value="active">Aktif ({filteredActiveAnimals.length})</TabsTrigger>
              <TabsTrigger value="archived">Arşiv ({filteredArchivedAnimals.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="active" className="mt-4">
              <AnimalTable animals={filteredActiveAnimals} />
            </TabsContent>
            <TabsContent value="archived" className="mt-4">
              <AnimalTable animals={filteredArchivedAnimals} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Animals;
