// src/infrastructure/api/AuthAPI.ts

import axiosInstance from "@api/axiosConfig";
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "@entities/User";
import type { IAuthRepository } from "@repositories/IAuthRepository";
import { LocalStorageService } from "@storage/LocalStorageService";

export default class AuthAPI implements IAuthRepository {
  private readonly baseURL = "/auth";

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        `${this.baseURL}/login`,
        credentials
      );

      const { user, tokens } = response.data;

      // Guardar tokens y usuario en localStorage
      LocalStorageService.setTokens(tokens);
      LocalStorageService.setUser(user);

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          error.response.data.message || "Error al iniciar sesión"
        );
      }
      throw new Error("Error de conexión. Intente nuevamente.");
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        `${this.baseURL}/register`,
        data
      );

      const { user, tokens } = response.data;

      // Guardar tokens y usuario en localStorage
      LocalStorageService.setTokens(tokens);
      LocalStorageService.setUser(user);

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Error al registrarse");
      }
      throw new Error("Error de conexión. Intente nuevamente.");
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = LocalStorageService.getRefreshToken();

      if (refreshToken) {
        await axiosInstance.post(`${this.baseURL}/logout`, { refreshToken });
      }
    } catch (error) {
      console.error("Error al cerrar sesión en el servidor:", error);
    } finally {
      // Siempre limpiar el localStorage
      LocalStorageService.clearAll();
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        `${this.baseURL}/refresh`,
        { refreshToken }
      );

      const { tokens } = response.data;
      LocalStorageService.setTokens(tokens);

      return response.data;
    } catch (error: any) {
      LocalStorageService.clearAll();
      throw new Error("Sesión expirada. Por favor, inicie sesión nuevamente.");
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await axiosInstance.get<User>(`${this.baseURL}/me`);

      // Actualizar usuario en localStorage
      LocalStorageService.setUser(response.data);

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        LocalStorageService.clearAll();
        throw new Error("Sesión no válida");
      }
      throw new Error("Error al obtener usuario actual");
    }
  }

  async verifyToken(token: string): Promise<boolean> {
    try {
      await axiosInstance.post(`${this.baseURL}/verify`, { token });
      return true;
    } catch {
      return false;
    }
  }
}
