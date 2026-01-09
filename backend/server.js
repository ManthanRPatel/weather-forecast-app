const express = require("express");
const cors = require("cors");
const weatherRouter = require("./routes/weather");
const { connectRedis } = require("./config/redis");
const { PORT } = require("./config/env");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/weather", weatherRouter);

// Global error handler (last line of defense)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ success: false });
});

// Start server AFTER Redis connects
connectRedis().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});