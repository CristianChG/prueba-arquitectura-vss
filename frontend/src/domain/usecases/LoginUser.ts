// src/domain/usecases/LoginUser.ts

import type { IAuthRepository } from "../repositories/IAuthRepository";
import type { LoginCredentials, AuthResponse } from "../entities/User";

export class LoginUser {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    if (!credentials.email || !credentials.password) {
      throw new Error("Email y contraseña son requeridos");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error("Email inválido");
    }

    return await this.authRepository.login(credentials);
  }
}
