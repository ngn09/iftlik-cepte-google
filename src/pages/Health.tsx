import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse, AlertCircle, Calendar, Plus, Archive, Image as ImageIcon, CheckCircle, Skull } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HealthRecord, healthRecordsData } from '@/data/health';
import HealthRecordDialog from '@/components/HealthRecordDialog';
import HealthRecordsTable from '@/components/HealthRecordsTable';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import VaccinationScheduleDialog from '@/components/VaccinationScheduleDialog';

const RecordListDialog = ({ records, title, triggerText }: { records: HealthRecord[], title: string, triggerText: string }) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="mt-2 text-xs h-auto py-1 px-2">
                {triggerText}
            </Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Küpe No</TableHead>
                            <TableHead>Tarih</TableHead>
                            <TableHead>Teşhis</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {records.length > 0 ? records.map(record => (
                            <TableRow key={record.id}>
                                <TableCell>{record.animalTag}</TableCell>
                                <TableCell>{new Date(record.date).toLocaleDateString('tr-TR')}</TableCell>
                                <TableCell>{record.diagnosis}</TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center">Kayıt bulunamadı.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </DialogContent>
    </Dialog>
);

const Health = () => {
  const [records, setRecords] = React.useState<HealthRecord[]>(healthRecordsData);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [selectedRecord, setSelectedRecord] = React.useState<HealthRecord | null>(null);
  const [isVaccinationDialogOpen, setIsVaccinationDialogOpen] = React.useState(false);

  const activeRecords = records.filter(r => !r.isArchived);
  const archivedRecords = records.filter(r => r.isArchived);
  const treatedRecords = records.filter(r => r.outcome === 'İyileşti');
  const deceasedRecords = records.filter(r => r.outcome === 'Öldü');

  const allImages = records
    .flatMap(r => r.imageUrls?.map(url => ({ recordId: r.id, url, animalTag: r.animalTag, date: r.date })) || [])
    .filter(img => img.url);

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

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sağlık</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acil Uyarılar</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">3</div>
            <p className="text-xs text-muted-foreground">Acil müdahale gerekiyor</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tedavi Altında</CardTitle>
            <HeartPulse className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{activeRecords.length}</div>
            <p className="text-xs text-muted-foreground">Aktif tedavi süreci</p>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tedavisi Tamamlananlar</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{treatedRecords.length}</div>
            <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">İyileşen hayvan sayısı</p>
                {treatedRecords.length > 0 && <RecordListDialog records={treatedRecords} title="Tedavisi Tamamlananlar" triggerText="Listeyi Gör" />}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ölen Hayvanlar</CardTitle>
            <Skull className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deceasedRecords.length}</div>
            <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">Toplam kayıp</p>
                {deceasedRecords.length > 0 && <RecordListDialog records={deceasedRecords} title="Ölen Hayvanlar" triggerText="Listeyi Gör" />}
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
              <TabsTrigger value="gallery">
                <ImageIcon className="mr-2 h-4 w-4" /> Görseller
              </TabsTrigger>
            </TabsList>
            <Button onClick={handleAddNew}>
                <Plus className="mr-2 h-4 w-4" /> Yeni Muayene Ekle
            </Button>
        </div>
        <TabsContent value="active">
            <HealthRecordsTable records={activeRecords} onEdit={handleEdit} onArchive={handleArchive} isArchive={false} />
        </TabsContent>
        <TabsContent value="archive">
            <HealthRecordsTable records={archivedRecords} onEdit={handleEdit} onArchive={handleArchive} onRestore={handleRestore} onDelete={handleDelete} isArchive={true}/>
        </TabsContent>
        <TabsContent value="gallery">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allImages.length > 0 ? allImages.map((image) => (
                    <div key={image.url + image.recordId} className="relative group">
                        <img src={image.url} alt={`Sağlık kaydı görseli`} className="rounded-lg object-cover aspect-square w-full"/>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-xs rounded-b-lg">
                            <p className="font-bold">{image.animalTag}</p>
                            <p>{new Date(image.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full text-center py-8 text-muted-foreground">
                        Görüntülenecek görsel bulunamadı.
                    </div>
                )}
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Health;
