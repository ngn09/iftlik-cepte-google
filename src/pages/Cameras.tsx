
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Camera, WifiOff, Settings } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useCameras } from '@/hooks/useCameras';
import CameraSettingsDialog from '@/components/CameraSettingsDialog';
import { Skeleton } from "@/components/ui/skeleton";

const Cameras = () => {
  const { cameras, isLoading } = useCameras();
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  const onlineCameras = cameras.filter(c => c.status === 'online').length;
  const offlineCameras = cameras.filter(c => c.status === 'offline').length;

  if (isLoading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Kameralar</h1>
          <Button disabled>
            <Settings />
            Kamera Ayarları
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
          {[...Array(3)].map((_, i) => (
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
            <CardTitle>Kamera Görüntüleri</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-video rounded-lg" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <CameraSettingsDialog 
        isOpen={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen}
        cameras={cameras}
        setCameras={() => {}} // Bu prop artık gerekmiyor çünkü gerçek veri kullanıyoruz
      />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Kameralar</h1>
        <Button onClick={() => setIsSettingsOpen(true)}>
          <Settings />
          Kamera Ayarları
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Kameralar</CardTitle>
            <Video className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{onlineCameras}</div>
            <p className="text-xs text-muted-foreground">Canlı yayın aktif</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Çevrimdışı</CardTitle>
            <WifiOff className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{offlineCameras}</div>
            <p className="text-xs text-muted-foreground">Bağlantı sorunu</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kamera</CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cameras.length}</div>
            <p className="text-xs text-muted-foreground">Tüm kurulu kameralar</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kamera Görüntüleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cameras.map((camera) => (
              <div key={camera.id} className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative group cursor-pointer">
                <div className="text-center text-white p-4">
                  <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400 group-hover:hidden" />
                   <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold">Canlı Yayını İzle</p>
                  </div>
                </div>
                <div className={`absolute top-2 right-2 h-3 w-3 rounded-full border-2 border-gray-900 ${camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} title={camera.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                    <p className="text-white text-sm font-semibold truncate">{camera.name}</p>
                </div>
              </div>
            ))}
             {cameras.length === 0 && (
                <div className="col-span-full text-center py-10">
                    <Camera className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Gösterilecek kamera yok.</p>
                    <p className="text-sm text-muted-foreground">Lütfen 'Kamera Ayarları'ndan yeni bir kamera ekleyin.</p>
                </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cameras;
