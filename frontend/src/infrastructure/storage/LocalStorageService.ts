import type { User, AuthTokens } from "@entities/User";
import { STORAGE_KEYS } from "@constants/storageKeys";
import { decodeToken, isTokenExpired } from "@validators/tokenValidators";

export class LocalStorageService {
  static setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  static setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  static setTokens(tokens: AuthTokens): void {
    this.setAccessToken(tokens.accessToken);
    this.setRefreshToken(tokens.refreshToken);
  }

  static clearTokens(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  // User data
  static setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static getUser(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }

  static clearUser(): void {
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  // Clear all auth data
  static clearAll(): void {
    this.clearTokens();
    this.clearUser();
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token;
  }

  static decodeToken = decodeToken;
  static isTokenExpired = isTokenExpired;
}
