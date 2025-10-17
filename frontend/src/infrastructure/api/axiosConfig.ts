// src/infrastructure/api/axiosConfig.ts

import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { LocalStorageService } from "@storage/LocalStorageService";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor de solicitudes
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = LocalStorageService.getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Si el token expiró (401) y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = LocalStorageService.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Intentar refrescar el token
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        LocalStorageService.setAccessToken(accessToken);
        LocalStorageService.setRefreshToken(newRefreshToken);

        // Reintentar la solicitud original con el nuevo token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Si falla el refresh, limpiar storage y redirigir al login
        LocalStorageService.clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
