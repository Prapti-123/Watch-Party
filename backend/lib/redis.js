const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    // Disable automatic retry to fail fast when Redis is unavailable.
    reconnectStrategy: false,
  },
});

redisClient.on("error", (err) => {
  console.error("Redis Error", err);
});

async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}

module.exports = { redisClient, connectRedis };