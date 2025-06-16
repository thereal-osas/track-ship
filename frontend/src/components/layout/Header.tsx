import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, User, Bell } from "lucide-react";
import TrackingForm from "@/components/tracking/TrackingForm";
import { checkAuth } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const user = checkAuth();

  return (
    <header className="border-b bg-white">
      <div className="dhl-container py-3">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-orange-500" />
            <Link to="/" className="text-xl font-bold">
              <span className="text-orange-500">Express</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-[10px] text-white flex items-center justify-center">
                    2
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-medium border-b">Notifications</div>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div>
                    <p className="font-medium">Shipment Update</p>
                    <p className="text-sm text-muted-foreground">
                      Your package EX123456789 has been delivered
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      2 hours ago
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer">
                  <div>
                    <p className="font-medium">New Service Available</p>
                    <p className="text-sm text-muted-foreground">
                      Try our new same-day delivery service
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      1 day ago
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {user ? (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="flex gap-1">
                  <User size={16} />
                  Admin Panel
                </Button>
              </Link>
            ) : (
              <Link to="/admin/login">
                <Button variant="ghost" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="hidden md:flex items-center justify-between py-3">
          <div className="flex space-x-8">
            <Link
              to="/"
              className="font-medium hover:text-orange-500 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/tracking"
              className="font-medium hover:text-orange-500 transition-colors"
            >
              Track
            </Link>
          </div>
          <div className="md:w-64">
            <TrackingForm minimal={true} />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-between items-center py-2">
          <Link
            to="/tracking"
            className="text-sm font-medium px-3 py-2 rounded-md bg-muted hover:bg-muted/80"
          >
            Track a Shipment
          </Link>
          <Button size="sm" variant="outline" className="text-sm">
            Menu
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
