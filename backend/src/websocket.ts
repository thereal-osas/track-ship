import { WebSocketServer, WebSocket } from "ws";
import { verifyToken } from "./middleware/auth";

interface Client {
  ws: WebSocket;
  isAlive: boolean;
  userId?: string;
  isAdmin?: boolean;
}

const clients: Client[] = [];

export const setupWebSocketServer = (wss: WebSocketServer) => {
  wss.on("connection", (ws: WebSocket) => {
    const client: Client = { ws, isAlive: true };
    clients.push(client);

    console.log(`New client connected. Total clients: ${clients.length}`);

    // Handle authentication
    ws.on("message", (message: string) => {
      try {
        const data = JSON.parse(message);

        // Handle authentication
        if (data.type === "auth" && data.token) {
          const decoded = verifyToken(data.token);
          if (decoded) {
            client.userId = decoded.id;
            client.isAdmin = decoded.role === "admin";

            ws.send(
              JSON.stringify({
                type: "auth",
                success: true,
                message: "Authentication successful",
              })
            );

            console.log(
              `Client authenticated: ${client.userId}, isAdmin: ${client.isAdmin}`
            );
          } else {
            ws.send(
              JSON.stringify({
                type: "auth",
                success: false,
                message: "Invalid token",
              })
            );
          }
        }

        // Handle ping
        if (data.type === "ping") {
          client.isAlive = true;
          ws.send(JSON.stringify({ type: "pong" }));
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    });

    // Handle disconnection
    ws.on("close", () => {
      const index = clients.findIndex((c) => c.ws === ws);
      if (index !== -1) {
        clients.splice(index, 1);
      }
      console.log(`Client disconnected. Total clients: ${clients.length}`);
    });

    // Send welcome message
    ws.send(
      JSON.stringify({
        type: "info",
        message: "Connected to TrackShip WebSocket server",
      })
    );
  });

  // Set up heartbeat interval to detect dead connections
  const interval = setInterval(() => {
    clients.forEach((client) => {
      if (!client.isAlive) {
        client.ws.terminate();
        return;
      }

      client.isAlive = false;
      client.ws.send(JSON.stringify({ type: "ping" }));
    });
  }, 30000);

  wss.on("close", () => {
    clearInterval(interval);
  });
};

// Broadcast to all clients
export const broadcastToAll = (data: any) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
};

// Broadcast to admin clients only
export const broadcastToAdmins = (data: any) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.isAdmin && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
};

// Broadcast to specific user
export const broadcastToUser = (userId: string, data: any) => {
  const message = JSON.stringify(data);
  clients.forEach((client) => {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(message);
    }
  });
};
