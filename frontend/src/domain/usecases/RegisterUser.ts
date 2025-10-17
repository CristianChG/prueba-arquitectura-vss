// src/domain/usecases/RegisterUser.ts

import type { IAuthRepository } from "../repositories/IAuthRepository";
import type { RegisterData, AuthResponse } from "../entities/User";

export class RegisterUser {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(data: RegisterData): Promise<AuthResponse> {
    if (!data.email || !data.password || !data.name) {
      throw new Error("Todos los campos son requeridos");
    }

    if (data.password.length < 8) {
      throw new Error("La contraseña debe tener al menos 8 caracteres");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Email inválido");
    }

    return await this.authRepository.register(data);
  }
}
