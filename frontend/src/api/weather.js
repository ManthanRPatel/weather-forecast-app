import axios from "axios";
import { BASE_URL } from "../config/api";

export const getWeather = async () => {
  const response = await axios.get(`${BASE_URL}/api/weather`);
  return response.data;
};