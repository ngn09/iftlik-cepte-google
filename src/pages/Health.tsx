
import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, AlertCircle, Calendar, Plus, Archive, Image as ImageIcon, CheckCircle, Skull, Video } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthRecord, healthRecordsData } from '@/data/health';
import HealthRecordDialog from '@/components/HealthRecordDialog';
import HealthRecordsTable from '@/components/HealthRecordsTable';
import { toast } from "sonner";
import VaccinationScheduleDialog from '@/components/VaccinationScheduleDialog';
import RecordListDialog from '@/components/RecordListDialog';
import MediaViewerDialog from '@/components/MediaViewerDialog';

const Health = () => {
  const [records, setRecords] = React.useState<HealthRecord[]>(healthRecordsData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<HealthRecord | null>(null);
  const [isVaccinationDialogOpen, setIsVaccinationDialogOpen] = React.useState(false);
  const [isListDialogOpen, setIsListDialogOpen] = React.useState(false);
  const [dialogContent, setDialogContent] = React.useState<{title: string; records: HealthRecord[]}>({ title: '', records: [] });
  const [isMediaViewerOpen, setIsMediaViewerOpen] = React.useState(false);
  const [mediaToView, setMediaToView] = React.useState<string[]>([]);

  const activeRecords = records.filter(r => !r.isArchived);
  const archivedRecords = records.filter(r => r.isArchived);
  const treatedRecords = records.filter(r => r.outcome === 'İyileşti');
  const deceasedRecords = records.filter(r => r.outcome === 'Öldü');
  const urgentRecords = activeRecords.filter(r => r.outcome === 'Tedavi Altında');

  const allMedia = records
    .flatMap(r => r.mediaUrls?.map(url => ({ recordId: r.id, url, animalTag: r.animalTag, date: r.date })) || [])
    .filter(media => media.url);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const vaccinationRecords = records.filter(r => 
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
    const isEditing = records.some(r => r.id === data.id);
    if (isEditing) {
      setRecords(records.map(r => r.id === data.id ? data : r));
      toast.success("Kayıt başarıyla güncellendi.");
    } else {
      setRecords([...records, data]);
      toast.success("Yeni kayıt başarıyla eklendi.");
    }
    setIsDialogOpen(false);
  };

  const handleArchive = (id: number) => {
    setRecords(records.map(r => r.id === id ? { ...r, isArchived: true } : r));
    toast.info("Kayıt arşivlendi.");
  };

  const handleRestore = (id: number) => {
    setRecords(records.map(r => r.id === id ? { ...r, isArchived: false } : r));
    toast.info("Kayıt arşivden geri yüklendi.");
  };

  const handleDelete = (id: number) => {
    setRecords(records.filter(r => r.id !== id));
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
        
        <Card onClick={() => setIsVaccinationDialogOpen(true)} className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aşı Takvimi</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
                <div>
                    <div className="text-2xl font-bold text-blue-500">{plannedVaccinations.length}</div>
                    <p className="text-xs text-muted-foreground">Planlanmış aşı</p>
                </div>
                <div className="border-t pt-2">
                    <div className="text-2xl font-bold">{completedVaccinations.length}</div>
                    <p className="text-xs text-muted-foreground">Tamamlanan aşılar</p>
                </div>
            </div>
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
              <TabsTrigger value="gallery">
                <ImageIcon className="mr-2 h-4 w-4" /> Görseller
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
        <TabsContent value="gallery">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allMedia.length > 0 ? allMedia.map((media) => {
                    const isVideo = /\.(mp4|webm|ogg)$/i.test(media.url);
                    return (
                        <div key={media.url + media.recordId} className="relative group cursor-pointer" onClick={() => handleViewMedia([media.url])}>
                            {isVideo ? (
                                <div className="relative w-full h-full">
                                    <video src={media.url} className="rounded-lg object-cover aspect-square w-full bg-black"/>
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <Video className="h-12 w-12 text-white/80" />
                                    </div>
                                </div>
                            ) : (
                                <img src={media.url} alt={`Sağlık kaydı görseli`} className="rounded-lg object-cover aspect-square w-full"/>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs rounded-b-lg">
                                <p className="font-bold">{media.animalTag}</p>
                                <p>{new Date(media.date).toLocaleDateString('tr-TR')}</p>
                            </div>
                        </div>
                    )
                }) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                        Görüntülenecek medya bulunamadı.
                    </div>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Health;
