import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Map, Globe, Truck } from "lucide-react";
import apiClient from "@/lib/api";
import { Spinner } from "@/components/ui/spinner";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalShipments: 0,
    deliveredShipments: 0,
    inTransitShipments: 0,
    issueShipments: 0,
    countries: 0,
    states: 0,
  });

  // Popular routes would ideally come from an API endpoint that aggregates this data
  // For now, we'll use static data
  const popularRoutes = [
    { from: "United States", to: "Canada", percentage: 43 },
    { from: "United Kingdom", to: "Australia", percentage: 27 },
    { from: "Canada", to: "United States", percentage: 18 },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all required data - use getAllShipments instead of getShipments
        const [shipmentsRes, countriesRes, statesRes] = await Promise.all([
          apiClient.getAllShipments(),
          apiClient.getAllCountries(),
          apiClient.getAllStates(),
        ]);

        console.log("Shipments response:", shipmentsRes);
        console.log("Countries response:", countriesRes);
        console.log("States response:", statesRes);

        // Ensure we have arrays to work with
        const shipments = Array.isArray(shipmentsRes.data)
          ? shipmentsRes.data
          : Array.isArray(shipmentsRes.data?.data)
          ? shipmentsRes.data.data
          : [];

        const countries = Array.isArray(countriesRes.data)
          ? countriesRes.data
          : Array.isArray(countriesRes.data?.data)
          ? countriesRes.data.data
          : [];

        const states = Array.isArray(statesRes.data)
          ? statesRes.data
          : Array.isArray(statesRes.data?.data)
          ? statesRes.data.data
          : [];

        // Calculate stats safely
        const deliveredShipments = shipments.filter(
          (shipment: any) => shipment.status === "Delivered"
        ).length;

        const inTransitShipments = shipments.filter(
          (shipment: any) => shipment.status === "In Transit"
        ).length;

        const issueShipments = shipments.filter(
          (shipment: any) => shipment.status === "Exception"
        ).length;

        setStats({
          totalShipments: shipments.length,
          deliveredShipments,
          inTransitShipments,
          issueShipments,
          countries: countries.length,
          states: states.length,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Shipments</p>
                <p className="text-3xl font-bold">{stats.totalShipments}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-3xl font-bold">{stats.deliveredShipments}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <Truck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-3xl font-bold">{stats.inTransitShipments}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Truck className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Issues</p>
                <p className="text-3xl font-bold">{stats.issueShipments}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <Package className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Location Overview
              </CardTitle>
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Countries</span>
                <span className="text-2xl font-bold">{stats.countries}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">States/Provinces</span>
                <span className="text-2xl font-bold">{stats.states}</span>
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">
                  Manage countries and states from their respective admin pages.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">
                Popular Shipment Routes
              </CardTitle>
              <Map className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularRoutes.map((route, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center py-2 ${
                    index < popularRoutes.length - 1 ? "border-b" : ""
                  }`}
                >
                  <span>
                    {route.from} → {route.to}
                  </span>
                  <span className="font-semibold">{route.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
