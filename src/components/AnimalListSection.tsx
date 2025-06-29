
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Filter } from "lucide-react";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { AnimalTable } from "@/components/AnimalTable";
import { Animal } from "@/hooks/useAnimals";

interface AnimalListSectionProps {
  animals: Animal[];
  filter: string;
  onFilterChange: (value: string) => void;
  latestUpdateDate: Date;
}

export const AnimalListSection = ({ 
  animals, 
  filter, 
  onFilterChange, 
  latestUpdateDate 
}: AnimalListSectionProps) => {
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

  return (
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
            onChange={(e) => onFilterChange(e.target.value)}
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
  );
};
