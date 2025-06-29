
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAnimals, Animal } from "@/hooks/useAnimals";
import { useToast } from "@/hooks/use-toast";

interface AnimalFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: Animal | null;
}

const AnimalFormDialog = ({ isOpen, onOpenChange, animal }: AnimalFormDialogProps) => {
  const { addAnimal, updateAnimal, isAdding, isUpdating } = useAnimals();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: animal?.id || '',
    species: animal?.species || 'İnek' as const,
    breed: animal?.breed || '',
    gender: animal?.gender || 'Dişi' as const,
    status: animal?.status || 'Aktif' as const,
    date_of_birth: animal?.date_of_birth || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id || !formData.breed || !formData.date_of_birth) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen tüm gerekli alanları doldurun."
      });
      return;
    }

    if (animal) {
      updateAnimal({ 
        id: animal.id, 
        ...formData 
      });
    } else {
      addAnimal(formData);
    }
    
    onOpenChange(false);
    setFormData({
      id: '',
      species: 'İnek',
      breed: '',
      gender: 'Dişi',
      status: 'Aktif',
      date_of_birth: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {animal ? 'Hayvan Bilgilerini Güncelle' : 'Yeni Hayvan Ekle'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="id">Küpe No *</Label>
            <Input
              id="id"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              placeholder="Örn: TR-34001"
              disabled={!!animal}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="species">Tür *</Label>
            <Select value={formData.species} onValueChange={(value: any) => setFormData({ ...formData, species: value })}>
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

          <div className="space-y-2">
            <Label htmlFor="breed">Cins *</Label>
            <Input
              id="breed"
              value={formData.breed}
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
              placeholder="Örn: Holstein"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Cinsiyet *</Label>
            <Select value={formData.gender} onValueChange={(value: any) => setFormData({ ...formData, gender: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Erkek">Erkek</SelectItem>
                <SelectItem value="Dişi">Dişi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Durum</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Hamile">Hamile</SelectItem>
                <SelectItem value="Hasta">Hasta</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Doğum Tarihi *</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isAdding || isUpdating}>
              {animal ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnimalFormDialog;
