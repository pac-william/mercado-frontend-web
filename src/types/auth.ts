export type Role = 'admin' | 'user' | string;

export interface CurrentUser {
    id: string;
    name: string;
    email: string;
    roles?: Role[];
}

export interface AuthResponse {
    accessToken: string;
    user: CurrentUser;
}

export interface ApiErrorShape {
    message: string;
    code?: string | number;
    details?: unknown;
}

