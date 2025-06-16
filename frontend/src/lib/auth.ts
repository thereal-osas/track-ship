import apiClient, { axiosInstance } from "./api";

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Login function using real API
export const login = async (
  credentials: LoginCredentials
): Promise<User | null> => {
  try {
    const response = await apiClient.login(
      credentials.email,
      credentials.password
    );

    if (response.success && response.data) {
      return response.data.user;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

// Token and user storage
export const setToken = (token: string) => {
  localStorage.setItem("token", token);
  // Also set in axios default headers
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const setUser = (user: any) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const checkAuth = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) return null;

  try {
    // Set token in axios headers on app initialization
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Parse user data safely
    const user = JSON.parse(userStr);
    return user;
  } catch (error) {
    // If parsing fails, clear invalid data and return null
    console.error("Error parsing user data:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  delete axiosInstance.defaults.headers.common["Authorization"];
};
