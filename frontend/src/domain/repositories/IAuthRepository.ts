// src/domain/repositories/IAuthRepository.ts

import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
} from "../entities/User";

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  register(data: RegisterData): Promise<AuthResponse>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthResponse>;
  getCurrentUser(): Promise<User>;
  verifyToken(token: string): Promise<boolean>;
}
