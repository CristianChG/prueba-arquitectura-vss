import type { IAuthRepository } from "@repositories/IAuthRepository";
import type { AuthToken } from "@entities/AuthToken";
import {
  emailValidator,
  loginPasswordValidator,
} from "@factories/AuthValidatorFactory";
import { MESSAGES } from "@constants/messages";

export class LoginUser {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(email: string, password: string): Promise<AuthToken> {
    if (!email || !password) {
      throw new Error(MESSAGES.AUTH.REQUIRED_FIELDS);
    }

    const emailResult = emailValidator.validate(email);
    if (emailResult.isValid === false) {
      throw new Error(MESSAGES.AUTH.INVALID_EMAIL);
    }

    const passwordResult = loginPasswordValidator.validate(password);
    if (passwordResult.isValid === false) {
      throw new Error(MESSAGES.AUTH.INVALID_PASSWORD);
    }

    return this.authRepository.login(email, password);
  }
}
