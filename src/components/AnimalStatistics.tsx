
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Animal } from "@/hooks/useAnimals";
import { differenceInMonths, parseISO } from 'date-fns';

interface AnimalStatisticsProps {
  animals: Animal[];
  calfAgeLimit: number;
  onCalfAgeLimitChange: (value: number) => void;
}

export const AnimalStatistics = ({ animals, calfAgeLimit, onCalfAgeLimitChange }: AnimalStatisticsProps) => {
  const getAgeInMonths = (dob: string): number => {
    return differenceInMonths(new Date(), parseISO(dob));
  };

  const activeAnimals = animals.filter(a => a.status !== 'Arşivlendi');
  const totalAnimals = activeAnimals.length;
  const maleAnimals = activeAnimals.filter(a => a.gender === 'Erkek').length;
  const femaleAnimals = activeAnimals.filter(a => a.gender === 'Dişi').length;
  const calfCount = activeAnimals.filter(a => getAgeInMonths(a.date_of_birth) <= calfAgeLimit).length;

  return (
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
              onChange={(e) => onCalfAgeLimitChange(e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
              min="1"
              className="h-7 w-16 text-xs p-1"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
