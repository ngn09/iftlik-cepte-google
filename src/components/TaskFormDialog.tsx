
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Düşük' | 'Orta' | 'Yüksek' | 'Acil';
  status: 'Beklemede' | 'Devam Ediyor' | 'Tamamlandı' | 'İptal Edildi';
  assignedTo: string;
  dueDate: string;
  category: 'Hayvan Bakımı' | 'Yem Yönetimi' | 'Sağlık' | 'Bakım' | 'Diğer';
  createdAt: string;
}

interface TaskFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  task?: Task;
  onSave: (task: Task) => void;
}

export const TaskFormDialog = ({ isOpen, onOpenChange, task, onSave }: TaskFormDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    priority: task?.priority || "",
    assignedTo: task?.assignedTo || "",
    dueDate: task?.dueDate || "",
    category: task?.category || ""
  });

  // Update form when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: task.dueDate,
        category: task.category
      });
    } else {
      setFormData({
        title: "",
        description: "",
        priority: "",
        assignedTo: "",
        dueDate: "",
        category: ""
      });
    }
  }, [task, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.priority || !formData.assignedTo || !formData.dueDate || !formData.category) {
      toast({
        title: "Hata",
        description: "Lütfen tüm gerekli alanları doldurun.",
        variant: "destructive",
      });
      return;
    }

    const taskData: Task = {
      id: task?.id || `task_${Date.now()}`,
      title: formData.title,
      description: formData.description,
      priority: formData.priority as Task['priority'],
      status: task?.status || 'Beklemede',
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate,
      category: formData.category as Task['category'],
      createdAt: task?.createdAt || new Date().toISOString().split('T')[0]
    };

    onSave(taskData);
    
    toast({
      title: "Başarılı",
      description: task ? "Görev başarıyla güncellendi." : "Görev başarıyla eklendi.",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Görev Düzenle' : 'Yeni Görev Ekle'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Görev Başlığı *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Görev başlığını girin"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Görev açıklamasını girin"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Öncelik *</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Öncelik seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Düşük">Düşük</SelectItem>
                  <SelectItem value="Orta">Orta</SelectItem>
                  <SelectItem value="Yüksek">Yüksek</SelectItem>
                  <SelectItem value="Acil">Acil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hayvan Bakımı">Hayvan Bakımı</SelectItem>
                  <SelectItem value="Yem Yönetimi">Yem Yönetimi</SelectItem>
                  <SelectItem value="Sağlık">Sağlık</SelectItem>
                  <SelectItem value="Bakım">Bakım</SelectItem>
                  <SelectItem value="Diğer">Diğer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignedTo">Atanan Kişi *</Label>
            <Input
              id="assignedTo"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="Kişi adını girin"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate">Termin Tarihi *</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit">
              {task ? 'Güncelle' : 'Görev Ekle'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
