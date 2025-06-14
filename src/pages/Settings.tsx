
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings as SettingsIcon, Users, Bell, Shield, Database } from "lucide-react";

const Settings = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ayarlar</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
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

        <Card>
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

        <Card>
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

        <Card>
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
      </div>
    </div>
  );
};

export default Settings;
