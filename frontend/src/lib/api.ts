import axios from "axios";
import { Shipment, Country, State } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API client methods
const apiClient = {
  // Auth endpoints
  login: async (email: string, password: string) => {
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get user",
      };
    }
  },

  // Add this method to verify token validity
  verifyToken: async () => {
    try {
      const response = await axiosInstance.get("/auth/verify");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Token verification failed",
      };
    }
  },

  // Tracking endpoints
  getShipmentByTrackingNumber: async (trackingNumber: string) => {
    try {
      const response = await axiosInstance.get(`/tracking/${trackingNumber}`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get shipment",
      };
    }
  },

  // Admin endpoints for shipments
  getAllShipments: async () => {
    try {
      const response = await axiosInstance.get("/admin/shipments");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get shipments",
      };
    }
  },

  getShipmentById: async (id: string | number) => {
    try {
      const response = await axiosInstance.get(`/admin/shipments/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get shipment",
      };
    }
  },

  createShipment: async (shipmentData: any) => {
    try {
      const response = await axiosInstance.post(
        "/admin/shipments",
        shipmentData
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create shipment",
      };
    }
  },

  updateShipment: async (id: string | number, shipmentData: any) => {
    try {
      const response = await axiosInstance.put(
        `/admin/shipments/${id}`,
        shipmentData
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update shipment",
      };
    }
  },

  updateShipmentStatus: async (
    id: string | number,
    statusData: { status: string; location: string; description: string }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/admin/shipments/${id}/status`,
        statusData
      );
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update status",
      };
    }
  },

  deleteShipment: async (id: string | number) => {
    try {
      const response = await axiosInstance.delete(`/admin/shipments/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete shipment",
      };
    }
  },

  // Admin endpoints for countries
  getAllCountries: async () => {
    try {
      const response = await axiosInstance.get("/admin/countries");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get countries",
      };
    }
  },

  createCountry: async (name: string, code: string) => {
    try {
      const response = await axiosInstance.post("/admin/countries", {
        name,
        code,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create country",
      };
    }
  },

  updateCountry: async (id: number, name: string, code: string) => {
    try {
      const response = await axiosInstance.put(`/admin/countries/${id}`, {
        name,
        code,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update country",
      };
    }
  },

  deleteCountry: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/countries/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete country",
      };
    }
  },

  // Admin endpoints for states
  getAllStates: async () => {
    try {
      const response = await axiosInstance.get("/admin/states");
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get states",
      };
    }
  },

  getStatesByCountry: async (countryId: string | number) => {
    try {
      console.log(`Fetching states for country ID: ${countryId}`);
      const response = await axiosInstance.get(
        `/admin/states/country/${countryId}`
      );
      console.log("API response for states by country:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching states for country ${countryId}:`, error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to get states",
      };
    }
  },

  createState: async (name: string, countryId: number, code: string = "") => {
    try {
      const response = await axiosInstance.post("/admin/states", {
        name,
        country_id: countryId,
        code,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to create state",
      };
    }
  },

  updateState: async (
    id: number,
    name: string,
    countryId: number,
    code: string = ""
  ) => {
    try {
      const response = await axiosInstance.put(`/admin/states/${id}`, {
        name,
        country_id: countryId,
        code,
      });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to update state",
      };
    }
  },

  deleteState: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/admin/states/${id}`);
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete state",
      };
    }
  },
};

export default apiClient;
