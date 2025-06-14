
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings as SettingsIcon, Users, Bell, Shield, Database, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([
    { id: 1, name: "Admin Kullanıcı", email: "admin@ciftlik.com", role: "Yönetici", status: "Aktif" },
    { id: 2, name: "Çiftlik İşçisi", email: "isci@ciftlik.com", role: "İşçi", status: "Aktif" },
    { id: 3, name: "Veteriner", email: "vet@ciftlik.com", role: "Veteriner", status: "Aktif" }
  ]);

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    healthAlerts: true,
    inventoryAlerts: true
  });

  const handleUserAction = (action: string, userId?: number) => {
    toast({
      title: "Kullanıcı İşlemi",
      description: `${action} işlemi gerçekleştirildi.`
    });
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Bildirim Ayarı",
      description: "Bildirim ayarınız güncellendi."
    });
  };

  const handleSecurityAction = (action: string) => {
    toast({
      title: "Güvenlik",
      description: `${action} işlemi başlatıldı.`
    });
  };

  const handleDataAction = (action: string) => {
    toast({
      title: "Veri Yönetimi",
      description: `${action} işlemi başlatıldı.`
    });
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ayarlar</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Kullanıcı Yönetimi */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kullanıcı Yönetimi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Kullanıcı rollerini ve izinlerini yönetin
                </p>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                  Kullanıcıları Yönet
                </button>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Kullanıcı Yönetimi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Kullanıcılar</h3>
                <button
                  onClick={() => handleUserAction("Yeni kullanıcı eklendi")}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                  Yeni Kullanıcı
                </button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ad</TableHead>
                    <TableHead>E-posta</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUserAction("Kullanıcı düzenlendi", user.id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleUserAction("Kullanıcı silindi", user.id)}
                            className="p-1 hover:bg-gray-100 rounded text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bildirim Ayarları */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Bildirim Ayarları
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Bildirim tercihlerinizi ayarlayın
                </p>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                  Bildirimleri Ayarla
                </button>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bildirim Ayarları</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Genel Bildirimler</h3>
                {Object.entries({
                  emailNotifications: "E-posta Bildirimleri",
                  smsNotifications: "SMS Bildirimleri",
                  pushNotifications: "Push Bildirimleri"
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) => handleNotificationChange(key, e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Özel Uyarılar</h3>
                {Object.entries({
                  healthAlerts: "Sağlık Uyarıları",
                  inventoryAlerts: "Envanter Uyarıları"
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span>{label}</span>
                    <input
                      type="checkbox"
                      checked={notifications[key as keyof typeof notifications]}
                      onChange={(e) => handleNotificationChange(key, e.target.checked)}
                      className="w-4 h-4"
                    />
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Güvenlik */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Güvenlik
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Parola ve güvenlik ayarları
                </p>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                  Güvenlik Ayarları
                </button>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Güvenlik Ayarları</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <button
                onClick={() => handleSecurityAction("Parola değiştirme")}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold">Parola Değiştir</h3>
                <p className="text-sm text-muted-foreground">Hesap parolanızı güncelleyin</p>
              </button>
              
              <button
                onClick={() => handleSecurityAction("İki faktörlü kimlik doğrulama")}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold">İki Faktörlü Kimlik Doğrulama</h3>
                <p className="text-sm text-muted-foreground">Hesabınızı ekstra güvenlik katmanı ile koruyun</p>
              </button>
              
              <button
                onClick={() => handleSecurityAction("Oturum geçmişi")}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold">Oturum Geçmişi</h3>
                <p className="text-sm text-muted-foreground">Son oturum açma işlemlerinizi görüntüleyin</p>
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Veri Yönetimi */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Veri Yönetimi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Veri yedekleme ve geri yükleme
                </p>
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90">
                  Veri Ayarları
                </button>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Veri Yönetimi</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <button
                onClick={() => handleDataAction("Veri yedekleme")}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold">Veri Yedekleme</h3>
                <p className="text-sm text-muted-foreground">Tüm verilerinizi yedekleyin</p>
              </button>
              
              <button
                onClick={() => handleDataAction("Veri geri yükleme")}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold">Veri Geri Yükleme</h3>
                <p className="text-sm text-muted-foreground">Önceki yedekten verileri geri yükleyin</p>
              </button>
              
              <button
                onClick={() => handleDataAction("Veri dışa aktarma")}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-semibold">Veri Dışa Aktarma</h3>
                <p className="text-sm text-muted-foreground">Verilerinizi CSV/Excel formatında indirin</p>
              </button>
              
              <button
                onClick={() => handleDataAction("Veri temizleme")}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 border-red-200"
              >
                <h3 className="font-semibold text-red-600">Veri Temizleme</h3>
                <p className="text-sm text-muted-foreground">Eski verileri temizleyin (Geri alınamaz)</p>
              </button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Settings;
