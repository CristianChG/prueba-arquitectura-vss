import type { IAuthRepository } from "@repositories/IAuthRepository";

export class LogoutUser {
  authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<void> {
    return this.authRepository.logout();
  }
}
