import { toast } from "@/components/ui/sonner";

let socket: WebSocket | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelay = 3000;

const subscribers: Map<string, ((data: any) => void)[]> = new Map();

// Custom event for connection state changes
const dispatchConnectionEvent = (connected: boolean) => {
  window.dispatchEvent(
    new CustomEvent("websocket-state-change", {
      detail: { connected },
    })
  );
};

export const getWebSocketState = (): boolean => {
  return socket !== null && socket.readyState === WebSocket.OPEN;
};

export const connectWebSocket = () => {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return;
  }

  const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3001/ws";
  socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("WebSocket connection established");
    reconnectAttempts = 0;
    dispatchConnectionEvent(true);

    // Authenticate if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      sendMessage({
        type: "auth",
        token,
      });
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
    dispatchConnectionEvent(false);

    // Attempt to reconnect
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      console.log(
        `Attempting to reconnect (${reconnectAttempts}/${maxReconnectAttempts})...`
      );
      setTimeout(connectWebSocket, reconnectDelay);
    } else {
      console.log("Max reconnect attempts reached");
      toast.error("Connection to server lost. Please refresh the page.");
    }
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    dispatchConnectionEvent(false);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("WebSocket message received:", data);

      // Handle different message types
      switch (data.type) {
        case "shipment_update":
          // Notify subscribers for this tracking number
          const trackingNumber = data.trackingNumber;
          if (subscribers.has(trackingNumber)) {
            subscribers
              .get(trackingNumber)
              ?.forEach((callback) => callback(data));
          }
          break;

        case "pong":
          // Heartbeat response, do nothing
          break;

        case "auth":
          if (data.success) {
            console.log("WebSocket authentication successful");
          } else {
            console.error("WebSocket authentication failed:", data.message);
          }
          break;

        default:
          console.log("Unhandled WebSocket message type:", data.type);
      }
    } catch (error) {
      console.error("Error parsing WebSocket message:", error);
    }
  };
};

export const sendMessage = (data: any) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
    return true;
  }
  return false;
};

export const subscribeToTracking = (
  trackingNumber: string,
  callback: (data: any) => void
) => {
  if (!subscribers.has(trackingNumber)) {
    subscribers.set(trackingNumber, []);
  }

  subscribers.get(trackingNumber)?.push(callback);

  // Subscribe to updates on the server
  sendMessage({
    type: "subscribe",
    trackingNumber,
  });

  // Return unsubscribe function
  return () => {
    const callbacks = subscribers.get(trackingNumber) || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }

    // If no more subscribers for this tracking number, unsubscribe from server
    if (callbacks.length === 0) {
      sendMessage({
        type: "unsubscribe",
        trackingNumber,
      });
    }
  };
};

// Initialize connection when module is imported
connectWebSocket();
