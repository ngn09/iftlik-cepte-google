
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Archive, Edit } from "lucide-react";
import { differenceInYears, differenceInMonths, parseISO, format } from 'date-fns';
import { Animal } from "@/hooks/useAnimals";

interface AnimalTableProps {
  animals: Animal[];
}

const calculateAge = (dob: string): string => {
  const birthDate = parseISO(dob);
  const today = new Date();
  const years = differenceInYears(today, birthDate);
  const months = differenceInMonths(today, birthDate) % 12;
  
  if (years === 0 && months === 0) return "Yeni doğan";
  if (years === 0) return `${months} aylık`;
  if (months === 0) return `${years} yaşında`;
  return `${years} yaş, ${months} ay`;
};

export const AnimalTable = ({ animals }: AnimalTableProps) => {
  if (animals.length === 0) {
    return <div className="text-center py-10 text-muted-foreground">Bu kategoride gösterilecek hayvan bulunmuyor.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Küpe No</TableHead>
          <TableHead>Tür</TableHead>
          <TableHead>Cins</TableHead>
          <TableHead>Cinsiyet</TableHead>
          <TableHead>Durum</TableHead>
          <TableHead>Doğum Tarihi</TableHead>
          <TableHead>Yaş</TableHead>
          <TableHead className="text-right">İşlemler</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {animals.map((animal) => (
          <TableRow key={animal.id}>
            <TableCell className="font-medium">{animal.id}</TableCell>
            <TableCell>{animal.species}</TableCell>
            <TableCell>{animal.breed}</TableCell>
            <TableCell>{animal.gender}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                animal.status === 'Aktif' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
                animal.status === 'Hamile' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' :
                animal.status === 'Hasta' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
              }`}>
                {animal.status}
              </span>
            </TableCell>
            <TableCell>{format(parseISO(animal.date_of_birth), 'dd.MM.yyyy')}</TableCell>
            <TableCell>{calculateAge(animal.date_of_birth)}</TableCell>
            <TableCell className="text-right">
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="icon">
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Düzenle</span>
                </Button>
                <Button variant="ghost" size="icon" disabled={animal.status === 'Arşivlendi'}>
                  <Archive className="h-4 w-4" />
                  <span className="sr-only">Arşivle</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
