import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

interface MapLocation {
  id: string;
  name: string;
  type: 'Ahır' | 'Yem Deposu' | 'Su Deposu' | 'Ofis' | 'Makine Parkı' | 'Mera' | 'Padok';
  status: 'Aktif' | 'Bakımda' | 'Kapalı';
  coordinates: { x: number; y: number };
  size: { width: number; height: number };
  capacity?: number;
  currentOccupancy?: number;
  description: string;
  lastUpdated: string;
  animals?: {
    species: string;
    breed: string;
    count: number;
    feedType?: string;
  }[];
}

interface FarmLocationEditorProps {
  isOpen: boolean;
  onClose: () => void;
  location?: MapLocation;
  onSave: (location: MapLocation) => void;
  onDelete?: (locationId: string) => void;
}

const FarmLocationEditor = ({ isOpen, onClose, location, onSave, onDelete }: FarmLocationEditorProps) => {
  const [formData, setFormData] = useState<MapLocation>(() => 
    location || {
      id: `loc_${Date.now()}`,
      name: "",
      type: "Padok",
      status: "Aktif",
      coordinates: { x: 50, y: 50 },
      size: { width: 120, height: 80 },
      description: "",
      lastUpdated: new Date().toISOString().split('T')[0],
      animals: []
    }
  );

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCoordinateChange = (axis: 'x' | 'y', value: number) => {
    setFormData(prev => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [axis]: value
      }
    }));
  };

  const handleSizeChange = (dimension: 'width' | 'height', value: number) => {
    setFormData(prev => ({
      ...prev,
      size: {
        ...prev.size,
        [dimension]: value
      }
    }));
  };

  const addAnimal = () => {
    setFormData(prev => ({
      ...prev,
      animals: [
        ...(prev.animals || []),
        { species: "İnek", breed: "", count: 0, feedType: "" }
      ]
    }));
  };

  const updateAnimal = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      animals: prev.animals?.map((animal, i) => 
        i === index ? { ...animal, [field]: value } : animal
      ) || []
    }));
  };

  const removeAnimal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      animals: prev.animals?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleDelete = () => {
    if (location && onDelete) {
      onDelete(location.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {location ? 'Konumu Düzenle' : 'Yeni Konum Ekle'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Temel Bilgiler */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Konum Adı</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Örn: Ana Ahır"
              />
            </div>
            <div>
              <Label htmlFor="type">Tür</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ahır">Ahır</SelectItem>
                  <SelectItem value="Padok">Padok</SelectItem>
                  <SelectItem value="Mera">Mera</SelectItem>
                  <SelectItem value="Yem Deposu">Yem Deposu</SelectItem>
                  <SelectItem value="Su Deposu">Su Deposu</SelectItem>
                  <SelectItem value="Ofis">Ofis</SelectItem>
                  <SelectItem value="Makine Parkı">Makine Parkı</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status">Durum</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Bakımda">Bakımda</SelectItem>
                  <SelectItem value="Kapalı">Kapalı</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="capacity">Kapasite</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity || ''}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="occupancy">Mevcut Doluluk</Label>
              <Input
                id="occupancy"
                type="number"
                value={formData.currentOccupancy || ''}
                onChange={(e) => handleInputChange('currentOccupancy', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
          </div>

          {/* Konum ve Boyut */}
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label htmlFor="x">X Pozisyonu (%)</Label>
              <Input
                id="x"
                type="number"
                value={formData.coordinates.x}
                onChange={(e) => handleCoordinateChange('x', parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="y">Y Pozisyonu (%)</Label>
              <Input
                id="y"
                type="number"
                value={formData.coordinates.y}
                onChange={(e) => handleCoordinateChange('y', parseFloat(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>
            <div>
              <Label htmlFor="width">Genişlik (px)</Label>
              <Input
                id="width"
                type="number"
                value={formData.size.width}
                onChange={(e) => handleSizeChange('width', parseInt(e.target.value) || 0)}
                min="20"
              />
            </div>
            <div>
              <Label htmlFor="height">Yükseklik (px)</Label>
              <Input
                id="height"
                type="number"
                value={formData.size.height}
                onChange={(e) => handleSizeChange('height', parseInt(e.target.value) || 0)}
                min="20"
              />
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Konum açıklaması..."
            />
          </div>

          {/* Hayvan Bilgileri */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Hayvan Bilgileri</Label>
              <Button onClick={addAnimal} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Hayvan Ekle
              </Button>
            </div>
            
            {formData.animals?.map((animal, index) => (
              <div key={index} className="border rounded-lg p-3 mb-3">
                <div className="grid grid-cols-5 gap-2 items-end">
                  <div>
                    <Label>Tür</Label>
                    <Select 
                      value={animal.species} 
                      onValueChange={(value) => updateAnimal(index, 'species', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="İnek">İnek</SelectItem>
                        <SelectItem value="Koyun">Koyun</SelectItem>
                        <SelectItem value="Keçi">Keçi</SelectItem>
                        <SelectItem value="Tavuk">Tavuk</SelectItem>
                        <SelectItem value="Diğer">Diğer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Irk</Label>
                    <Input
                      value={animal.breed}
                      onChange={(e) => updateAnimal(index, 'breed', e.target.value)}
                      placeholder="Holstein"
                    />
                  </div>
                  <div>
                    <Label>Sayı</Label>
                    <Input
                      type="number"
                      value={animal.count}
                      onChange={(e) => updateAnimal(index, 'count', parseInt(e.target.value) || 0)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label>Rasyon</Label>
                    <Input
                      value={animal.feedType || ''}
                      onChange={(e) => updateAnimal(index, 'feedType', e.target.value)}
                      placeholder="Karma Yem"
                    />
                  </div>
                  <div>
                    <Button
                      onClick={() => removeAnimal(index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Aksiyonlar */}
          <div className="flex justify-between pt-4">
            <div>
              {location && onDelete && (
                <Button onClick={handleDelete} variant="destructive">
                  Konumu Sil
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline">
                İptal
              </Button>
              <Button onClick={handleSave}>
                {location ? 'Güncelle' : 'Kaydet'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FarmLocationEditor;