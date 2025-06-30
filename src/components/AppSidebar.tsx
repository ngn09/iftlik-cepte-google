
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { LayoutDashboard, PawPrint, Warehouse, HeartPulse, Video, MessageSquare, Settings, Users, Wheat, LogOut, CheckSquare, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const menuItems = [
    { to: "/", icon: LayoutDashboard, label: "Gösterge Paneli" },
    { to: "/animals", icon: PawPrint, label: "Hayvanlar" },
    { to: "/inventory", icon: Warehouse, label: "Envanter" },
    { to: "/feed-stock", icon: Wheat, label: "Yem Stok" },
    { to: "/health", icon: HeartPulse, label: "Sağlık" },
    { to: "/tasks", icon: CheckSquare, label: "Görevler" },
    { to: "/farm-map", icon: Map, label: "Çiftlik Haritası" },
    { to: "/cameras", icon: Video, label: "Kameralar" },
    { to: "/chat", icon: MessageSquare, label: "Sohbet" },
    { to: "/users", icon: Users, label: "Kullanıcılar" },
  ];

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 rounded-lg text-base font-normal ${
      isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
    }`;

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Başarıyla çıkış yapıldı",
      });
      navigate("/auth", { replace: true });
    }
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <h2 className="text-lg font-semibold tracking-tight">Çiftliğim</h2>
      </SidebarHeader>
      <SidebarContent className="flex flex-col justify-between">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <NavLink to={item.to} className={getNavLinkClass} end>
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.label}</span>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="p-4 border-t mt-4 space-y-2">
            <NavLink to="/settings" className={getNavLinkClass} end>
                <Settings className="h-5 w-5 mr-3" />
                <span>Ayarlar</span>
            </NavLink>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Çıkış Yap</span>
            </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
