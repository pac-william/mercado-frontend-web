import { NextResponse } from 'next/server';
import { AuthResponse, CurrentUser } from '@/types/auth';
import { createMockToken, setAccessTokenCookie } from '../_utils';

export async function POST(req: Request) {
    if (process.env.USE_MOCK !== 'true') {
        return NextResponse.json({ message: 'Mock desabilitado' }, { status: 501 });
    }

    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
        }

        // Regra simples mock: qualquer email/senha >= 6 chars
        if (String(password).length < 6) {
            return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
        }

        const user: CurrentUser = {
            id: 'u_mock_1',
            name: email.split('@')[0] ?? 'Usuário',
            email,
            roles: email.startsWith('admin') ? ['admin'] : ['user']
        };

        const accessToken = createMockToken({
            id: user.id,
            name: user.name,
            email: user.email,
            roles: user.roles
        }, 60 * 60);

        setAccessTokenCookie(accessToken, 60 * 60);

        const body: AuthResponse = { accessToken, user };
        return NextResponse.json(body, { status: 200 });
    } catch (_e) {
        return NextResponse.json({ message: 'Erro interno' }, { status: 500 });
    }
}

