
import * as React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PawPrint, Warehouse, HeartPulse, Video, MessageSquare } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gösterge Paneli</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/animals">
          <Card className="hover:bg-muted h-full transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Hayvan Sayısı</CardTitle>
              <PawPrint className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,254</div>
              <p className="text-xs text-muted-foreground">+20.1% geçen aydan</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/feed-stock">
          <Card className="hover:bg-muted h-full transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yem Stoğu (Ton)</CardTitle>
              <Warehouse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34.5 Ton</div>
              <p className="text-xs text-muted-foreground">Hedefin %85'i</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/health">
          <Card className="hover:bg-muted h-full transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sağlık Uyarıları</CardTitle>
              <HeartPulse className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Acil müdahale gerekiyor</p>
            </CardContent>
          </Card>
        </Link>
        <Link to="/cameras">
            <Card className="hover:bg-muted h-full transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Kameralar</CardTitle>
                    <Video className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">8</div>
                    <p className="text-xs text-muted-foreground">kamera aktif</p>
                </CardContent>
            </Card>
        </Link>
        <Link to="/chat">
            <Card className="hover:bg-muted h-full transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sohbet</CardTitle>
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">yeni mesaj</p>
                </CardContent>
            </Card>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
