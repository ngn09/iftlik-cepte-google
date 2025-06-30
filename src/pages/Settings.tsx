
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Settings as SettingsIcon, Users, Bell, Shield, Database, Plus, Edit, Trash2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FarmBranding } from "@/components/FarmBranding";
import { useFarmBranding } from "@/hooks/useFarmBranding";

const Settings = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { farmName, farmLogo, updateBranding } = useFarmBranding();

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    healthAlerts: true,
    inventoryAlerts: true
  });

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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu.",
      });
    } else {
      toast({
        title: "Başarıyla çıkış yapıldı",
      });
      navigate("/auth", { replace: true });
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ayarlar</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Çiftlik Markası */}
        <FarmBranding 
          farmName={farmName}
          farmLogo={farmLogo}
          onUpdate={updateBranding}
        />

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

              <div className="pt-4 border-t">
                <button
                    onClick={handleLogout}
                    className="w-full text-left p-4 border rounded-lg hover:bg-red-50 text-red-600 flex items-center"
                >
                    <LogOut className="h-5 w-5 mr-3" />
                    <div className="flex flex-col">
                        <h3 className="font-semibold">Oturumu Kapat</h3>
                        <p className="text-sm text-muted-foreground">Mevcut oturumunuzu sonlandırın</p>
                    </div>
                </button>
              </div>
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
