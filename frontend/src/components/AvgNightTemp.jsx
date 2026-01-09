import { Card, CardContent, Typography } from "@mui/material";
import "./AvgNightTemp.css";

const AvgNightTemp = ({ temperature }) => {
  return (
    <Card className="avg-night-card" elevation={3}>
      <CardContent>
        <Typography variant="subtitle1" className="avg-night-title">
          Average Night Temperature (10 days)
        </Typography>

        <Typography variant="h3" className="avg-night-value">
          {temperature !== null ? `${temperature}°C` : "N/A"}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AvgNightTemp;