import type { IAuthRepository } from "@repositories/IAuthRepository";
import type { User } from "@entities/User";
import {
  emailValidator,
  registerPasswordValidator,
  nameValidator,
} from "@factories/AuthValidatorFactory";
import { MESSAGES } from "@constants/messages";

export class RegisterUserUseCase {
  private authRepository: IAuthRepository;

  constructor(authRepository: IAuthRepository) {
    this.authRepository = authRepository;
  }

  async execute(email: string, password: string, name: string): Promise<User> {
    if (!email || !password || !name) {
      throw new Error(MESSAGES.AUTH.REQUIRED_FIELDS);
    }

    const emailResult = emailValidator.validate(email);
    if (emailResult.isValid === false) {
      throw new Error(MESSAGES.AUTH.INVALID_EMAIL);
    }

    const passwordResult = registerPasswordValidator.validate(password);
    if (passwordResult.isValid === false) {
      throw new Error(MESSAGES.AUTH.INVALID_PASSWORD);
    }

    const nameResult = nameValidator.validate(name);
    if (nameResult.isValid === false) {
      throw new Error(MESSAGES.AUTH.INVALID_NAME);
    }

    return this.authRepository.register(email, password, name);
  }
}
