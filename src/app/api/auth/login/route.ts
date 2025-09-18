import { NextResponse } from 'next/server';
import { AuthResponse, CurrentUser } from '@/types/auth';
import { createMockToken, setAccessTokenCookie } from '../_utils';
import { buildApiUrl } from '@/lib/http';

export async function POST(req: Request) {
    const useMock = process.env.USE_MOCK === 'true';
    
    if (useMock) {
        // Lógica mock (mantida para desenvolvimento)
        try {
            const { email, password } = await req.json();
            if (!email || !password) {
                return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
            }

            if (String(password).length < 6) {
                return NextResponse.json({ message: 'Senha deve ter pelo menos 6 caracteres' }, { status: 401 });
            }

            if (email === 'invalid@test.com') {
                return NextResponse.json({ message: 'Email ou senha inválidos' }, { status: 401 });
            }

            const user: CurrentUser = {
                id: 'u_mock_1',
                name: email.split('@')[0] ?? 'Usuário',
                email,
                role: email.startsWith('admin') ? 'MARKET_ADMIN' : 'CUSTOMER'
            };

            const accessToken = createMockToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }, 60 * 60);

            setAccessTokenCookie(accessToken, 60 * 60);

            const body: AuthResponse = { 
                message: 'Login realizado com sucesso',
                role: user.role,
                id: user.id,
                accessToken,
                refreshToken: 'mock_refresh_token'
            };
            return NextResponse.json(body, { status: 200 });
        } catch (_e) {
            return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
        }
    }

    // Proxy para backend real
    try {
        const body = await req.json();
        const backendUrl = buildApiUrl('/api/v1/auth/login');
        
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
            credentials: 'include', // Importante para enviar cookies
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        // Backend gerencia cookies automaticamente, apenas retornamos a resposta
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}

