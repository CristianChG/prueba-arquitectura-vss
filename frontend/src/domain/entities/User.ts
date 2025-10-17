export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "investigator" | "veterinarian" | "normal_user";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "investigator" | "veterinarian" | "normal_user";
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
