
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { feedStock } from "@/data/feedStock";

const FeedStock = () => {
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
              <CardTitle>Yem Stok Listesi</CardTitle>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Yem Ekle
              </Button>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedStock.map((item) => (
                    <TableRow key={item.id} className="cursor-pointer">
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.type}</TableCell>
                      <TableCell>{`${item.stockAmount} ${item.unit}`}</TableCell>
                      <TableCell>{item.supplier}</TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
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
              <CardTitle>Rasyon Planlama</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-96 gap-4 text-center">
                <h3 className="text-xl font-semibold">Rasyon Planlama Özelliği Yakında!</h3>
                <p className="text-muted-foreground max-w-md">
                  Burada hayvan gruplarınıza göre yem rasyonları oluşturabilecek, hayvan sayınıza göre toplam yem ihtiyacını hesaplayabilecek ve stok durumunuzu bu plana göre otomatik veya manuel olarak yönetebileceksiniz.
                </p>
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" disabled>Manuel Mod</Button>
                  <Button variant="outline" disabled>Otomatik Mod</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeedStock;
