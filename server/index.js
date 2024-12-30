require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const redis = require("redis");
const logger = require("./config/logger");

app.use(express.json());
app.use(cors());
const jwt = require("jsonwebtoken");

const db = require("./models");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routers
const teacherRouter = require("./routes/Teacher");
app.use("/v1/teachers", teacherRouter);

const kidRouter = require("./routes/Kid");
app.use("/v1/kids", kidRouter);

const activityRouter = require("./routes/Activity");
app.use("/v1/activities", activityRouter);

const mealRouter = require("./routes/Meal");
app.use("/v1/meals", mealRouter);

const userRouter = require("./routes/User");
app.use("/v1/users", userRouter);

const signInRouter = require("./routes/SignIn");
app.use("/v1/signIn", signInRouter);

// Add Swagger-related imports and configurations here
const { swaggerUi, swaggerSpec } = require('./config/swagger');  // Import Swagger config

// Serve the Swagger API documentation at /api-docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "redis",
    port: process.env.REDIS_PORT || 6379,
    timeout: 5000,
  },
});

redisClient.on("connect", () => {
  logger.info("Connected to Redis...");
});

redisClient.on("error", (err) => {
  logger.error("Error connecting to Redis:", err);
});

db.sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
});