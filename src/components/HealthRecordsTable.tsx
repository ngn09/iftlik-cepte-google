
import { HealthRecord } from "@/data/health";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Archive, Edit, Trash2, ArchiveRestore, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface HealthRecordsTableProps {
  records: HealthRecord[];
  onEdit: (record: HealthRecord) => void;
  onArchive: (id: number) => void;
  onRestore?: (id: number) => void;
  onDelete?: (id: number) => void;
  isArchive: boolean;
}

const HealthRecordsTable = ({ records, onEdit, onArchive, onRestore, onDelete, isArchive }: HealthRecordsTableProps) => {
  return (
    <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Küpe No</TableHead>
              <TableHead>Tarih</TableHead>
              <TableHead>Teşhis</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Veteriner</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length > 0 ? (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.animalTag}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        {record.diagnosis}
                        {record.imageUrls && record.imageUrls.length > 0 && <ImageIcon className="h-4 w-4 text-muted-foreground" />}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.outcome && (
                      <Badge
                        variant={
                          record.outcome === 'Öldü'
                            ? 'destructive'
                            : 'outline'
                        }
                        className={
                          record.outcome === 'İyileşti'
                            ? 'border-transparent bg-green-100 text-green-800 hover:bg-green-200'
                            : record.outcome === 'Tedavi Altında'
                            ? 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : ''
                        }
                      >
                        {record.outcome}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{record.vetName}</TableCell>
                  <TableCell className="text-right">
                    {!isArchive ? (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(record)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onArchive(record.id)}>
                          <Archive className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => onRestore?.(record.id)}>
                          <ArchiveRestore className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onDelete?.(record.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {isArchive ? "Arşivde kayıt bulunamadı." : "Aktif kayıt bulunamadı."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
    </div>
  );
};

export default HealthRecordsTable;
