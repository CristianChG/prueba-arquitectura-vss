import type { ICompositeValidation } from "@repositories/ICompositeValidation";
import { CompositeValidation } from "@usecases/CompositeValidation";
import { EmailRequiredValidation } from "@validations/auth/emailValidation/EmailRequiredValidation";
import { EmailDomainValidation } from "@validations/auth/emailValidation/EmailDomainValidation";
import { EmailFormatValidation } from "@validations/auth/emailValidation/EmailFormatValidation";
import { EmailLengthValidation } from "@validations/auth/emailValidation/EmailLengthValidation";
import { PasswordRequiredValidation } from "@validations/auth/passwordValidation/PasswordRequiredValidation";
import { PasswordMinLengthValidation } from "@validations/auth/passwordValidation/PasswordMinLengthValidation";
import { PasswordUppercaseValidation } from "@validations/auth/passwordValidation/PasswordUppercaseValidation";
import { PasswordLowercaseValidation } from "@validations/auth/passwordValidation/PasswordLowercaseValidation";
import { PasswordNumberValidation } from "@validations/auth/passwordValidation/PasswordNumberValidation";
import { PasswordMatchValidation } from "@validations/auth/passwordValidation/PasswordMatchValidation";
import { NameRequiredValidation } from "@validations/auth/nameValidation/NameRequiredValidation";
import { NameMinLengthValidation } from "@validations/auth/nameValidation/NameMinLengthValidation";
import { NameMaxLengthValidation } from "@validations/auth/nameValidation/NameMaxLengthValidation";
import { NameFormatValidation } from "@validations/auth/nameValidation/NameFormatValidation";

export class AuthValidatorFactory {
  static createEmailValidator(): ICompositeValidation {
    return new CompositeValidation()
      .addValidation(new EmailRequiredValidation())
      .addValidation(new EmailDomainValidation())
      .addValidation(new EmailFormatValidation())
      .addValidation(new EmailLengthValidation());
  }

  static createLoginPasswordValidator(): ICompositeValidation {
    return new CompositeValidation()
      .addValidation(new PasswordRequiredValidation())
      .addValidation(new PasswordMinLengthValidation());
  }

  static createRegisterPasswordValidator(): ICompositeValidation {
    return new CompositeValidation()
      .addValidation(new PasswordRequiredValidation())
      .addValidation(new PasswordMinLengthValidation())
      .addValidation(new PasswordUppercaseValidation())
      .addValidation(new PasswordLowercaseValidation())
      .addValidation(new PasswordNumberValidation());
  }

  static createNameValidator(): ICompositeValidation {
    return new CompositeValidation()
      .addValidation(new NameRequiredValidation())
      .addValidation(new NameMinLengthValidation())
      .addValidation(new NameMaxLengthValidation())
      .addValidation(new NameFormatValidation());
  }

  static createPasswordMatchValidator(): ICompositeValidation {
    return new CompositeValidation().addValidation(
      new PasswordMatchValidation()
    );
  }
}

export const emailValidator = AuthValidatorFactory.createEmailValidator();
export const loginPasswordValidator =
  AuthValidatorFactory.createLoginPasswordValidator();
export const registerPasswordValidator =
  AuthValidatorFactory.createRegisterPasswordValidator();
export const nameValidator = AuthValidatorFactory.createNameValidator();
export const passwordMatchValidator =
  AuthValidatorFactory.createPasswordMatchValidator();
