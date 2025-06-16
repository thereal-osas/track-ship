import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import marker icons to fix the missing marker issue
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

interface LiveMapProps {
  origin:
    | {
        country: string;
        state: string;
        address: string;
      }
    | undefined;
  destination:
    | {
        country: string;
        state: string;
        address: string;
      }
    | undefined;
  currentLocation?:
    | {
        country: string;
        state: string;
        address: string;
      }
    | undefined;
}

// Mock coordinates for demonstration
const getCoordinates = (location: string): [number, number] => {
  const mockCoordinates: Record<string, [number, number]> = {
    "New York, US": [40.7128, -74.006],
    "Los Angeles, US": [34.0522, -118.2437],
    "Chicago, US": [41.8781, -87.6298],
    "Houston, US": [29.7604, -95.3698],
    "Phoenix, US": [33.4484, -112.074],
    "Philadelphia, US": [39.9526, -75.1652],
    "San Antonio, US": [29.4241, -98.4936],
    "San Diego, US": [32.7157, -117.1611],
    "Dallas, US": [32.7767, -96.797],
    "San Francisco, US": [37.7749, -122.4194],
  };

  // Default to New York if location not found
  return mockCoordinates[location] || [40.7128, -74.006];
};

const LiveMap: React.FC<LiveMapProps> = ({
  origin,
  destination,
  currentLocation,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);

  useEffect(() => {
    // Ensure origin and destination are defined
    const safeOrigin = origin || {
      country: "US",
      state: "New York",
      address: "New York, US",
    };
    const safeDestination = destination || {
      country: "US",
      state: "Los Angeles",
      address: "Los Angeles, US",
    };

    // Fix the icon issue
    const DefaultIcon = L.icon({
      iconUrl: icon,
      shadowUrl: iconShadow,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    // Get coordinates
    const originCoords = getCoordinates(
      `${safeOrigin.state}, ${safeOrigin.country}`
    );
    const destCoords = getCoordinates(
      `${safeDestination.state}, ${safeDestination.country}`
    );

    // Safely handle currentLocation
    const currentCoords = currentLocation
      ? getCoordinates(
          `${currentLocation.state || "Unknown"}, ${
            currentLocation.country || "US"
          }`
        )
      : undefined;

    // Calculate center of the map
    const center = currentCoords || [
      (originCoords[0] + destCoords[0]) / 2,
      (originCoords[1] + destCoords[1]) / 2,
    ];

    // Initialize map if it doesn't exist
    if (!leafletMap.current && mapRef.current) {
      leafletMap.current = L.map(mapRef.current).setView(center, 4);

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap.current);
    } else if (leafletMap.current) {
      // Update view if map exists
      leafletMap.current.setView(center, 4);
      // Clear existing layers
      leafletMap.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          leafletMap.current?.removeLayer(layer);
        }
      });
    }

    if (leafletMap.current) {
      // Add markers
      L.marker(originCoords)
        .bindPopup(`<strong>Origin:</strong> ${safeOrigin.address}`)
        .addTo(leafletMap.current);

      L.marker(destCoords)
        .bindPopup(`<strong>Destination:</strong> ${safeDestination.address}`)
        .addTo(leafletMap.current);

      if (currentCoords && currentLocation) {
        L.marker(currentCoords)
          .bindPopup(
            `<strong>Current Location:</strong> ${
              currentLocation.address || "Unknown"
            }`
          )
          .addTo(leafletMap.current);
      }

      // Add route line
      const routePoints = currentCoords
        ? [originCoords, currentCoords, destCoords]
        : [originCoords, destCoords];

      L.polyline(routePoints, {
        color: currentCoords ? "#f97316" : "#9ca3af",
        weight: 3,
        dashArray: currentCoords ? "" : "5, 5",
      }).addTo(leafletMap.current);
    }

    // Cleanup function
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [origin, destination, currentLocation]);

  return (
    <Card variant="interactive">
      <CardHeader className="bg-courier-gray-light rounded-t-lg border-b border-courier-gray-medium">
        <CardTitle className="flex items-center">
          <MapPin className="h-5 w-5 text-courier-orange mr-2" />
          Live Tracking Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video bg-white rounded-b-md relative overflow-hidden">
          <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveMap;
