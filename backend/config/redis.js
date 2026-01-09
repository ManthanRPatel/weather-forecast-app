const { createClient } = require("redis");
const { REDIS_URL } = require("./env");

// Create Redis client
const redisClient = createClient({
  url: REDIS_URL,
});

// Log Redis errors instead of crashing app
redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

// Connect once when server starts
const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis connected");
  }
};

module.exports = {
  redisClient,
  connectRedis,
};
