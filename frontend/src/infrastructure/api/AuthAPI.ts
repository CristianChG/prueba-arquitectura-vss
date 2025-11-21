import axiosInstance from "@api/axiosConfig";
import type { User } from "@entities/User";
import type { AuthToken } from "@entities/AuthToken";
import { API_ROUTES } from "@constants/APIRoutes";

export class AuthAPI {
  async login(email: string, password: string): Promise<AuthToken> {
    try {
      const { data } = await axiosInstance.post(API_ROUTES.LOGIN, {
        email,
        password,
      });
      return data;
    } catch (error: any) {
      console.error('Login API Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Request URL:', error.config?.url);
      console.error('Request baseURL:', error.config?.baseURL);

      // Re-throw with better error message
      const errorMessage = error.response?.data?.error || error.message || 'Error al iniciar sesión';
      throw new Error(errorMessage);
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const { data } = await axiosInstance.post(API_ROUTES.REGISTER, {
        email,
        password,
        name,
      });
      return data;
    } catch (error: any) {
      console.error('Register API Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);

      const errorMessage = error.response?.data?.error || error.message || 'Error al registrar usuario';
      throw new Error(errorMessage);
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const { data } = await axiosInstance.post(API_ROUTES.REFRESH_TOKEN, {
      refreshToken,
    });
    return data;
  }

  async getCurrentUser(): Promise<User> {
    const { data } = await axiosInstance.get(API_ROUTES.GET_CURRENT_USER);
    return data;
  }

  async logout(): Promise<void> {
    await axiosInstance.post(API_ROUTES.LOGOUT);
  }
}
