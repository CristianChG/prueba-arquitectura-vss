import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import { LocalStorageService } from "@storage/LocalStorageService";
import { APP_CONFIG } from "@constants/appConfig";
import { API_ROUTES } from "@constants/APIRoutes";
import { APP_ROUTES } from "@constants/AppRoutes";

const API_BASE_URL = APP_CONFIG.API_BASE_URL || "http://localhost:3000/api";

const storageService = new LocalStorageService();

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storageService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = storageService.getRefreshToken();
        if (refreshToken) {
          const { data } = await axios.post(
            API_BASE_URL + API_ROUTES.REFRESH_TOKEN,
            {
              refreshToken,
            }
          );
          storageService.setAccessToken(data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        storageService.clear();
        console.error(refreshError);
        window.location.href = APP_ROUTES.LOGIN;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
