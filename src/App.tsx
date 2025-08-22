import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { mobileStorage } from "./lib/mobileStorage";
import Layout from "./pages/Layout";
import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import Inventory from "./pages/Inventory";
import InventoryItemDetails from "./pages/InventoryItemDetails";
import Health from "./pages/Health";
import Tasks from "./pages/Tasks";
import FarmMap from "./pages/FarmMap";
import Cameras from "./pages/Cameras";
import Chat from "./pages/Chat";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import FeedStock from "./pages/FeedStock";
import { AuthProvider, ProtectedRoute } from './auth';
import Auth from './pages/Auth';
import FarmSetup from './pages/FarmSetup';
import { usePushNotifications } from "./hooks/usePushNotifications";
import { useDeepLinks } from "./hooks/useDeepLinks";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24,
      staleTime: 1000 * 30,
      refetchOnReconnect: true,
    },
  },
});

const persister = createAsyncStoragePersister({ storage: mobileStorage });
persistQueryClient({ queryClient, persister, maxAge: 1000 * 60 * 60 * 24 });

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="ciftlik-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      <Route path="/farm-setup" element={<FarmSetup />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/animals" element={<Animals />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/:id" element={<InventoryItemDetails />} />
          <Route path="/feed-stock" element={<FeedStock />} />
          <Route path="/health" element={<Health />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/farm-map" element={<FarmMap />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
