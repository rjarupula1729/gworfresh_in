import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.0.2.2:5000/api" // change if using real device
});

// 🔐 AUTO ATTACH TOKEN TO EVERY REQUEST
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    const parsedToken = typeof token === 'string' ? JSON.parse(token) : token;
    config.headers.Authorization = `Bearer ${parsedToken}`;
  }

  return config;
});

// Handle errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - token might be invalid, clear storage
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

export default API;