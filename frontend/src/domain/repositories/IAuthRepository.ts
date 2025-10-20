import type { User } from "@entities/User";
import type { AuthToken } from "@entities/AuthToken";
import type { DecodedToken } from "@entities/DecodedToken";

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthToken>;
  register(email: string, password: string, name: string): Promise<User>;
  logout(): Promise<void>;
  refreshToken(refreshToken: string): Promise<AuthToken>;
  verifyToken(token: string): Promise<DecodedToken>;
  getCurrentUser(): Promise<User>;
}
