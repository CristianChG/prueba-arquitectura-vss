import type { IAuthRepository } from "@repositories/IAuthRepository";
import type { AuthToken } from "@entities/AuthToken";
import { MESSAGES } from "@constants/messages";

export class RefreshTokenUseCase {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(refreshToken: string): Promise<AuthToken> {
    if (!refreshToken) {
      throw new Error(MESSAGES.AUTH.REFRESH_TOKEN_MISSING);
    }

    return this.authRepository.refreshToken(refreshToken);
  }
}
