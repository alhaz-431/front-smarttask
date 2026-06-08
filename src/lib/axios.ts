import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  // শুধুমাত্র ব্রাউজারে localStorage চেক করুন
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

console.log("Axios Base URL:", process.env.NEXT_PUBLIC_API_URL);
export default api;