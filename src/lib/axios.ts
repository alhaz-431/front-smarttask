import axios from 'axios';

const api = axios.create({
  // নিশ্চিত করুন আপনার .env ফাইলে এটি সঠিক এবং শেষে কোনো বাড়তি স্পেস নেই
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// রেসপন্স ইন্টারসেপ্টর যোগ করা ভালো (যেমন টোকেন এক্সপায়ার হলে লগ-আউট করা)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // টোকেন এক্সপায়ারড হলে লোকাল স্টোরেজ থেকে ডিলিট করে দিন
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;