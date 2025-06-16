import { format } from "date-fns";

// Types
export interface Country {
  id: string;
  name: string;
}

export interface State {
  id: string;
  name: string;
  countryId: string;
}

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: {
    country: string;
    state: string;
    address: string;
  };
  destination: {
    country: string;
    state: string;
    address: string;
  };
  status: ShipmentStatus;
  createdAt: string;
  estimatedDelivery: string;
  history?: ShipmentHistoryItem[]; // Make history optional
}

export type ShipmentStatus =
  | "Processing"
  | "In Transit"
  | "Out for Delivery"
  | "Delivered"
  | "Exception";

export interface ShipmentHistoryItem {
  date: string;
  status: ShipmentStatus;
  location: string;
  description: string;
}

// Mock Data
export const countries: Country[] = [
  { id: "1", name: "United States" },
  { id: "2", name: "Canada" },
  { id: "3", name: "United Kingdom" },
  { id: "4", name: "Australia" },
];

export const states: State[] = [
  { id: "1", name: "California", countryId: "1" },
  { id: "2", name: "New York", countryId: "1" },
  { id: "3", name: "Texas", countryId: "1" },
  { id: "4", name: "Ontario", countryId: "2" },
  { id: "5", name: "Quebec", countryId: "2" },
  { id: "6", name: "England", countryId: "3" },
  { id: "7", name: "Scotland", countryId: "3" },
  { id: "8", name: "New South Wales", countryId: "4" },
  { id: "9", name: "Victoria", countryId: "4" },
];

export const shipments: Shipment[] = [
  {
    id: "1",
    trackingNumber: "DHL1234567890",
    origin: {
      country: "United States",
      state: "California",
      address: "123 Shipping Ave, Los Angeles",
    },
    destination: {
      country: "Canada",
      state: "Ontario",
      address: "456 Delivery St, Toronto",
    },
    status: "In Transit",
    createdAt: format(new Date(2023, 4, 15), "yyyy-MM-dd"),
    estimatedDelivery: format(new Date(2023, 4, 20), "yyyy-MM-dd"),
    history: [
      {
        date: format(new Date(2023, 4, 15, 9, 30), "yyyy-MM-dd HH:mm"),
        status: "Processing",
        location: "Los Angeles, CA",
        description: "Shipment created and ready for pickup",
      },
      {
        date: format(new Date(2023, 4, 16, 14, 45), "yyyy-MM-dd HH:mm"),
        status: "In Transit",
        location: "Los Angeles, CA",
        description: "Shipment picked up",
      },
      {
        date: format(new Date(2023, 4, 17, 8, 15), "yyyy-MM-dd HH:mm"),
        status: "In Transit",
        location: "Chicago, IL",
        description: "Shipment arrived at sorting facility",
      },
    ],
  },
  {
    id: "2",
    trackingNumber: "DHL9876543210",
    origin: {
      country: "United Kingdom",
      state: "England",
      address: "789 Sender Rd, London",
    },
    destination: {
      country: "Australia",
      state: "New South Wales",
      address: "101 Receiver Ln, Sydney",
    },
    status: "Delivered",
    createdAt: format(new Date(2023, 3, 10), "yyyy-MM-dd"),
    estimatedDelivery: format(new Date(2023, 3, 18), "yyyy-MM-dd"),
    history: [
      {
        date: format(new Date(2023, 3, 10, 11, 0), "yyyy-MM-dd HH:mm"),
        status: "Processing",
        location: "London, UK",
        description: "Shipment created and ready for pickup",
      },
      {
        date: format(new Date(2023, 3, 11, 14, 30), "yyyy-MM-dd HH:mm"),
        status: "In Transit",
        location: "London, UK",
        description: "Shipment picked up",
      },
      {
        date: format(new Date(2023, 3, 15, 7, 45), "yyyy-MM-dd HH:mm"),
        status: "In Transit",
        location: "Dubai, UAE",
        description: "Shipment at transfer point",
      },
      {
        date: format(new Date(2023, 3, 17, 9, 15), "yyyy-MM-dd HH:mm"),
        status: "Out for Delivery",
        location: "Sydney, Australia",
        description: "Shipment out for delivery",
      },
      {
        date: format(new Date(2023, 3, 17, 14, 20), "yyyy-MM-dd HH:mm"),
        status: "Delivered",
        location: "Sydney, Australia",
        description: "Shipment delivered",
      },
    ],
  },
  {
    id: "3",
    trackingNumber: "DHL5678901234",
    origin: {
      country: "Canada",
      state: "Quebec",
      address: "567 Origin Blvd, Montreal",
    },
    destination: {
      country: "United States",
      state: "New York",
      address: "890 Destination Ave, New York",
    },
    status: "Exception",
    createdAt: format(new Date(2023, 4, 5), "yyyy-MM-dd"),
    estimatedDelivery: format(new Date(2023, 4, 12), "yyyy-MM-dd"),
    history: [
      {
        date: format(new Date(2023, 4, 5, 10, 0), "yyyy-MM-dd HH:mm"),
        status: "Processing",
        location: "Montreal, QC",
        description: "Shipment created and ready for pickup",
      },
      {
        date: format(new Date(2023, 4, 6, 15, 0), "yyyy-MM-dd HH:mm"),
        status: "In Transit",
        location: "Montreal, QC",
        description: "Shipment picked up",
      },
      {
        date: format(new Date(2023, 4, 7, 9, 30), "yyyy-MM-dd HH:mm"),
        status: "In Transit",
        location: "Buffalo, NY",
        description: "Shipment arrived at customs",
      },
      {
        date: format(new Date(2023, 4, 8, 16, 45), "yyyy-MM-dd HH:mm"),
        status: "Exception",
        location: "Buffalo, NY",
        description:
          "Shipment held at customs - additional documentation required",
      },
    ],
  },
];

// Mock data access functions
export const getCountries = (): Country[] => {
  return countries;
};

export const getStates = (countryId?: string): State[] => {
  if (countryId) {
    return states.filter((state) => state.countryId === countryId);
  }
  return states;
};

export const getShipments = (): Shipment[] => {
  return shipments;
};

export const getShipmentByTrackingNumber = (
  trackingNumber: string
): Shipment | undefined => {
  return shipments.find(
    (shipment) => shipment.trackingNumber === trackingNumber
  );
};

export const getShipmentsByCountry = (countryId: string): Shipment[] => {
  const countryName = countries.find((c) => c.id === countryId)?.name;
  if (!countryName) return [];

  return shipments.filter(
    (shipment) =>
      shipment.origin.country === countryName ||
      shipment.destination.country === countryName
  );
};

export const getShipmentsByState = (stateId: string): Shipment[] => {
  const state = states.find((s) => s.id === stateId);
  if (!state) return [];

  return shipments.filter(
    (shipment) =>
      shipment.origin.state === state.name ||
      shipment.destination.state === state.name
  );
};
