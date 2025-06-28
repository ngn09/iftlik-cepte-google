
import * as React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Warehouse, HeartPulse, Video } from "lucide-react";
import MiniChat from "@/components/dashboard/MiniChat";
import { useAnimals } from "@/hooks/useAnimals";
import { useFeedStock } from "@/hooks/useFeedStock";
import { useHealthRecords } from "@/hooks/useHealthRecords";
import { useCameras } from "@/hooks/useCameras";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { animals, isLoading: animalsLoading } = useAnimals();
  const { feedStock, isLoading: feedLoading } = useFeedStock();
  const { healthRecords, isLoading: healthLoading } = useHealthRecords();
  const { cameras, isLoading: camerasLoading } = useCameras();

  const activeAnimals = animals.filter(a => a.status !== 'Arşivlendi');
  const totalFeedStock = feedStock.reduce((total, item) => {
    const amount = item.unit === 'ton' ? item.stock_amount * 1000 : item.stock_amount;
    return total + amount;
  }, 0) / 1000; // Convert to tons

  const urgentHealthAlerts = healthRecords.filter(r => 
    r.outcome === 'Tedavi Altında' && !r.is_archived
  ).length;

  const activeCameras = cameras.filter(c => c.status === 'online').length;

  const isLoading = animalsLoading || feedLoading || healthLoading || camerasLoading;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gösterge Paneli</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/animals">
          <Card className="hover:bg-muted h-full transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Hayvan Sayısı</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{activeAnimals.length}</div>
                  <p className="text-xs text-muted-foreground">Aktif hayvan sayısı</p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link to="/feed-stock">
          <Card className="hover:bg-muted h-full transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yem Stoğu (Ton)</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{totalFeedStock.toFixed(1)} Ton</div>
                  <p className="text-xs text-muted-foreground">Toplam yem stoğu</p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link to="/health">
          <Card className="hover:bg-muted h-full transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sağlık Uyarıları</CardTitle>
              <HeartPulse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-8 mb-2" />
                  <Skeleton className="h-3 w-40" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{urgentHealthAlerts}</div>
                  <p className="text-xs text-muted-foreground">Acil müdahale gerekiyor</p>
                </>
              )}
            </CardContent>
          </Card>
        </Link>
        <Link to="/cameras">
            <Card className="hover:bg-muted h-full transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kameralar</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-8 mb-2" />
                      <Skeleton className="h-3 w-24" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">{activeCameras}</div>
                      <p className="text-xs text-muted-foreground">kamera aktif</p>
                    </>
                  )}
                </CardContent>
            </Card>
        </Link>
        <MiniChat className="md:col-span-2 lg:col-span-3" />
      </div>
    </div>
  );
};

export default Dashboard;
