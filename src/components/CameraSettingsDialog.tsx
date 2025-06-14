
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera } from '@/data/cameras';
import { Trash2, PlusCircle } from 'lucide-react';
import { toast } from "sonner";

interface CameraSettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  cameras: Camera[];
  setCameras: React.Dispatch<React.SetStateAction<Camera[]>>;
}

const CameraSettingsDialog = ({ isOpen, onOpenChange, cameras, setCameras }: CameraSettingsDialogProps) => {
  const [newCameraName, setNewCameraName] = React.useState('');
  const [newCameraUrl, setNewCameraUrl] = React.useState('');

  const handleAddCamera = () => {
    if (!newCameraName.trim()) {
      toast.error("Kamera adı boş bırakılamaz.");
      return;
    }
    const newCamera: Camera = {
      id: new Date().toISOString(),
      name: newCameraName,
      streamUrl: newCameraUrl || "placeholder.mp4",
      status: 'online', // Status can be updated based on real connection status
    };
    setCameras([...cameras, newCamera]);
    toast.success(`"${newCameraName}" adlı kamera eklendi.`);
    setNewCameraName('');
    setNewCameraUrl('');
  };

  const handleDeleteCamera = (id: string) => {
    const cameraToDelete = cameras.find(c => c.id === id);
    setCameras(cameras.filter(camera => camera.id !== id));
    if (cameraToDelete) {
        toast.info(`"${cameraToDelete.name}" adlı kamera silindi.`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Kamera Ayarları</DialogTitle>
          <DialogDescription>
            Kameralarınızı buradan ekleyebilir veya silebilirsiniz. Canlı yayın URL'sini (örn: RTSP, HLS) girin.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <h4 className="font-medium text-sm">Yeni Kamera Ekle</h4>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="camera-name">Kamera Adı</Label>
              <Input id="camera-name" value={newCameraName} onChange={(e) => setNewCameraName(e.target.value)} placeholder="Örn: Ahır Girişi" />
            </div>
            <div className="flex-1">
              <Label htmlFor="camera-url">Yayın URL (İsteğe bağlı)</Label>
              <Input id="camera-url" value={newCameraUrl} onChange={(e) => setNewCameraUrl(e.target.value)} placeholder="rtsp://... veya https://.../stream.m3u8" />
            </div>
            <Button onClick={handleAddCamera} size="icon" className="shrink-0">
              <PlusCircle />
              <span className="sr-only">Ekle</span>
            </Button>
          </div>
          <div className="mt-4">
            <h4 className="font-medium text-sm mb-2">Mevcut Kameralar</h4>
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {cameras.map(camera => (
                <div key={camera.id} className="flex items-center justify-between rounded-md border p-2">
                  <div>
                    <p className="font-medium">{camera.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[300px]">{camera.streamUrl}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteCamera(camera.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
              {cameras.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Henüz kamera eklenmemiş.</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Kapat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CameraSettingsDialog;
