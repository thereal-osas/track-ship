// Common types used across the application

export interface Country {
  id: string;
  name: string;
  code?: string;
}

export interface State {
  id: string;
  name: string;
  countryId: string;
  code?: string;
}

export type ShipmentStatus = 
  | "Processing" 
  | "In Transit" 
  | "Out for Delivery" 
  | "Delivered" 
  | "Exception";

export interface ShipmentHistoryItem {
  id?: string;
  date: string;
  status: ShipmentStatus;
  location: string;
  description: string;
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
  history?: ShipmentHistoryItem[];
}