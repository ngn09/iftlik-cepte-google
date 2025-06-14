
import { NavLink } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import { LayoutDashboard, PawPrint, Warehouse, HeartPulse, Video, MessageSquare, Settings, Users, Wheat } from "lucide-react";

const AppSidebar = () => {
  const menuItems = [
    { to: "/", icon: LayoutDashboard, label: "Gösterge Paneli" },
    { to: "/animals", icon: PawPrint, label: "Hayvanlar" },
    { to: "/inventory", icon: Warehouse, label: "Envanter" },
    { to: "/feed-stock", icon: Wheat, label: "Yem Stok" },
    { to: "/health", icon: HeartPulse, label: "Sağlık" },
    { to: "/cameras", icon: Video, label: "Kameralar" },
    { to: "/chat", icon: MessageSquare, label: "Sohbet" },
    { to: "/users", icon: Users, label: "Kullanıcılar" },
  ];

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 rounded-lg text-base font-normal ${
      isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
    }`;

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
        <div className="p-4">
            <NavLink to="/settings" className={getNavLinkClass} end>
                <Settings className="h-5 w-5 mr-3" />
                <span>Ayarlar</span>
            </NavLink>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
