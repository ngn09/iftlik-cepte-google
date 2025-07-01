
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HealthRecord } from '@/hooks/useHealthRecords';
import { Badge } from "@/components/ui/badge";

interface RecordListDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    records: HealthRecord[];
    title: string;
    description?: string;
}

const RecordListDialog = ({ isOpen, onOpenChange, records, title, description }: RecordListDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Küpe No</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Teşhis</TableHead>
                            <TableHead>Durum</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.length > 0 ? records.map(record => (
                            <TableRow key={record.id}>
                                <TableCell>{record.animal_tag}</TableCell>
                                <TableCell>{new Date(record.date).toLocaleDateString('tr-TR')}</TableCell>
                                <TableCell>{record.diagnosis}</TableCell>
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
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center">Kayıt bulunamadı.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </DialogContent>
    </Dialog>
);

export default RecordListDialog;
