import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/task.js";
import setupSocket from "./sockets/taskSocket.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO with CORS for frontend
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // e.g., https://webalar-iota.vercel.app
    methods: ["GET", "POST"],
    credentials: true
  }
});

// ✅ Express CORS config (very important!)
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

app.use(express.json());

// ✅ Optional root check
app.get("/", (req, res) => {
  res.send("✅ Webalar backend is running!");
});

// ✅ REST API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ✅ WebSocket handlers
setupSocket(io);

// ✅ Connect DB and start server
const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () =>
      console.log(`✅ Server running on port ${PORT}`)
    );
  })
  .catch(err => console.error("❌ DB connection failed:", err));
