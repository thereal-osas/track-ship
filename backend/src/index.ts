import express from "express";
import cors from "cors";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import trackingRoutes from "./routes/tracking";
import adminRoutes from "./routes/admin";
import { setupWebSocketServer } from "./websocket";

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:8080",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server is running" });
});

// Setup WebSocket server
setupWebSocketServer(wss);

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`WebSocket server running on ws://localhost:${PORT}/ws`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});
