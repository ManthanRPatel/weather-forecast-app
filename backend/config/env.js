require("dotenv").config();

//global config variables
module.exports = {
  PORT: process.env.PORT || 3000,
  WEATHER_API_URL: process.env.WEATHER_API_URL || "https://wxdata.apdtest.net/api/getweather",
  REDIS_URL: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  CACHE_EXPIRY: Number(process.env.CACHE_EXPIRY || 1),
};
