import React, { useState, useEffect } from "react";
import ShipmentsList from "@/components/admin/ShipmentsList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import apiClient from "@/lib/api";
import { Shipment, Country, State } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";

const Shipments = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from API
        const shipmentsRes = await apiClient.getAllShipments();
        const countriesRes = await apiClient.getAllCountries();
        const statesRes = await apiClient.getAllStates();

        // Add debugging
        console.log("Shipments API response:", shipmentsRes);
        console.log("Countries API response:", countriesRes);
        console.log("States API response:", statesRes);

        // Check if responses are successful
        if (!shipmentsRes.success) {
          throw new Error(shipmentsRes.error || "Failed to fetch shipments");
        }

        if (!countriesRes.success) {
          throw new Error(countriesRes.error || "Failed to fetch countries");
        }

        if (!statesRes.success) {
          throw new Error(statesRes.error || "Failed to fetch states");
        }

        // Check if data exists and is an array
        if (!Array.isArray(shipmentsRes.data)) {
          console.error("Shipments data is not an array:", shipmentsRes.data);

          // Check if data is nested inside a data property (common API pattern)
          if (shipmentsRes.data && Array.isArray(shipmentsRes.data.data)) {
            shipmentsRes.data = shipmentsRes.data.data;
          } else {
            throw new Error("Invalid shipments data format");
          }
        }

        // Transform API data to match our frontend types
        const transformedShipments = shipmentsRes.data.map((shipment: any) => {
          // Log the shipment object to see its structure
          console.log("Processing shipment:", shipment);

          // Don't try to format dates here, just pass them through
          return {
            id: shipment.id ? shipment.id.toString() : "0",
            trackingNumber:
              shipment.tracking_number || shipment.trackingNumber || "Unknown",
            status: shipment.status || "Processing",
            origin: {
              country:
                shipment.origin_country ||
                (shipment.origin && shipment.origin.country) ||
                "Unknown",
              state:
                shipment.origin_state ||
                (shipment.origin && shipment.origin.state) ||
                "Unknown",
              address:
                shipment.origin_address ||
                (shipment.origin && shipment.origin.address) ||
                "Unknown address",
            },
            destination: {
              country:
                shipment.destination_country ||
                (shipment.destination && shipment.destination.country) ||
                "Unknown",
              state:
                shipment.destination_state ||
                (shipment.destination && shipment.destination.state) ||
                "Unknown",
              address:
                shipment.destination_address ||
                (shipment.destination && shipment.destination.address) ||
                "Unknown address",
            },
            createdAt: shipment.created_at || shipment.createdAt,
            estimatedDelivery:
              shipment.estimated_delivery || shipment.estimatedDelivery,
            history: shipment.history || [],
            service: shipment.service || "Standard",
          };
        });

        // Log the transformed shipments to verify
        console.log("Transformed shipments:", transformedShipments);

        setShipments(transformedShipments);
        setCountries(countriesRes.data);
        setStates(statesRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateShipment = () => {
    navigate("/admin/shipments/new");
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Shipments</h1>
        <Button onClick={handleCreateShipment}>
          <Plus className="h-4 w-4 mr-2" />
          Create Shipment
        </Button>
      </div>
      <ShipmentsList
        shipments={shipments}
        countries={countries}
        states={states}
        setShipments={setShipments}
      />
    </div>
  );
};

export default Shipments;
