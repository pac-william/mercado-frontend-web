export type Role = 'CUSTOMER' | 'MARKET_ADMIN' | 'admin' | 'user' | string;

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  marketId?: string;
  market?: {
    id: string;
    name: string;
    address: string;
    profilePicture?: string;
  };
}

export interface AuthResponse {
  message: string;
  role: Role;
  id: string;
  marketId?: string;
  market?: {
    id: string;
    name: string;
    address: string;
    profilePicture?: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface ApiErrorShape {
    message: string;
    code?: string | number;
    details?: unknown;
}

