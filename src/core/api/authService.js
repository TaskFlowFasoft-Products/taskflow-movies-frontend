

import axios from 'axios';
import { VITE_API_URL } from "../config/config";

export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem('expires_at');
  if (!expiresAt) return true;

  const expirationTime = new Date(expiresAt).getTime();
  const currentTime = new Date().getTime();

  return currentTime >= expirationTime;
};

export const clearAuthData = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('expires_at');
  localStorage.removeItem('username');
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('access_token');
  return token && !isTokenExpired();
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${VITE_API_URL}/auth/login`, { email, password });

    if (response.status === 200) {
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      return {
        success: true,
        access_token: response.data.access_token,
        expires_at: expiresAt.toISOString(),
        username: response.data.username
      };
    } else {
      return {
        success: false,
        message: response.data.detail
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Email ou senha incorretos.'
    };
  }
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.config.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 || isTokenExpired()) {
      clearAuthData();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
