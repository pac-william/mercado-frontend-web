import { NextResponse } from 'next/server';
import { CurrentUser } from '@/types/auth';
import { getAccessTokenFromRequest, parseMockToken } from '../_utils';
import { buildApiUrl } from '@/lib/http';

export async function GET(req: Request) {
    const useMock = process.env.USE_MOCK !== 'false';
    
    if (useMock) {
        const token = await getAccessTokenFromRequest(req);
        const payload = parseMockToken(token);
        if (!payload) {
            return NextResponse.json({ message: 'Não autenticado' }, { status: 401 });
        }

        const user: CurrentUser = {
            id: payload.id,
            name: payload.name,
            email: payload.email,
            role: payload.role || 'CUSTOMER'
        };

        return NextResponse.json({ user }, { status: 200 });
    }

    try {
        const token = await getAccessTokenFromRequest(req);
        if (!token) {
            return NextResponse.json({ message: 'Token não encontrado' }, { status: 401 });
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            const user: CurrentUser = {
                id: payload.id,
                name: payload.email?.split('@')[0] || 'Usuário',
                email: payload.email || '',
                role: payload.role || 'CUSTOMER',
                marketId: payload.marketId || undefined,
                market: payload.market || undefined
            };

            return NextResponse.json({ user }, { status: 200 });
        } catch (jwtError) {
            return NextResponse.json({ message: 'Token inválido' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}

