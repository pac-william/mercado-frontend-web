import { NextResponse } from 'next/server';
import { getAccessTokenFromRequest, parseMockToken, createMockToken, setAccessTokenCookie } from '../_utils';
import { buildApiUrl } from '@/lib/http';

export async function POST(req: Request) {
    const useMock = process.env.USE_MOCK !== 'false';
    
    if (useMock) {
        const token = await getAccessTokenFromRequest(req);
        const payload = parseMockToken(token);
        if (!payload) {
            return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
        }

        const newToken = createMockToken({
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role
        }, 60 * 60);

        await setAccessTokenCookie(newToken, 60 * 60);
        return NextResponse.json({ accessToken: newToken }, { status: 200 });
    }

    try {
        const body = await req.json();
        const backendUrl = buildApiUrl('/api/v1/auth/refresh-token');
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}


