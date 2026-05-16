// src/services/api.js
// Axios client – base URL is read from app.json `extra.apiUrl`
// (or EAS env var EXPO_PUBLIC_API_URL), so the same JS bundle works
// for emulator dev, internal testing, staging, and production.
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const RUNTIME_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  Constants?.expoConfig?.extra?.apiUrl ||
  Constants?.manifest?.extra?.apiUrl ||
  'http://10.0.2.2:5000/api'; // Android emulator fallback for local dev

const API = axios.create({
  baseURL: RUNTIME_URL,
  timeout: 20000,
});

if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log('🌐 API base URL ->', RUNTIME_URL);
}

API.interceptors.request.use(async (config) => {
  try {
    const raw = await AsyncStorage.getItem('token');
    if (raw) {
      const token = raw.startsWith('"') ? JSON.parse(raw) : raw;
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (_) {}
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await AsyncStorage.multiRemove(['token', 'user']);
    }
    return Promise.reject(err);
  }
);

export default API;
