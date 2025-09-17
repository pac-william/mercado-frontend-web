import { NextResponse } from 'next/server';
import { CurrentUser } from '@/types/auth';
import { getAccessTokenFromRequest, parseMockToken } from '../_utils';

export async function GET() {
    // Temporariamente sempre ativo para desenvolvimento
    // if (process.env.USE_MOCK !== 'true') {
    //     return NextResponse.json({ message: 'Mock desabilitado' }, { status: 501 });
    // }

    const token = getAccessTokenFromRequest();
    const payload = parseMockToken(token);
    if (!payload) {
        return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
    }

    const user: CurrentUser = {
        id: payload.id,
        name: payload.name,
        email: payload.email,
        roles: payload.roles ?? []
    };

    return NextResponse.json({ user }, { status: 200 });
}

