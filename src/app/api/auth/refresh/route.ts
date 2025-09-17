import { NextResponse } from 'next/server';
import { getAccessTokenFromRequest, parseMockToken, createMockToken, setAccessTokenCookie } from '../_utils';

export async function POST() {
    // Temporariamente sempre ativo para desenvolvimento
    // if (process.env.USE_MOCK !== 'true') {
    //     return NextResponse.json({ message: 'Mock desabilitado' }, { status: 501 });
    // }

    const token = getAccessTokenFromRequest();
    const payload = parseMockToken(token);
    if (!payload) {
        return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const newToken = createMockToken({
        id: payload.id,
        name: payload.name,
        email: payload.email,
        roles: payload.roles
    }, 60 * 60);

    setAccessTokenCookie(newToken, 60 * 60);
    return NextResponse.json({ accessToken: newToken }, { status: 200 });
}


