// src/domain/usecases/RefreshAuthToken.ts
import type { IAuthRepository } from "../repositories/IAuthRepository";
import type { AuthResponse } from "../entities/User";

export class RefreshAuthToken {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(refreshToken: string): Promise<AuthResponse> {
    if (!refreshToken) {
      throw new Error("Refresh token requerido");
    }

    return await this.authRepository.refreshToken(refreshToken);
  }
}
