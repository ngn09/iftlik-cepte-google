
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";

const Layout = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <AppSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
