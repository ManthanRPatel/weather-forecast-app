import { Card, CardContent, Typography } from "@mui/material";
import "./ForecastCard.css";

const ForecastCard = ({ day, temperature }) => {
  return (
    <Card className="forecast-card" elevation={4}>
      <CardContent className="forecast-card-content">
        <Typography className="forecast-day">
          {day}
        </Typography>
        

        <Typography className="forecast-temp">
          Day Temperature: {temperature ?? "N/A"}°C
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;


// import { Card, CardContent, Typography } from "@mui/material";
// import "./ForecastCard.css";

// // Converts UTC date to readable weekday
// const getDayName = (utcDate) =>
//   new Date(utcDate).toLocaleDateString("en-US", {
//     weekday: "long",
//   });

// const ForecastCard = ({ dateUtc, dayTemp, nightTemp }) => {
//   return (
//     <Card className="forecast-card">
//       <CardContent>
//         <Typography className="day">
//           {getDayName(dateUtc)}
//         </Typography>

//         <Typography className="temp day-temp">
//           Day: {dayTemp ?? "N/A"}°C
//         </Typography>

//         {/* <Typography className="temp night-temp">
//           Night: {nightTemp ?? "N/A"}°C
//         </Typography> */}
//       </CardContent>
//     </Card>
//   );
// };

// export default ForecastCard;
