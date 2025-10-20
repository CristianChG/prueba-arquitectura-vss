import axiosInstance from "@api/axiosConfig";
import type { User } from "@entities/User";
import type { AuthToken } from "@entities/AuthToken";
import { API_ROUTES } from "@constants/APIRoutes";

export class AuthAPI {
  async login(email: string, password: string): Promise<AuthToken> {
    const { data } = await axiosInstance.post(API_ROUTES.LOGIN, {
      email,
      password,
    });
    return data;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const { data } = await axiosInstance.post(API_ROUTES.REGISTER, {
      email,
      password,
      name,
    });
    return data;
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
