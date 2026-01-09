
# Weather Forecast App

A full-stack weather forecast application using **Node.js**, **Express.js**, **React.js**, and **Redis**.  
The app fetches weather data from an external API, displays the first 7 days of day temperatures, calculates the average night temperature for the first 10 days, and caches the processed data in Redis.

---

## Prerequisites

Before running the project, make sure you have the following installed:

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **Redis** server running locally or accessible remotely
- Optional: **nodemon** globally for easier backend development (`npm install -g nodemon`)

---

## Project Structure

```
weather-forecast-app/
│
├── backend/
│   ├── config/
│   │   ├── env.js             # Environment variables
│   │   └── redis.js           # Redis client
│   ├── routes/
│   │   └── weather.js         # Weather API routes
│   └── server.js              # Express server entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── weather.js     # API helper to call backend
│   │   ├── components/
│   │   │   ├── AvgNightTemp.css
│   │   │   ├── AvgNightTemp.jsx
│   │   │   ├── ForecastCard.css
│   │   │   └── ForecastCard.jsx
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   ├── Home.css
│   │   │   └── Home.jsx
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   ├── eslint.config.js
│   └── vite.config.js
│
├── node_modules/
├── .env                       # Environment variables (for backend)
├── .gitignore
├── package.json               # Root Backend package.json
├── package-lock.json
└── README.md

````

---

## Backend Setup

1. Install Backend dependencies:

```bash
npm install
```

2. Create a `.env` file:

```env
WEATHER_API_URL=https://wxdata.apdtest.net/api/getweather
REDIS_URL=redis://127.0.0.1:6379
CACHE_EXPIRY=1  # seconds
PORT=3000
```

3. Start the backend server in development mode:

```bash
npm run dev
```

or in production mode:

```bash
npm start
```

* Backend API will run on `http://localhost:3000/`
* Redis will store cached weather data with expiry as specified in `.env`

---

## Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in `frontend/`:

```env
VITE_BASE_URL=http://localhost:3000
```

4. Start the frontend development server:

```bash
npm run dev
```

* Frontend will run on `http://localhost:5173/` (default Vite port)
* It fetches data from backend using `VITE_BASE_URL`

---

## How It Works

1. **Backend**

   * Checks Redis cache for processed weather data (`first7Days` + `averageNightTemperature`)
   * If not cached, fetches from the external API
   * Filters data from **today onwards**
   * Ensures **one entry per calendar day**
   * Stores processed data in Redis with **expiry (`CACHE_EXPIRY`)**
   * Responds immediately to frontend

2. **Frontend**

   * Loads the Home page
   * Calls backend API once
   * Displays first 7 days in `ForecastCard` components
   * Displays average night temperature in `AvgNightTemp` component
   * Handles errors gracefully if backend data is missing or invalid

---

## Scripts

### Backend (`package.json`)

```json
"scripts": {
  "dev": "nodemon backend/server.js",
  "start": "node backend/server.js"
}
```

### Frontend (`frontend/package.json`)

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint ."
}
```

---

## Notes

* All **environment variables** are centralized in `.env` files for flexibility
* Redis caching ensures **fast responses** and avoids hitting the external API frequently
* The backend is defensive:

  * Validates API response structure
  * Ignores invalid or missing data
  * Calculates first 7 unique days and average night temp correctly
* Frontend uses React functional components and **MUI** only for the loading spinner (can be removed if custom CSS is used)
