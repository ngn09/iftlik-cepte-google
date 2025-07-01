
import { NavLink, useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { LayoutDashboard, PawPrint, Warehouse, HeartPulse, Video, MessageSquare, Settings, Users, Wheat, LogOut, CheckSquare, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useFarmBranding } from "@/hooks/useFarmBranding";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { farmName, farmLogo } = useFarmBranding();
  
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
    `flex items-center p-3 rounded-lg text-base font-medium transition-colors duration-200 ${
      isActive 
        ? 'bg-primary text-primary-foreground shadow-sm' 
        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
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
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          {farmLogo && (
            <img 
              src={farmLogo} 
              alt="Logo" 
              className="h-10 w-10 object-contain rounded-lg bg-white p-1 shadow-sm"
            />
          )}
          <h2 className="text-xl font-bold tracking-tight text-sidebar-foreground truncate">{farmName}</h2>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex flex-col justify-between p-4">
        <SidebarMenu className="space-y-2">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <NavLink to={item.to} className={getNavLinkClass} end>
                <item.icon className="h-6 w-6 mr-4 flex-shrink-0" />
                <span className="text-base font-medium">{item.label}</span>
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div className="border-t border-sidebar-border pt-4 mt-4 space-y-2">
          <NavLink to="/settings" className={getNavLinkClass} end>
            <Settings className="h-6 w-6 mr-4 flex-shrink-0" />
            <span className="text-base font-medium">Ayarlar</span>
          </NavLink>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start p-3 h-auto text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors duration-200"
          >
            <LogOut className="h-6 w-6 mr-4 flex-shrink-0" />
            <span>Çıkış Yap</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
