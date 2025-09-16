import { cookies } from 'next/headers';

export const ACCESS_TOKEN_COOKIE = 'accessToken';

const isProd = process.env.NODE_ENV === 'production';

export interface MockTokenPayload {
    id: string;
    name: string;
    email: string;
    roles?: string[];
    exp: number; // epoch seconds
}

export function createMockToken(payload: Omit<MockTokenPayload, 'exp'>, ttlSeconds = 60 * 60): string {
    const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
    const full: MockTokenPayload = { ...payload, exp };
    const json = JSON.stringify(full);
    return Buffer.from(json, 'utf8').toString('base64url');
}

export function parseMockToken(token: string | undefined | null): MockTokenPayload | null {
    if (!token) return null;
    try {
        const json = Buffer.from(token, 'base64url').toString('utf8');
        const obj = JSON.parse(json) as MockTokenPayload;
        if (!obj.exp || obj.exp < Math.floor(Date.now() / 1000)) return null;
        return obj;
    } catch (_e) {
        return null;
    }
}

export function setAccessTokenCookie(token: string, maxAgeSec = 60 * 60) {
    cookies().set(ACCESS_TOKEN_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
        maxAge: maxAgeSec
    });
}

export function clearAccessTokenCookie() {
    cookies().set(ACCESS_TOKEN_COOKIE, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: isProd,
        path: '/',
        maxAge: 0
    });
}

export function getAccessTokenFromRequest(): string | null {
    const cookieStore = cookies();
    const fromCookie = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    if (fromCookie) return fromCookie;
    return null;
}


