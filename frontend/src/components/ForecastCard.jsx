import { Card, CardContent, Typography } from "@mui/material";
import "./ForecastCard.css";

const ForecastCard = ({ day, temperature }) => {
  return (
    <Card className="forecast-card" elevation={4}>
      <CardContent className="forecast-card-content">
        <Typography className="forecast-day">
          {day ? day : "N/A"}
        </Typography>
        

        <Typography className="forecast-temp">
          Day Temperature: {temperature ?? "N/A"}°C
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;