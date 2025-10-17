import type { IAuthRepository } from "@repositories/IAuthRepository";

export class LogoutUser {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
