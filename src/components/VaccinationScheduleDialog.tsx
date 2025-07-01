
import * as React from 'react';
import { HealthRecord } from '@/hooks/useHealthRecords';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Plus, CalendarCheck, CalendarClock } from 'lucide-react';
import HealthRecordsTable from '@/components/HealthRecordsTable';

interface VaccinationScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  planned: HealthRecord[];
  completed: HealthRecord[];
  onEdit: (record: HealthRecord) => void;
  onAddNew: () => void;
  onArchive: (id: number) => void;
  onViewMedia: (urls: string[]) => void;
}

const VaccinationScheduleDialog = ({ 
  isOpen, 
  onOpenChange, 
  planned, 
  completed, 
  onEdit, 
  onAddNew,
  onArchive,
  onViewMedia
}: VaccinationScheduleDialogProps) => {
  // Transform HealthRecord to match HealthRecordsTable interface
  const transformRecord = (record: HealthRecord) => ({
    id: record.id,
    animalTag: record.animal_tag,
    date: record.date,
    diagnosis: record.diagnosis,
    treatment: record.treatment,
    notes: record.notes,
    vetName: record.vet_name,
    outcome: record.outcome,
    isArchived: record.is_archived || false,
    mediaUrls: []
  });

  const transformedPlanned = planned.map(transformRecord);
  const transformedCompleted = completed.map(transformRecord);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex flex-row justify-between items-center space-y-0">
          <DialogTitle>Aşı Takvimi</DialogTitle>
           <Button onClick={onAddNew} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Yeni Aşı Kaydı
            </Button>
        </DialogHeader>
        <Tabs defaultValue="planned" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="planned">
                <CalendarClock className="mr-2 h-4 w-4" />Planlanmış ({planned.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
                <CalendarCheck className="mr-2 h-4 w-4" />Tamamlanmış ({completed.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="planned" className="mt-4">
            <HealthRecordsTable 
              records={transformedPlanned} 
              onEdit={(record) => {
                const originalRecord = planned.find(p => p.id === record.id);
                if (originalRecord) onEdit(originalRecord);
              }} 
              onArchive={onArchive} 
              isArchive={false} 
              onViewMedia={onViewMedia} 
            />
          </TabsContent>
          <TabsContent value="completed" className="mt-4">
            <HealthRecordsTable 
              records={transformedCompleted} 
              onEdit={(record) => {
                const originalRecord = completed.find(c => c.id === record.id);
                if (originalRecord) onEdit(originalRecord);
              }} 
              onArchive={onArchive} 
              isArchive={false} 
              onViewMedia={onViewMedia} 
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default VaccinationScheduleDialog;
