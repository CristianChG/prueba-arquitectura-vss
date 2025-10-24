import { STORAGE_KEYS } from "@utils/constants/storageKeys";

export class LocalStorageService {
  setAccessToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  clear(): void {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }
}
