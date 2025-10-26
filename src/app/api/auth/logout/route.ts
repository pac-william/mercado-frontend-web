import { buildApiUrl } from '@/lib/http';
import { NextResponse } from 'next/server';
import { clearAccessTokenCookie } from '../_utils';

export async function POST() {
    const useMock = process.env.USE_MOCK !== 'false';
    
    if (useMock) {
        await clearAccessTokenCookie();
        return NextResponse.json({ message: 'Logout realizado com sucesso' }, { status: 200 });
    }

    try {
        const backendUrl = buildApiUrl('/api/v1/auth/logout');
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: response.status });
    } catch {
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}


