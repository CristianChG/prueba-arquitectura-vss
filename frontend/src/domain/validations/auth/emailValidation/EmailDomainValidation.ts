import type { IValidation } from "@repositories/IValidation";
import type { ValidationResult } from "@entities/ValidationResult";
import { MESSAGES } from "@constants/messages";
import { APP_CONFIG } from "@constants/appConfig";

export class EmailDomainValidation implements IValidation {
  private allowedDomains: string[];

  constructor(allowedDomains: string[] = []) {
    this.allowedDomains = allowedDomains;
  }

  validate(email: string): ValidationResult {
    if (this.allowedDomains.length === 0) {
      return { isValid: true };
    }

    const domain = email.split(APP_CONFIG.EMAIL_DOMAIN)[1]?.toLowerCase();
    if (!domain || !this.allowedDomains.includes(domain)) {
      return {
        isValid: false,
        error: MESSAGES.AUTH.INVALID_EMAIL_DOMAIN,
      };
    }

    return { isValid: true };
  }
}
