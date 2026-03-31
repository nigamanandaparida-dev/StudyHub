// Centralized API configuration and axios instance
import axios from 'axios';

// Default live URL for the production site (Netlify)
const defaultLiveUrl = 'https://studyhub-ruyt.onrender.com';

// Current API URL: 
// 1. Check for the VITE_API_URL in the environment (Netlify/local .env)
// 2. If it's missing (unlikely in build), use the fallback to the live server
export const API_BASE_URL = import.meta.env.VITE_API_URL || defaultLiveUrl;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial for sessions/cookies
});

export default api;
