
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CheckCircle, Clock, AlertCircle, Calendar } from "lucide-react";
import { TaskFormDialog } from "@/components/TaskFormDialog";

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

const Tasks = () => {
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Sample data - in real app this would come from database
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Sabah Yem Dağıtımı",
      description: "Tüm hayvanlar için sabah yem dağıtımının yapılması",
      priority: "Yüksek",
      status: "Tamamlandı",
      assignedTo: "Ahmet Yılmaz",
      dueDate: "2024-01-15",
      category: "Yem Yönetimi",
      createdAt: "2024-01-14"
    },
    {
      id: "2",
      title: "Sağlık Kontrolü - A Sektörü",
      description: "A sektöründeki ineklerin haftalık sağlık kontrolünün yapılması",
      priority: "Orta",
      status: "Devam Ediyor",
      assignedTo: "Dr. Mehmet Kaya",
      dueDate: "2024-01-16",
      category: "Sağlık",
      createdAt: "2024-01-15"
    },
    {
      id: "3",
      title: "Makine Bakımı - Sağım Makinesi",
      description: "Sağım makinesinin aylık bakım ve kontrolünün yapılması",
      priority: "Yüksek",
      status: "Beklemede",
      assignedTo: "Teknisyen Ali",
      dueDate: "2024-01-17",
      category: "Bakım",
      createdAt: "2024-01-15"
    },
    {
      id: "4",
      title: "Yem Stok Kontrolü",
      description: "Yem depolarının stok kontrolü ve eksik olanların tespit edilmesi",
      priority: "Orta",
      status: "Beklemede",
      assignedTo: "Fatma Demir",
      dueDate: "2024-01-18",
      category: "Yem Yönetimi",
      createdAt: "2024-01-15"
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Acil': return 'bg-red-100 text-red-800 border-red-200';
      case 'Yüksek': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Orta': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Düşük': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tamamlandı': return 'bg-green-100 text-green-800 border-green-200';
      case 'Devam Ediyor': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Beklemede': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'İptal Edildi': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Tamamlandı': return <CheckCircle className="h-4 w-4" />;
      case 'Devam Ediyor': return <Clock className="h-4 w-4" />;
      case 'Beklemede': return <AlertCircle className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return task.status === 'Beklemede';
    if (activeTab === 'in-progress') return task.status === 'Devam Ediyor';
    if (activeTab === 'completed') return task.status === 'Tamamlandı';
    return true;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'Beklemede').length,
    inProgress: tasks.filter(t => t.status === 'Devam Ediyor').length,
    completed: tasks.filter(t => t.status === 'Tamamlandı').length
  };

  return (
    <div>
      <TaskFormDialog 
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
      />
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Görevler</h1>
        <Button onClick={() => setIsFormDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Yeni Görev Ekle
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Görev</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beklemede</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{taskStats.pending}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Devam Ediyor</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tamamlandı</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Görev Listesi</CardTitle>
          <CardDescription>Çiftlik görevlerinizi yönetin ve takip edin.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Tümü ({taskStats.total})</TabsTrigger>
              <TabsTrigger value="pending">Beklemede ({taskStats.pending})</TabsTrigger>
              <TabsTrigger value="in-progress">Devam Ediyor ({taskStats.inProgress})</TabsTrigger>
              <TabsTrigger value="completed">Tamamlandı ({taskStats.completed})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <Badge className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </Badge>
                          <Badge className={getStatusColor(task.status)}>
                            {getStatusIcon(task.status)}
                            <span className="ml-1">{task.status}</span>
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{task.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Atanan: <strong>{task.assignedTo}</strong></span>
                          <span>Kategori: <strong>{task.category}</strong></span>
                          <span>Termin: <strong>{new Date(task.dueDate).toLocaleDateString('tr-TR')}</strong></span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Düzenle
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={task.status === 'Tamamlandı'}
                        >
                          {task.status === 'Tamamlandı' ? 'Tamamlandı' : 'Tamamla'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Tasks;
