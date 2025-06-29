
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Download, Archive, ArchiveRestore, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateRationDialog } from "@/components/CreateRationDialog";
import { FeedItemDialog } from "@/components/FeedItemDialog";
import { AddStockEntryDialog } from "@/components/AddStockEntryDialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFeedStock } from "@/hooks/useFeedStock";
import { useToast } from "@/hooks/use-toast";

// Temporary local state for features not yet in database
const initialAnimalGroups = [
  { id: 1, name: "Süt İnekleri", animalCount: 25 },
  { id: 2, name: "Buzağılar", animalCount: 8 },
  { id: 3, name: "Koyun Sürüsü", animalCount: 50 }
];

const initialRations = [
  {
    id: 1,
    name: "Süt İneği Günlük Rasyonu",
    animalGroupId: 1,
    items: [
      { feedStockId: 1, amount: 25 },
      { feedStockId: 2, amount: 8 }
    ],
    isArchived: false
  }
];

const FeedStock = () => {
  const { toast } = useToast();
  const { 
    feedStock, 
    isLoading, 
    addFeedItem, 
    isAdding, 
    updateFeedItem, 
    isUpdating 
  } = useFeedStock();

  // Local state for ration management (will be moved to Supabase later)
  const [animalGroups, setAnimalGroups] = useState(initialAnimalGroups);
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>(animalGroups[0]?.id.toString());
  const [rations, setRations] = useState(initialRations);
  const [autoModeRations, setAutoModeRations] = useState<number[]>([]);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isFeedItemDialogOpen, setIsFeedItemDialogOpen] = useState(false);
  const [isAddStockDialogOpen, setIsAddStockDialogOpen] = useState(false);
  const [editingFeedItem, setEditingFeedItem] = useState(null);
  const [editingRation, setEditingRation] = useState(null);

  const selectedGroup = animalGroups.find(g => g.id.toString() === selectedGroupId);
  const filteredRations = selectedGroupId
    ? rations.filter((r) => r.animalGroupId === parseInt(selectedGroupId, 10))
    : [];

  const handleAutoModeToggle = (checked: boolean, rationId: number) => {
    setAutoModeRations(prev => {
      const newAutoModeRations = checked
        ? [...prev, rationId]
        : prev.filter((id) => id !== rationId);
      localStorage.setItem("autoModeRations", JSON.stringify(newAutoModeRations));
      return newAutoModeRations;
    });
  };
  
  const handleSaveRation = (data: any) => {
    const rationData = {
      name: data.name,
      animalGroupId: parseInt(data.animalGroupId, 10),
      items: data.items.map((item: any) => ({
        feedStockId: parseInt(item.feedStockId, 10),
        amount: item.amount,
      })),
    };

    if (editingRation) {
      const updatedRation = { ...editingRation, ...rationData };
      setRations(prevRations =>
        prevRations.map(r => (r.id === editingRation.id ? updatedRation : r))
      );
      toast({ title: "Başarılı", description: "Rasyon güncellendi." });
    } else {
      const newRation = {
        id: Date.now(),
        ...rationData,
        isArchived: false
      };
      setRations(prevRations => [...prevRations, newRation]);
      toast({ title: "Başarılı", description: "Yeni rasyon oluşturuldu." });
    }
    setIsCreateDialogOpen(false);
  };

  const handleOpenCreateRationDialog = () => {
    setEditingRation(null);
    setIsCreateDialogOpen(true);
  };

  const handleOpenEditRationDialog = (ration: any) => {
    setEditingRation(ration);
    setIsCreateDialogOpen(true);
  };

  const handleRationDialogOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setEditingRation(null);
    }
    setIsCreateDialogOpen(isOpen);
  };

  const handleUpdateAnimalCount = (groupId: number, count: number) => {
    setAnimalGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId ? { ...group, animalCount: count } : group
      )
    );
  };

  const handleOpenFeedItemDialog = (item: any = null) => {
    setEditingFeedItem(item);
    setIsFeedItemDialogOpen(true);
  };

  const handleOpenAddStockDialog = (item: any) => {
    setEditingFeedItem(item);
    setIsAddStockDialogOpen(true);
  };

  const handleSaveFeedItem = (data: any) => {
    if (editingFeedItem) {
      // Update existing item
      updateFeedItem({
        id: editingFeedItem.id,
        ...data,
        last_updated: new Date().toISOString().split('T')[0]
      });
    } else {
      // Add new item
      addFeedItem({
        ...data,
        last_updated: new Date().toISOString().split('T')[0]
      });
    }
    setIsFeedItemDialogOpen(false);
    setEditingFeedItem(null);
  };

  const handleSaveStockEntry = (data: { amountToAdd: number; supplier: string; document?: File }) => {
    if (!editingFeedItem) return;

    if (data.document) {
      console.log(`Uploading document for ${editingFeedItem.name}: ${data.document.name}`);
    }

    // Update the stock amount
    updateFeedItem({
      id: editingFeedItem.id,
      stock_amount: editingFeedItem.stock_amount + data.amountToAdd,
      supplier: data.supplier,
      last_updated: new Date().toISOString().split('T')[0]
    });

    setIsAddStockDialogOpen(false);
    setEditingFeedItem(null);
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

    feedStock.forEach(item => {
      const row = [
        item.id,
        `"${item.name.replace(/"/g, '""')}"`,
        item.type,
        item.stock_amount,
        item.unit,
        `"${(item.supplier || '').replace(/"/g, '""')}"`,
        item.last_updated
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
    toast({ title: "Başarılı", description: "Yem stok verileri dışa aktarıldı." });
  };

  const handleArchiveRation = (rationId: number) => {
    setRations(prevRations =>
      prevRations.map(r =>
        r.id === rationId ? { ...r, isArchived: true } : r
      )
    );
    toast({ title: "Başarılı", description: "Rasyon arşivlendi." });
  };

  const handleRestoreRation = (rationId: number) => {
    setRations(prevRations =>
      prevRations.map(r => (r.id === rationId ? { ...r, isArchived: false } : r))
    );
    toast({ title: "Başarılı", description: "Rasyon geri yüklendi." });
  };

  const handleDeleteRation = (rationId: number) => {
    setRations(prevRations => prevRations.filter(r => r.id !== rationId));
    toast({ title: "Başarılı", description: "Rasyon kalıcı olarak silindi." });
  };

  const handleExportArchivedRations = () => {
    const dataToExport = rations.filter(r => r.isArchived);
    if (dataToExport.length === 0) {
      toast({ 
        variant: "destructive", 
        title: "Uyarı", 
        description: "Dışa aktarılacak arşivlenmiş rasyon bulunmuyor." 
      });
      return;
    }

    const headers = ["ID", "Rasyon Adı", "Hayvan Grubu", "İçerik"];
    const csvRows = [headers.join(',')];

    dataToExport.forEach(ration => {
      const group = animalGroups.find(g => g.id === ration.animalGroupId);
      const itemsStr = ration.items.map(item => {
        const feed = feedStock.find(f => f.id === item.feedStockId);
        return `${feed ? feed.name : 'Bilinmeyen'}: ${item.amount}${feed ? ` ${feed.unit}` : ' kg'}`;
      }).join(' | ');

      const row = [
        ration.id,
        `"${ration.name.replace(/"/g, '""')}"`,
        `"${group ? group.name : 'Bilinmeyen'}"`,
        `"${itemsStr.replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "arsivlenmis-rasyonlar.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    toast({ title: "Başarılı", description: "Arşivlenmiş rasyonlar dışa aktarıldı." });
  };

  const activeRations = rations.filter(r => !r.isArchived).sort((a, b) => b.id - a.id);
  const archivedRations = rations.filter(r => r.isArchived).sort((a, b) => b.id - a.id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Yem stok verileri yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Yem Stok Yönetimi</h1>
      </div>

      <Tabs defaultValue="stock-list">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="stock-list">Stok Listesi</TabsTrigger>
          <TabsTrigger value="ration-planning">Rasyon Yönetimi</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stock-list">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Yem Stok Listesi</CardTitle>
                <CardDescription>Mevcut yem stoğunuzu yönetin ve takip edin.</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={() => handleOpenFeedItemDialog(null)}
                  disabled={isAdding}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {isAdding ? "Ekleniyor..." : "Yeni Yem Ekle"}
                </Button>
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="mr-2 h-4 w-4" />
                  Dışa Aktar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {feedStock.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-2 text-center border-2 border-dashed rounded-lg">
                  <h3 className="text-lg font-semibold">Henüz Yem Eklenmemiş</h3>
                  <p className="text-sm text-muted-foreground">
                    İlk yem öğenizi ekleyerek başlayın.
                  </p>
                  <Button 
                    variant="secondary" 
                    className="mt-4" 
                    onClick={() => handleOpenFeedItemDialog(null)}
                    disabled={isAdding}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    İlk Yemi Ekle
                  </Button>
                </div>
              ) : (
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
                    {feedStock.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.type}</TableCell>
                        <TableCell>{`${item.stock_amount} ${item.unit}`}</TableCell>
                        <TableCell>{item.supplier || "-"}</TableCell>
                        <TableCell>{new Date(item.last_updated).toLocaleDateString('tr-TR')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleOpenFeedItemDialog(item)}
                              disabled={isUpdating}
                            >
                              Düzenle
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleOpenAddStockDialog(item)}
                            >
                              Giriş Yap
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ration-planning" className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleOpenCreateRationDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Rasyon Oluştur
            </Button>
          </div>
          
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="active">Aktif Rasyonlar</TabsTrigger>
              <TabsTrigger value="archive">Arşiv</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="pt-6">
              <div className="space-y-6">
                {activeRations.length > 0 ? (
                  activeRations.map((ration) => {
                    const rationGroup = animalGroups.find(g => g.id === ration.animalGroupId);
                    return (
                      <Card key={ration.id} className="w-full">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-4">
                            <CardTitle 
                              className="cursor-pointer hover:underline" 
                              onClick={() => handleOpenEditRationDialog(ration)}
                            >
                              {ration.name}
                            </CardTitle>
                            <div className="flex flex-col items-end gap-4">
                              <div className="flex items-center gap-6">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    id={`auto-mode-${ration.id}`}
                                    checked={autoModeRations.includes(ration.id)}
                                    onCheckedChange={(checked) => handleAutoModeToggle(checked, ration.id)}
                                  />
                                  <Label htmlFor={`auto-mode-${ration.id}`}>Otomatik Düşüm</Label>
                                </div>
                                {rationGroup && (
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium text-muted-foreground">Hayvan Sayısı:</span>
                                    <Badge variant="secondary" className="text-base font-bold">
                                      {rationGroup.animalCount}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleArchiveRation(ration.id)}
                              >
                                <Archive className="mr-2 h-4 w-4" />
                                Arşivle
                              </Button>
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
                                const feedInfo = feedStock.find(f => f.id === item.feedStockId);
                                return (
                                  <TableRow key={index}>
                                    <TableCell className="font-medium">
                                      {feedInfo ? feedInfo.name : 'Bilinmeyen Yem'}
                                    </TableCell>
                                    <TableCell className="text-right">{item.amount}</TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 gap-2 text-center border-2 border-dashed rounded-lg">
                    <h3 className="text-lg font-semibold">Aktif Rasyon Bulunamadı</h3>
                    <p className="text-sm text-muted-foreground">
                      Henüz bir rasyon oluşturulmamış veya tüm rasyonlar arşivlenmiş.
                    </p>
                    <Button 
                      variant="secondary" 
                      className="mt-4" 
                      onClick={handleOpenCreateRationDialog}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      İlk Rasyonu Oluştur
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="archive" className="pt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Arşivlenmiş Rasyonlar</CardTitle>
                    <CardDescription>Arşivlenmiş rasyonları yönetin veya dışa aktarın.</CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleExportArchivedRations} 
                    disabled={archivedRations.length === 0}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Dışa Aktar
                  </Button>
                </CardHeader>
                <CardContent>
                  {archivedRations.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rasyon Adı</TableHead>
                          <TableHead>Hayvan Grubu</TableHead>
                          <TableHead className="text-right">İşlemler</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {archivedRations.map((ration) => {
                          const group = animalGroups.find(g => g.id === ration.animalGroupId);
                          return (
                            <TableRow key={ration.id}>
                              <TableCell className="font-medium">{ration.name}</TableCell>
                              <TableCell>{group ? group.name : "Bilinmeyen"}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => handleRestoreRation(ration.id)}
                                  >
                                    <ArchiveRestore className="mr-2 h-4 w-4" />
                                    Geri Yükle
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm" 
                                    onClick={() => handleDeleteRation(ration.id)}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Kalıcı Olarak Sil
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 gap-2 text-center">
                      <h3 className="text-lg font-semibold">Arşiv Boş</h3>
                      <p className="text-sm text-muted-foreground">
                        Henüz arşivlenmiş bir rasyon bulunmuyor.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>

      <CreateRationDialog
        isOpen={isCreateDialogOpen}
        onOpenChange={handleRationDialogOpenChange}
        onSubmit={handleSaveRation}
        animalGroups={animalGroups}
        feedStock={feedStock}
        defaultGroupId={selectedGroupId}
        initialData={editingRation}
        onUpdateAnimalCount={handleUpdateAnimalCount}
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
