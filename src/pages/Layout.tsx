
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1">
          <header className="h-12 flex items-center border-b px-4">
            <SidebarTrigger />
          </header>
          <div className="p-4">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
