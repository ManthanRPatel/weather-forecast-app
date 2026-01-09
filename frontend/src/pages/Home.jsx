import { useEffect, useState } from "react";
import { getWeather } from "../api/weather";
import ForecastCard from "../components/ForecastCard";
import AvgNightTemp from "../components/AvgNightTemp";
import { CircularProgress, Alert } from "@mui/material";
import "./Home.css";

const Home = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await getWeather();

        // Defensive check for correct data structure
        if (
          !res ||
          !res.success ||
          !res.data ||
          !Array.isArray(res.data.first7Days) ||
          typeof res.data.averageNightTemperature !== "number"
        ) {
          throw new Error("Invalid data format received from server");
        }

        setData(res.data);
      } catch (err) {
        console.error("Failed to load weather:", err);
        setError(err.message || "Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <CircularProgress />;

  if (error)
    return (
      <Alert severity="error" style={{ margin: "20px" }}>
        {error}
      </Alert>
    );

  // Extra safety: If data missing, show fallback
  const first7Days = data?.first7Days || [];
  const avgNightTemp = data?.averageNightTemperature ?? null;

  return (
    <div className="home-container">
      <div className="forecast-row">
        {first7Days.length > 0 ? (
          first7Days.map((item) => (
            <ForecastCard
              key={item.day}
              day={item.day}
              temperature={item.temperature}
            />
          ))
        ) : (
          <Alert severity="info">No forecast data available</Alert>
        )}
      </div>

      <AvgNightTemp temperature={avgNightTemp} />
    </div>
  );
};

export default Home;
