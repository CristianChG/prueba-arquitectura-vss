export interface DecodedToken {
  userId: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}
