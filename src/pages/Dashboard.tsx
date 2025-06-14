
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Warehouse, HeartPulse, Skull, CheckCircle } from "lucide-react";
import { healthRecordsData, HealthRecord } from "@/data/health";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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


const Dashboard = () => {
  const treatedRecords = healthRecordsData.filter(r => r.outcome === 'İyileşti');
  const deceasedRecords = healthRecordsData.filter(r => r.outcome === 'Öldü');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gösterge Paneli</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Hayvan Sayısı</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+20.1% geçen aydan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yem Stoğu (Ton)</CardTitle>
            <Warehouse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34.5 Ton</div>
            <p className="text-xs text-muted-foreground">Hedefin %85'i</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sağlık Uyarıları</CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">Acil müdahale gerekiyor</p>
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
    </div>
  );
};

export default Dashboard;
