// ✅ dotenv MUST be first — before any env-dependent require()
const dotenv = require("dotenv");
dotenv.config();

const handleSocket = require("./sockets/socketHandler");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const connectDB = require("./lib/db");
const { connectRedis } = require("./lib/redis");
const youtubeRoutes = require("./routes/youtubeRoutes.js");
const roomRoutes = require("./routes/roomRoutes.js");

const app = express();

async function start() {
  try {
    // ✅ connectDB inside start() so MONGO_URI is already loaded
    await connectDB();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }

  try {
    await connectRedis();
    console.log("Redis connected");
  } catch (err) {
    console.error("Redis connection failed", err);
    process.exit(1);
  }

  app.use(cors());
  app.use(express.json());

  // 🔥 create HTTP server
  const server = http.createServer(app);

  // 🔥 attach socket.io
  const io = new Server(server, {
    cors: { origin: "*" }
  });
  handleSocket(io);

  app.get("/api/test", (req, res) => {
    res.json({ message: "API working" });
  });

  app.use("/api/youtube", youtubeRoutes);
  app.use("/api/rooms", roomRoutes);

  server.listen(5000, () => {
    console.log("Backend running on http://localhost:5000");
  });
}

start();