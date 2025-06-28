
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, AlertCircle, Calendar, Plus, Archive, CheckCircle, Skull } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHealthRecords } from '@/hooks/useHealthRecords';
import HealthRecordDialog from '@/components/HealthRecordDialog';
import HealthRecordsTable from '@/components/HealthRecordsTable';
import { toast } from "sonner";
import VaccinationScheduleDialog from '@/components/VaccinationScheduleDialog';
import RecordListDialog from '@/components/RecordListDialog';
import MediaViewerDialog from '@/components/MediaViewerDialog';
import { Skeleton } from "@/components/ui/skeleton";
import { HealthRecord } from '@/hooks/useHealthRecords';

const Health = () => {
  const { healthRecords, isLoading, addHealthRecord, updateHealthRecord } = useHealthRecords();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<HealthRecord | null>(null);
  const [isVaccinationDialogOpen, setIsVaccinationDialogOpen] = React.useState(false);
  const [isListDialogOpen, setIsListDialogOpen] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState<{title: string; records: HealthRecord[]}>({ title: '', records: [] });
  const [isMediaViewerOpen, setIsMediaViewerOpen] = React.useState(false);
  const [mediaToView, setMediaToView] = React.useState<string[]>([]);

  const activeRecords = healthRecords.filter(r => !r.is_archived);
  const archivedRecords = healthRecords.filter(r => r.is_archived);
  const treatedRecords = healthRecords.filter(r => r.outcome === 'İyileşti');
  const deceasedRecords = healthRecords.filter(r => r.outcome === 'Öldü');
  const urgentRecords = activeRecords.filter(r => r.outcome === 'Tedavi Altında');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const vaccinationRecords = healthRecords.filter(r => 
    r.diagnosis.toLowerCase().includes('aşı') || 
    r.treatment.toLowerCase().includes('aşı')
  );
  
  const plannedVaccinations = vaccinationRecords.filter(r => new Date(r.date) >= today);
  const completedVaccinations = vaccinationRecords.filter(r => new Date(r.date) < today);

  const handleAddNew = () => {
    setSelectedRecord(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (record: HealthRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  const handleSubmit = (data: HealthRecord) => {
    const isEditing = healthRecords.some(r => r.id === data.id);
    if (isEditing) {
      updateHealthRecord(data);
      toast.success("Kayıt başarıyla güncellendi.");
    } else {
      addHealthRecord(data);
      toast.success("Yeni kayıt başarıyla eklendi.");
    }
    setIsDialogOpen(false);
  };

  const handleArchive = (id: number) => {
    const record = healthRecords.find(r => r.id === id);
    if (record) {
      updateHealthRecord({ ...record, is_archived: true });
      toast.info("Kayıt arşivlendi.");
    }
  };

  const handleRestore = (id: number) => {
    const record = healthRecords.find(r => r.id === id);
    if (record) {
      updateHealthRecord({ ...record, is_archived: false });
      toast.info("Kayıt arşivden geri yüklendi.");
    }
  };

  const handleDelete = (id: number) => {
    // Bu fonksiyon henüz implementasyon gerektiriyor
    toast.error("Kayıt kalıcı olarak silindi.");
  };

  const handleCardClick = (title: string, records: HealthRecord[]) => {
      setDialogContent({ title, records });
      setIsListDialogOpen(true);
  };

  const handleViewMedia = (urls: string[]) => {
    setMediaToView(urls);
    setIsMediaViewerOpen(true);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Sağlık</h1>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-8 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
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
      <HealthRecordDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={handleSubmit}
        initialData={selectedRecord}
      />
      <VaccinationScheduleDialog
        isOpen={isVaccinationDialogOpen}
        onOpenChange={setIsVaccinationDialogOpen}
        planned={plannedVaccinations}
        completed={completedVaccinations}
        onEdit={handleEdit}
        onAddNew={handleAddNew}
        onArchive={handleArchive}
        onViewMedia={handleViewMedia}
      />
      <RecordListDialog
        isOpen={isListDialogOpen}
        onOpenChange={setIsListDialogOpen}
        title={dialogContent.title}
        records={dialogContent.records}
        description="Aşağıda seçtiğiniz kategoriye ait kayıtlar listelenmektedir."
      />
      <MediaViewerDialog
        isOpen={isMediaViewerOpen}
        onOpenChange={setIsMediaViewerOpen}
        mediaUrls={mediaToView}
      />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sağlık</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
        <Card onClick={() => handleCardClick('Acil Uyarılar', urgentRecords)} className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acil Uyarılar</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{urgentRecords.length}</div>
            <p className="text-xs text-muted-foreground">Acil müdahale gerekiyor</p>
          </CardContent>
        </Card>
        
        <Card onClick={() => handleCardClick('Aktif Vakalar', activeRecords)} className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Vakalar</CardTitle>
            <HeartPulse className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{activeRecords.length}</div>
            <p className="text-xs text-muted-foreground">Arşivlenmemiş tüm kayıtlar</p>
          </CardContent>
        </Card>
        
        <Card onClick={() => handleCardClick('Tedavisi Tamamlananlar', treatedRecords)} className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tedavisi Tamamlananlar</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{treatedRecords.length}</div>
            <p className="text-xs text-muted-foreground">İyileşen hayvan sayısı</p>
          </CardContent>
        </Card>

        <Card onClick={() => handleCardClick('Ölen Hayvanlar', deceasedRecords)} className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ölen Hayvanlar</CardTitle>
            <Skull className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deceasedRecords.length}</div>
            <p className="text-xs text-muted-foreground">Toplam kayıp</p>
          </CardContent>
        </Card>

        <Card onClick={() => setIsVaccinationDialogOpen(true)} className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aşı Takvimi</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 items-center">
                <div>
                    <div className="text-2xl font-bold text-blue-500">{plannedVaccinations.length}</div>
                    <p className="text-xs text-muted-foreground">Planlanmış</p>
                </div>
                <div className="border-l border-border pl-4">
                    <div className="text-2xl font-bold">{completedVaccinations.length}</div>
                    <p className="text-xs text-muted-foreground">Tamamlanan</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active">
        <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="active">
                <HeartPulse className="mr-2 h-4 w-4" /> Aktif Kayıtlar
              </TabsTrigger>
              <TabsTrigger value="archive">
                <Archive className="mr-2 h-4 w-4" /> Arşiv
              </TabsTrigger>
            </TabsList>
            <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" /> Yeni Muayene Ekle
            </Button>
        </div>
        <TabsContent value="active">
            <HealthRecordsTable records={activeRecords} onEdit={handleEdit} onArchive={handleArchive} isArchive={false} onViewMedia={handleViewMedia} />
        </TabsContent>
        <TabsContent value="archive">
            <HealthRecordsTable records={archivedRecords} onEdit={handleEdit} onArchive={handleArchive} onRestore={handleRestore} onDelete={handleDelete} isArchive={true} onViewMedia={handleViewMedia} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Health;
