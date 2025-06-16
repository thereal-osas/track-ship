import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Package,
  Calendar,
  Clock,
  Truck,
  CheckCircle,
  Circle,
} from "lucide-react";
import { Shipment, ShipmentStatus } from "@/lib/types";

interface ShipmentDetailsProps {
  shipment: Shipment;
}

const statusColors: Record<ShipmentStatus, string> = {
  Processing: "bg-blue-500",
  "In Transit": "bg-yellow-500",
  "Out for Delivery": "bg-purple-500",
  Delivered: "bg-green-500",
  Exception: "bg-red-500",
};

const ShipmentDetails: React.FC<ShipmentDetailsProps> = ({ shipment }) => {
  // Get the last updated date safely
  const lastUpdatedDate =
    shipment.history && shipment.history.length > 0
      ? shipment.history[0].date
      : shipment.createdAt;

  // Ensure origin and destination objects exist
  const origin = shipment.origin || {
    country: "Unknown",
    state: "Unknown",
    address: "Unknown",
  };
  const destination = shipment.destination || {
    country: "Unknown",
    state: "Unknown",
    address: "Unknown",
  };

  return (
    <div className="space-y-6">
      {/* Shipment Status Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Shipment {shipment.trackingNumber}
              </h2>
              <div className="flex items-center">
                <Badge className={`${statusColors[shipment.status]} mr-2`}>
                  {shipment.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last updated: {lastUpdatedDate}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <Calendar className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                <span className="text-xs text-muted-foreground">Ship Date</span>
                <p className="text-sm font-medium">{shipment.createdAt}</p>
              </div>
              <div className="text-center">
                <Clock className="h-5 w-5 mx-auto text-orange-500 mb-1" />
                <span className="text-xs text-muted-foreground">
                  Est. Delivery
                </span>
                <p className="text-sm font-medium">
                  {shipment.estimatedDelivery}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipment Journey */}
      {shipment.history && shipment.history.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Shipment Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-7 top-0 bottom-0 w-0.5 bg-muted"></div>

              {/* Timeline events */}
              <div className="space-y-6">
                {shipment.history.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div
                      className={`h-14 w-14 rounded-full flex items-center justify-center ${
                        index === 0 ? "bg-green-100" : "bg-muted"
                      }`}
                    >
                      {index === 0 ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <Circle className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium">{event.status}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.date}
                      </p>
                      <p className="text-sm">{event.location}</p>
                      <p className="text-sm text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Shipment Route */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4">Shipment Route</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-orange-500 mt-1" />
                <div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">
                    Origin
                  </p>
                  <p className="font-medium">{origin.address}</p>
                  <p>
                    {origin.state}, {origin.country}
                  </p>
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 bg-muted/30">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-orange-500 mt-1" />
                <div>
                  <p className="text-xs uppercase font-semibold text-muted-foreground">
                    Destination
                  </p>
                  <p className="font-medium">{destination.address}</p>
                  <p>
                    {destination.state}, {destination.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking History */}
      {shipment.history && shipment.history.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Tracking History</h3>
            <div className="space-y-4">
              {shipment.history.map((historyItem, index) => (
                <div key={index} className="flex">
                  <div className="mr-4 relative">
                    <div
                      className={`w-4 h-4 rounded-full mt-1 ${
                        statusColors[historyItem.status]
                      }`}
                    ></div>
                    {index < shipment.history.length - 1 && (
                      <div className="h-full border-l border-dashed absolute left-2 top-4"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex flex-col sm:flex-row justify-between mb-1">
                      <p className="font-medium">{historyItem.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {historyItem.date}
                      </p>
                    </div>
                    <p className="text-sm mb-1">{historyItem.location}</p>
                    <p className="text-sm text-muted-foreground">
                      {historyItem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShipmentDetails;
