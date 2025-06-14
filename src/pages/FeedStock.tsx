
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Download } from "lucide-react";
import { feedStock as initialFeedStock, FeedItem } from "@/data/feedStock";
import { animalGroups, rations as initialRations, Ration } from "@/data/rations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateRationDialog } from "@/components/CreateRationDialog";
import { FeedItemDialog } from "@/components/FeedItemDialog";
import { AddStockEntryDialog } from "@/components/AddStockEntryDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const FeedStock = () => {
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(animalGroups[0]?.id.toString());
  const [rations, setRations] = useState<Ration[]>(initialRations);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [feedStockItems, setFeedStockItems] = useState<FeedItem[]>(initialFeedStock);
  const [isFeedItemDialogOpen, setIsFeedItemDialogOpen] = useState(false);
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [editingFeedItem, setEditingFeedItem] = useState<FeedItem | null>(null);
  const [autoModeRations, setAutoModeRations] = useState<number[]>([]);

  const selectedGroup = animalGroups.find(g => g.id.toString() === selectedGroupId);

  const filteredRations = selectedGroupId
    ? rations.filter((r) => r.animalGroupId === parseInt(selectedGroupId, 10))
    : [];

  useEffect(() => {
    const autoModeRationIds: number[] = JSON.parse(localStorage.getItem('autoModeRations') || '[]');
    setAutoModeRations(autoModeRationIds);

    const todayStr = new Date().toLocaleDateString('tr-TR');
    const lastDeductions: { [key: number]: string } = JSON.parse(localStorage.getItem('lastDeductions') || '{}');
    
    setFeedStockItems(currentFeedStock => {
        let stockChanged = false;
        let newFeedStock = JSON.parse(JSON.stringify(currentFeedStock)); // Deep copy
        const newLastDeductions = {...lastDeductions};

        const rationsForDeduction = rations.filter(r => 
          autoModeRationIds.includes(r.id) && lastDeductions[r.id] !== todayStr
        );

        if (rationsForDeduction.length === 0) {
            return currentFeedStock;
        }

        rationsForDeduction.forEach(ration => {
            const group = animalGroups.find(g => g.id === ration.animalGroupId);
            if (group) {
              ration.items.forEach(item => {
                const totalDeduction = item.amount * group.animalCount;
                const stockItemIndex = newFeedStock.findIndex((fs: FeedItem) => fs.id === item.feedStockId);
                if (stockItemIndex > -1) {
                  newFeedStock[stockItemIndex].stockAmount -= totalDeduction;
                  stockChanged = true;
                }
              });
              newLastDeductions[ration.id] = todayStr;
            }
        });

        if (stockChanged) {
            localStorage.setItem('lastDeductions', JSON.stringify(newLastDeductions));
            console.log('Otomatik düşüm işlemi sayfa yüklendiğinde gerçekleştirildi.');
            return newFeedStock;
        }

        return currentFeedStock;
    });
  }, []); // Sadece bileşen yüklendiğinde çalışır

  const handleAutoModeToggle = (checked: boolean, rationId: number) => {
    setAutoModeRations(prev => {
      const newAutoModeRations = checked
        ? [...prev, rationId]
        : prev.filter((id) => id !== rationId);
      localStorage.setItem("autoModeRations", JSON.stringify(newAutoModeRations));
      return newAutoModeRations;
    });
  };
  
  const handleCreateRation = (data: any) => {
    const newRation: Ration = {
      id: Date.now(),
      name: data.name,
      animalGroupId: parseInt(data.animalGroupId, 10),
      items: data.items.map((item: any) => ({
        feedStockId: parseInt(item.feedStockId, 10),
        amount: item.amount,
      })),
    };
    setRations(prevRations => [...prevRations, newRation]);
  };

  const handleOpenFeedItemDialog = (item: FeedItem | null) => {
    setEditingFeedItem(item);
    setIsFeedItemDialogOpen(true);
  };

  const handleOpenAddStockDialog = (item: FeedItem) => {
    setEditingFeedItem(item);
    setIsAddStockDialogOpen(true);
  };

  const handleSaveFeedItem = (data: Omit<FeedItem, 'id' | 'lastUpdated'>) => {
    const today = new Date().toLocaleDateString('tr-TR');
    if (editingFeedItem) {
      setFeedStockItems(currentItems =>
        currentItems.map(item =>
          item.id === editingFeedItem.id
            ? { ...item, ...data, lastUpdated: today }
            : item
        )
      );
    } else {
      const newItem: FeedItem = {
        id: Date.now(),
        ...data,
        lastUpdated: today
      };
      setFeedStockItems(currentItems => [...currentItems, newItem]);
    }
    setIsFeedItemDialogOpen(false);
  };

  const handleSaveStockEntry = (data: { amountToAdd: number; supplier: string; document?: File }) => {
    if (!editingFeedItem) return;

    const today = new Date().toLocaleDateString('tr-TR');
    
    if (data.document) {
      console.log(`Uploading document for ${editingFeedItem.name}: ${data.document.name}`);
      // Gerçek bir uygulamada, dosya burada bir depolama hizmetine yüklenir.
    }

    setFeedStockItems(currentItems =>
      currentItems.map(item =>
        item.id === editingFeedItem.id
          ? {
              ...item,
              stockAmount: item.stockAmount + data.amountToAdd,
              supplier: data.supplier,
              lastUpdated: today,
            }
          : item
      )
    );

    setIsAddStockDialogOpen(false);
  };

  const handleExportData = () => {
    const headers = [
      "ID",
      "Yem Adı",
      "Türü",
      "Stok Miktarı",
      "Birim",
      "Tedarikçi",
      "Son Güncelleme",
    ];
    const csvRows = [headers.join(',')];

    feedStockItems.forEach(item => {
      const row = [
        item.id,
        `"${item.name.replace(/"/g, '""')}"`,
        item.type,
        item.stockAmount,
        item.unit,
        `"${item.supplier.replace(/"/g, '""')}"`,
        item.lastUpdated
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "yem-stok-arsivi.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Yem Stok Yönetimi</h1>
      </div>

      <Tabs defaultValue="stock-list">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="stock-list">Stok Listesi</TabsTrigger>
          <TabsTrigger value="ration-planning">Rasyon Planlama</TabsTrigger>
        </TabsList>
        <TabsContent value="stock-list">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Yem Stok Listesi</CardTitle>
                <CardDescription>Mevcut yem stoğunuzu yönetin ve takip edin.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => handleOpenFeedItemDialog(null)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Yem Ekle
                </Button>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Dışa Aktar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Yem Adı</TableHead>
                    <TableHead>Türü</TableHead>
                    <TableHead>Stok Miktarı</TableHead>
                    <TableHead>Tedarikçi</TableHead>
                    <TableHead>Son Güncelleme</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{`${item.stockAmount} ${item.unit}`}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenFeedItemDialog(item)}>
                            Düzenle
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleOpenAddStockDialog(item)}>
                            Giriş Yap
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ration-planning">
           <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Rasyon Planlama</CardTitle>
                  <CardDescription>Hayvan gruplarınıza göre rasyonları yönetin.</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                    <SelectTrigger className="w-full md:w-[280px]">
                      <SelectValue placeholder="Hayvan Grubu Seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {animalGroups.map((group) => (
                        <SelectItem key={group.id} value={group.id.toString()}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Rasyon Oluştur
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {filteredRations.length > 0 ? (
                filteredRations.map((ration) => (
                  <Card key={ration.id} className="w-full">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>{ration.name}</CardTitle>
                        <div className="flex items-center gap-6">
                           <div className="flex items-center space-x-2">
                            <Switch
                              id={`auto-mode-${ration.id}`}
                              checked={autoModeRations.includes(ration.id)}
                              onCheckedChange={(checked) => handleAutoModeToggle(checked, ration.id)}
                            />
                            <Label htmlFor={`auto-mode-${ration.id}`}>Otomatik Düşüm</Label>
                          </div>
                          {selectedGroup && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-muted-foreground">Hayvan Sayısı:</span>
                              <Badge variant="secondary" className="text-base font-bold">{selectedGroup.animalCount}</Badge>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Yem Adı</TableHead>
                            <TableHead className="text-right">Miktar (kg/gün)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ration.items.map((item, index) => {
                            const feedInfo = feedStockItems.find(f => f.id === item.feedStockId);
                            return (
                              <TableRow key={index}>
                                <TableCell className="font-medium">{feedInfo ? feedInfo.name : 'Bilinmeyen Yem'}</TableCell>
                                <TableCell className="text-right">{item.amount}</TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-64 gap-2 text-center border-2 border-dashed rounded-lg">
                  <h3 className="text-lg font-semibold">Rasyon Bulunamadı</h3>
                  <p className="text-sm text-muted-foreground">
                    Seçili grup için henüz bir rasyon oluşturulmamış.
                  </p>
                   <Button variant="secondary" className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    İlk Rasyonu Oluştur
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <CreateRationDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleCreateRation}
        animalGroups={animalGroups}
        feedStock={feedStockItems}
        defaultGroupId={selectedGroupId}
      />
      <FeedItemDialog
        isOpen={isFeedItemDialogOpen}
        onOpenChange={setIsFeedItemDialogOpen}
        onSubmit={handleSaveFeedItem}
        initialData={editingFeedItem}
      />
      <AddStockEntryDialog
        isOpen={isAddStockDialogOpen}
        onOpenChange={setIsAddStockDialogOpen}
        onSubmit={handleSaveStockEntry}
        feedItem={editingFeedItem}
      />
    </div>
  );
};

export default FeedStock;
