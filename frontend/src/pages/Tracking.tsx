import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TrackingForm from "@/components/tracking/TrackingForm";
import ShipmentDetails from "@/components/tracking/ShipmentDetails";
import LiveMap from "@/components/tracking/LiveMap";
import apiClient from "@/lib/api";
import { subscribeToTracking } from "@/lib/websocket";
import useWebSocket from "@/hooks/useWebSocket";
import { Package, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Shipment } from "@/lib/types";
import { shipments } from "@/lib/mockData";

const Tracking = () => {
  const { trackingNumber } = useParams<{ trackingNumber?: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useWebSocket();

  // Add this function to get mock data
  const getMockShipment = (trackingNum: string) => {
    console.log("Looking for mock shipment:", trackingNum);
    console.log("Available mock shipments:", shipments);
    return shipments.find((s) => s.trackingNumber === trackingNum);
  };

  // Fetch shipment data when tracking number changes
  useEffect(() => {
    console.log("Tracking number changed:", trackingNumber);

    let isMounted = true;

    if (trackingNumber) {
      fetchShipment(trackingNumber);
      // Subscribe to real-time updates
      const unsubscribe = subscribeToTracking(trackingNumber, (data) => {
        console.log("Received tracking update:", data);
        // Refresh tracking data
        fetchShipment(trackingNumber);
      });

      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
      };
    } else {
      // Reset state when no tracking number is provided
      setShipment(null);
      setLoading(false);
      setError(null);
    }
  }, [trackingNumber]);

  const fetchShipment = async (trackingNum: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.getShipmentByTrackingNumber(trackingNum);

      if (response.success && response.data.data) {
        // Note the nested data property
        const shipmentData = response.data.data;

        // Transform the API response to match our frontend model
        const transformedShipment = {
          id: shipmentData.id.toString(),
          trackingNumber: shipmentData.trackingNumber,
          status: shipmentData.status || "Processing",
          origin: shipmentData.origin,
          destination: shipmentData.destination,
          createdAt: new Date(shipmentData.createdAt)
            .toISOString()
            .split("T")[0],
          estimatedDelivery: shipmentData.estimatedDelivery
            ? new Date(shipmentData.estimatedDelivery)
                .toISOString()
                .split("T")[0]
            : "Not set",
          history: shipmentData.history || [],
        };

        setShipment(transformedShipment);
      } else {
        setShipment(null);
        setError(response?.error || "Shipment not found");
      }
    } catch (err) {
      console.error("Error fetching shipment:", err);
      setShipment(null);
      setError("Failed to fetch shipment data");
      toast.error("Failed to fetch shipment data");
    } finally {
      setLoading(false);
    }
  };

  // Get the current location from the latest history entry
  const getCurrentLocation = () => {
    if (!shipment || !shipment.history || shipment.history.length === 0) {
      return undefined;
    }

    // Use the location from the most recent history entry
    const latestEvent = shipment.history[0];
    const locationParts = latestEvent.location.split(", ");

    // Default values in case we can't parse the location properly
    let state = shipment.origin.state;
    let country = shipment.origin.country;

    if (locationParts.length >= 2) {
      state = locationParts[0] || state;
      country = locationParts[1] || country;
    }

    return {
      country: country,
      state: state,
      address: latestEvent.location,
    };
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 py-8">
        <div className="dhl-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Track Your Shipment</h1>

            {/* Tracking Form */}
            <div className="bg-white rounded-lg border p-6 mb-8">
              <TrackingForm className="max-w-full" />
            </div>

            {/* WebSocket Connection Status */}
            {trackingNumber && (
              <div className="mb-4 text-sm text-muted-foreground">
                Real-time tracking:{" "}
                {isConnected ? (
                  <span className="text-green-600">Connected</span>
                ) : (
                  <span className="text-red-600">Disconnected</span>
                )}
              </div>
            )}

            {/* Tracking Results */}
            {loading ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
                  <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Loading...</h2>
                <p className="text-muted-foreground">
                  Fetching shipment information...
                </p>
              </div>
            ) : shipment ? (
              <div className="animate-fade-in space-y-8">
                <ShipmentDetails shipment={shipment} />

                <LiveMap
                  origin={shipment.origin}
                  destination={shipment.destination}
                  currentLocation={getCurrentLocation()}
                />
              </div>
            ) : trackingNumber ? (
              <div className="text-center py-12 bg-white rounded-lg border">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <Package className="h-8 w-8 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold mb-2">
                  {error || "Shipment Not Found"}
                </h2>
                <p className="text-muted-foreground">
                  {error ? (
                    error
                  ) : (
                    <>
                      We couldn't find any shipment with tracking number{" "}
                      <span className="font-medium">{trackingNumber}</span>
                    </>
                  )}
                </p>
                <p className="text-sm mt-2">
                  Please check the tracking number and try again.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Tracking;
