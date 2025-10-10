import { NextResponse } from 'next/server';
import { AuthResponse, CurrentUser } from '@/types/auth';
import { createMockToken, setAccessTokenCookie } from '../_utils';
import { buildApiUrl } from '@/lib/http';
import { UserDTO } from '@/dtos/userDTO';

export async function POST(req: Request) {
    const useMock = process.env.USE_MOCK !== 'false';
    
    if (useMock) {
        try {
            const body = await req.json();
            
            const validation = UserDTO.safeParse(body);
            
            if (!validation.success) {
                const firstError = validation.error.issues[0];
                return NextResponse.json(
                    { message: firstError.message || 'Dados inválidos' }, 
                    { status: 400 }
                );
            }

            const { name, email } = validation.data;

            if (email === 'duplicate@test.com') {
                return NextResponse.json(
                    { message: 'Email já cadastrado' }, 
                    { status: 409 }
                );
            }

            const user: CurrentUser = {
                id: 'u_mock_' + Date.now(),
                name,
                email,
                role: 'CUSTOMER'
            };

            const accessToken = createMockToken({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }, 60 * 60);

            await setAccessTokenCookie(accessToken, 60 * 60);

            const responseBody: AuthResponse = { 
                message: 'Conta criada com sucesso',
                role: user.role,
                id: user.id,
                accessToken,
                refreshToken: 'mock_refresh_token'
            };

            return NextResponse.json(responseBody, { status: 201 });
        } catch (error) {
            console.error('Erro no registro mock:', error);
            return NextResponse.json(
                { message: 'Erro interno no servidor' }, 
                { status: 500 }
            );
        }
    }

    try {
        const body = await req.json();
        
        const validation = UserDTO.safeParse(body);
        
        if (!validation.success) {
            const firstError = validation.error.issues[0];
            return NextResponse.json(
                { message: firstError.message || 'Dados inválidos' }, 
                { status: 400 }
            );
        }

        const backendUrl = buildApiUrl('/api/v1/auth/register');
        
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
        console.error('Erro ao conectar com o backend:', error);
        return NextResponse.json(
            { message: 'Erro ao conectar com o servidor' }, 
            { status: 500 }
        );
    }
}

