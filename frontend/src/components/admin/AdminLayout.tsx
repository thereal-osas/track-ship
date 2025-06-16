import React from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Package,
  Globe,
  Map,
  LayoutDashboard,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { toast } from "sonner";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Admin Header */}
      <header className="bg-dhl-black text-white py-3 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-black">DHL Express Admin</span>
          </div>
          <Button
            size="sm"
            onClick={handleLogout}
            className="hover:bg-white/10 hover:text-orange-500 text-white"
          >
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center text-sm text-muted-foreground">
          <Link to="/admin" className="hover:text-foreground">
            Admin
          </Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="font-medium text-foreground">
            {location.pathname === "/admin" && "Dashboard"}
            {location.pathname === "/admin/shipments" && "Shipments"}
            {location.pathname === "/admin/countries" && "Countries"}
            {location.pathname === "/admin/states" && "States"}
          </span>
        </div>

        {/* Admin Navigation */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-64 space-y-2">
            <h2 className="font-semibold mb-4 px-2">Navigation</h2>
            <Link to="/admin">
              <Button
                variant={isActive("/admin") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
              </Button>
            </Link>
            <Link to="/admin/shipments">
              <Button
                variant={isActive("/admin/shipments") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Package className="h-4 w-4 mr-2" /> Shipments
              </Button>
            </Link>
            <Link to="/admin/countries">
              <Button
                variant={isActive("/admin/countries") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Globe className="h-4 w-4 mr-2" /> Countries
              </Button>
            </Link>
            <Link to="/admin/states">
              <Button
                variant={isActive("/admin/states") ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Map className="h-4 w-4 mr-2" /> States
              </Button>
            </Link>
          </div>

          {/* Main Admin Content */}
          <div className="flex-1 bg-white p-6 rounded-lg border shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
