import type { IAuthRepository } from "@repositories/IAuthRepository";
import type { AuthToken } from "@entities/AuthToken";
import { EmailValidation } from "@validations/auth/EmailValidation";
import { PasswordValidation } from "@validations/auth/PasswordValidation";
import { MESSAGES } from "@constants/messages";

export class LoginUser {
  private authRepository: IAuthRepository;
  private emailValidation: EmailValidation;
  private passwordValidation: PasswordValidation;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
    this.emailValidation = new EmailValidation();
    this.passwordValidation = new PasswordValidation();
  }

  async execute(email: string, password: string): Promise<AuthToken> {
    if (!email || !password) {
      throw new Error(MESSAGES.AUTH.REQUIRED_FIELDS);
    }

    if (this.emailValidation.validate(email) === false) {
      throw new Error(MESSAGES.AUTH.INVALID_EMAIL);
    }

    if (this.passwordValidation.validate(password) === false) {
      throw new Error(MESSAGES.AUTH.INVALID_PASSWORD);
    }

    return this.authRepository.login(email, password);
  }
}
