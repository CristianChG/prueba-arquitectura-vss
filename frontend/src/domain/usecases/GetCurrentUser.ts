import type { IAuthRepository } from "@repositories/IAuthRepository";
import type { User } from "@entities/User";

export class GetCurrentUser {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(): Promise<User> {
    return await this.authRepository.getCurrentUser();
  }
}
