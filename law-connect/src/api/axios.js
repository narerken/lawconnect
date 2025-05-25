// src/api/axios.js
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем токен авторизации, если он есть в localStorage
instance.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Глобальная обработка ошибок (опционально)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export default instance;
