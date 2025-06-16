import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Index from "./pages/Index";
import Tracking from "./pages/Tracking";
import AdminLayout from "./components/admin/AdminLayout";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Shipments from "./pages/admin/Shipments";
import Countries from "./pages/admin/Countries";
import States from "./pages/admin/States";
import NotFound from "./pages/NotFound";
import { checkAuth } from "./lib/auth";
import NewShipment from "@/pages/admin/NewShipment";
import { useEffect } from "react";
import apiClient from "@/lib/api";
import { connectWebSocket } from "@/lib/websocket";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = checkAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Verify token validity with the server
    const verifyAuth = async () => {
      try {
        const response = await apiClient.verifyToken();
        if (!response.success) {
          // Token is invalid, redirect to login
          console.log("Token verification failed, redirecting to login");
          navigate("/admin/login", { replace: true });
        } else {
          console.log("Token verification successful");
        }
      } catch (error) {
        console.error("Token verification error:", error);
        navigate("/admin/login", { replace: true });
      }
    };

    if (user) {
      verifyAuth();
    }
  }, [navigate]);

  if (!user) {
    console.log("No user found in localStorage, redirecting to login");
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

// Initialize WebSocket connection
const AppWithWebSocket = () => {
  useEffect(() => {
    connectWebSocket();
  }, []);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Initialize WebSocket connection */}
        <AppWithWebSocket />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/tracking" element={<Tracking />} />
          <Route path="/tracking/:trackingNumber" element={<Tracking />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="shipments" element={<Shipments />} />
            <Route path="countries" element={<Countries />} />
            <Route path="states" element={<States />} />
            <Route path="shipments/new" element={<NewShipment />} />
          </Route>

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
