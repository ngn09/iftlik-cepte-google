
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Archive } from "lucide-react";
import { differenceInYears, differenceInMonths, parseISO, format } from 'date-fns';

interface Animal {
  id: string;
  species: string;
  breed: string;
  status: string;
  dateOfBirth: string;
}

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
            <TableCell>{animal.status}</TableCell>
            <TableCell>{format(parseISO(animal.dateOfBirth), 'dd.MM.yyyy')}</TableCell>
            <TableCell>{calculateAge(animal.dateOfBirth)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="icon" disabled={animal.status === 'Arşivlendi'}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Arşivle</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
