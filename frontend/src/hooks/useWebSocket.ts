import { useState, useEffect } from "react";
import { connectWebSocket, getWebSocketState } from "@/lib/websocket";

const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    connectWebSocket();

    // Set up event listener for connection state changes
    const handleConnectionChange = (connected: boolean) => {
      setIsConnected(connected);
    };

    // Check initial connection state
    setIsConnected(getWebSocketState());

    // Subscribe to connection state changes
    window.addEventListener("websocket-state-change", (e: any) => {
      handleConnectionChange(e.detail.connected);
    });

    // Cleanup
    return () => {
      window.removeEventListener("websocket-state-change", (e: any) => {
        handleConnectionChange(e.detail.connected);
      });
    };
  }, []);

  return { isConnected };
};

export default useWebSocket;
