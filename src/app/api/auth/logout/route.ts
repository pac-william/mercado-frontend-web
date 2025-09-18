import { NextResponse } from 'next/server';
import { clearAccessTokenCookie } from '../_utils';
import { buildApiUrl } from '@/lib/http';

export async function POST(req: Request) {
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
        // Lógica mock (mantida para desenvolvimento)
        clearAccessTokenCookie();
        return NextResponse.json({ message: 'Logout realizado com sucesso' }, { status: 200 });
    }

    // Proxy para backend real
    try {
        const backendUrl = buildApiUrl('/api/v1/auth/logout');
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Importante para enviar cookies
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Backend gerencia cookies automaticamente
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}


