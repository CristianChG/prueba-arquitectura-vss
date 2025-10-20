import type { IAuthRepository } from "@repositories/IAuthRepository";
import type { AuthToken } from "@entities/AuthToken";
import type { DecodedToken } from "@entities/DecodedToken";
import type { User } from "@entities/User";
import { AuthAPI } from "@api/AuthAPI";
import { LocalStorageService } from "@storage/LocalStorageService";
import { MESSAGES } from "@constants/messages";

export class AuthRepositoryAdapter implements IAuthRepository {
  private api: AuthAPI;
  private storage: LocalStorageService;

  constructor() {
    this.api = new AuthAPI();
    this.storage = new LocalStorageService();
  }

  async login(email: string, password: string): Promise<AuthToken> {
    const tokens = await this.api.login(email, password);
    this.storage.setAccessToken(tokens.accessToken);
    this.storage.setRefreshToken(tokens.refreshToken);
    return tokens;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const user = await this.api.register(email, password, name);
    return user;
  }

  async logout(): Promise<void> {
    try {
      await this.api.logout();
    } finally {
      this.storage.clear();
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthToken> {
    const tokens = await this.api.refreshToken(refreshToken);
    this.storage.setAccessToken(tokens.accessToken);
    this.storage.setRefreshToken(tokens.refreshToken);
    return tokens;
  }

  async verifyToken(token: string): Promise<DecodedToken> {
    const decoded = this.decodeToken(token);
    if (!decoded || decoded.exp * 1000 < Date.now()) {
      throw new Error(MESSAGES.AUTH.INVALID_TOKEN);
    }
    return decoded;
  }

  async getCurrentUser(): Promise<User> {
    return this.api.getCurrentUser();
  }

  private decodeToken(token: string): DecodedToken {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      throw new Error(MESSAGES.AUTH.INVALID_TOKEN);
    }
  }
}
