import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = axios.create({
  baseURL: "http://10.0.2.2:5000/api" // change if using real device
});

// 🔐 AUTO ATTACH TOKEN TO EVERY REQUEST
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");

  if (token) {
    config.headers.Authorization = JSON.parse(token);
  }

  return config;
});

export default API;