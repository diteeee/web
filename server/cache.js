const redis = require("redis");
const logger = require("./config/logger");

const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

client.on("connect", () => {
  logger.info("Connected to Redis...");
});

client.on("error", (err) => {
  logger.error("Redis error:", err);
});

async function connectToRedis() {
  try {
    await client.connect();
    logger.info("Redis is ready");
  } catch (err) {
    logger.error("Failed to connect to Redis:", err);
  }
}

connectToRedis();

module.exports = client;
