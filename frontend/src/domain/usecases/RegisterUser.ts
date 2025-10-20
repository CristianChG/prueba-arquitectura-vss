import type { IAuthRepository } from "@repositories/IAuthRepository";
import type { User } from "@entities/User";
import { MESSAGES } from "@constants/messages";
import { EmailValidation } from "@validations/auth/EmailValidation";
import { PasswordValidation } from "@validations/auth/PasswordValidation";
import { NameValidation } from "@validations/auth/NameValidation";

export class RegisterUserUseCase {
  private authRepository: IAuthRepository;
  private emailValidation: EmailValidation;
  private passwordValidation: PasswordValidation;
  private nameValidation: NameValidation;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
    this.emailValidation = new EmailValidation();
    this.passwordValidation = new PasswordValidation();
    this.nameValidation = new NameValidation();
  }

  async execute(email: string, password: string, name: string): Promise<User> {
    if (!email || !password || !name) {
      throw new Error(MESSAGES.AUTH.REQUIRED_FIELDS);
    }

    if (this.emailValidation.validate(email) === false) {
      throw new Error(MESSAGES.AUTH.INVALID_EMAIL);
    }

    if (this.passwordValidation.validate(password) === false) {
      throw new Error(MESSAGES.AUTH.INVALID_PASSWORD);
    }

    if (this.nameValidation.validate(name) === false) {
      throw new Error(MESSAGES.AUTH.INVALID_NAME);
    }

    return this.authRepository.register(email, password, name);
  }
}
