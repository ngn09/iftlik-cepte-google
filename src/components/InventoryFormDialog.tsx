
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useInventory, InventoryItem } from "@/hooks/useInventory";
import { useToast } from "@/hooks/use-toast";

interface InventoryFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item?: InventoryItem | null;
}

const InventoryFormDialog = ({ isOpen, onOpenChange, item }: InventoryFormDialogProps) => {
  const { addInventoryItem, updateInventoryItem, isAdding, isUpdating } = useInventory();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || 'Ekipman' as const,
    purchase_date: item?.purchase_date || '',
    value: item?.value || 0,
    status: item?.status || 'Aktif' as const,
    description: item?.description || '',
    last_maintenance: item?.last_maintenance || '',
    next_maintenance: item?.next_maintenance || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.purchase_date || formData.value <= 0) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen tüm gerekli alanları doldurun."
      });
      return;
    }

    if (item) {
      updateInventoryItem({ 
        id: item.id, 
        ...formData,
        last_maintenance: formData.last_maintenance || undefined,
        next_maintenance: formData.next_maintenance || undefined
      });
    } else {
      addInventoryItem({
        ...formData,
        last_maintenance: formData.last_maintenance || undefined,
        next_maintenance: formData.next_maintenance || undefined
      });
    }
    
    onOpenChange(false);
    setFormData({
      name: '',
      category: 'Ekipman',
      purchase_date: '',
      value: 0,
      status: 'Aktif',
      description: '',
      last_maintenance: '',
      next_maintenance: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Demirbaş Bilgilerini Güncelle' : 'Yeni Demirbaş Ekle'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Demirbaş Adı *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Örn: John Deere Traktör"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select value={formData.category} onValueChange={(value: any) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Araç">Araç</SelectItem>
                <SelectItem value="Ekipman">Ekipman</SelectItem>
                <SelectItem value="Makine">Makine</SelectItem>
                <SelectItem value="Diğer">Diğer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchase_date">Alım Tarihi *</Label>
              <Input
                id="purchase_date"
                type="date"
                value={formData.purchase_date}
                onChange={(e) => setFormData({ ...formData, purchase_date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Değer (₺) *</Label>
              <Input
                id="value"
                type="number"
                min="0"
                step="0.01"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Durum</Label>
            <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Aktif">Aktif</SelectItem>
                <SelectItem value="Bakımda">Bakımda</SelectItem>
                <SelectItem value="Arızalı">Arızalı</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="last_maintenance">Son Bakım Tarihi</Label>
              <Input
                id="last_maintenance"
                type="date"
                value={formData.last_maintenance}
                onChange={(e) => setFormData({ ...formData, last_maintenance: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="next_maintenance">Sonraki Bakım Tarihi</Label>
              <Input
                id="next_maintenance"
                type="date"
                value={formData.next_maintenance}
                onChange={(e) => setFormData({ ...formData, next_maintenance: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Demirbaş hakkında ek bilgiler..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isAdding || isUpdating}>
              {item ? 'Güncelle' : 'Ekle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryFormDialog;
