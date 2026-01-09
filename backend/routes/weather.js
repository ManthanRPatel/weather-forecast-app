const { Router } = require("express");
const axios = require("axios");
const { redisClient } = require("../config/redis");
const {
  WEATHER_API_URL,
  CACHE_EXPIRY,
} = require("../config/env");

const CACHE_KEY = "weather:processed";

const router = Router();

/**
 * Validate API response structure
 */
const isValidWeatherResponse = (data) => {
  return (data && Array.isArray(data.longterm) && data.longterm.length >= 10);
};

/**
 * Converts local time string to weekday name
 */
const getDayNameFromLocalTime = (localTime) => {
  if (!localTime) return null;
  const date = new Date(localTime);
  if (isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    weekday: "long",
  });
};

/**
 * Returns today's date string in YYYY-MM-DD format
 */
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // "2026-01-09"
};

router.get("/", async (req, res) => {
  try {

    // // ---------- 1️⃣ Try Redis first  // Not currently using cache. Because of frequent data changes.
    // const cachedData = await redisClient.get(CACHE_KEY);
    // if (cachedData) {
    //   return res.json({
    //     success: true,
    //     source: "cache",
    //     data: JSON.parse(cachedData),
    //   });
    // }

    // ---------- 2️⃣ Fetch from external API ----------
    const response = await axios.get(WEATHER_API_URL, { timeout: 8000 });

    if (!isValidWeatherResponse(response.data)) {
      return res.status(502).json({
        success: false,
        message: "Invalid weather data received",
      });
    }

    const longterm = response.data.longterm;
    const todayStr = getTodayDateString();

    // ---------- 3️⃣ Filter entries from today onwards ----------
    const futureEntries = longterm.filter((entry) => {
      const entryDate = entry?.time?.local?.split("T")[0]; // Extract the date part (YYYY-MM-DD)
      return entryDate >= todayStr; // Keep only entries where date is today or later
    });

    // ---------- 4️⃣ Map unique dates for first 7 days ----------
    const seenDates = new Set(); // To track which calendar dates we already added
    const first7Days = [];

    for (const entry of futureEntries) {
      const date = entry?.time?.local?.split("T")[0]; // Extract date part
      if (!date || seenDates.has(date)) continue; // Skip if date missing or already added

      const temp = entry?.day?.temperature?.value; // Get the daytime temperature
      const dayName = getDayNameFromLocalTime(entry?.time?.local); // Convert to weekday name

      if (typeof temp !== "number" || !dayName) continue; // Skip invalid data

      first7Days.push({ day: dayName, temperature: temp }); // Add to first7Days
      seenDates.add(date);  // Mark date as processed

      if (first7Days.length === 7) break; // Stop after 7 unique days
    }

    // ---------- 5️⃣ Average night temp (first 10 calendar days from today) ----------
    const nightTemps = [];
    const nightSeenDates = new Set();

    for (const entry of futureEntries) {
      const date = entry?.time?.local?.split("T")[0]; // Extract date
      if (!date || nightSeenDates.has(date)) continue; // Skip duplicates

      const nightTemp = entry?.night?.temperature?.value; // Get night temp
      if (typeof nightTemp === "number") {
        nightTemps.push(nightTemp); // Add to array
      }

      nightSeenDates.add(date); // Mark date as processed

      if (nightTemps.length === 10) break; // Stop after 10 unique nights
    }

    const averageNightTemperature =
      nightTemps.length > 0
        ? Number((nightTemps.reduce((a, b) => a + b, 0) / nightTemps.length).toFixed(2))
        : null;

    const processedData = {
      first7Days,
      averageNightTemperature,
    };

    // ---------- 6️⃣ Store in Redis with expiry ----------
    await redisClient.set(CACHE_KEY, JSON.stringify(processedData), {
      EX: CACHE_EXPIRY,
    });

    // ---------- 7️⃣ Respond immediately ----------
    res.json({
      success: true,
      source: "api",
      data: processedData,
    });
  } catch (error) {
    console.error("Weather API Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch weather data",
    });
  }
});

module.exports = router;
