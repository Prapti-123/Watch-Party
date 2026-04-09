const  handleSocket = require("./sockets/socketHandler");
const http = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const connectDB = require("./lib/db");
const { connectRedis } = require("./lib/redis");
const dotenv = require("dotenv");
const youtubeRoutes = require("./routes/youtubeRoutes.js");
const app = express();
const roomRoutes = require("./routes/roomRoutes.js");

dotenv.config();
connectDB();

async function start() {
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

// 🔥 attach socket
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
handleSocket(io);
// socket connection


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