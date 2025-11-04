"use server"

import { baseUrl } from "@/config/server";

export interface RegisterMarketRequest {
    name: string;
    userName?: string;
    email: string;
    password: string;
    address: string;
    profilePicture?: string;
}

export interface RegisterMarketResponse {
    message: string;
    market: {
        id: string;
        name: string;
        address: string;
    };
    user: {
        auth0Id: string;
        email: string;
    };
}

export const createMarketForUser = async (data: {
    auth0Id: string;
    marketName: string;
    address: string;
    profilePicture?: string;
    userName?: string;
    email?: string;
}): Promise<RegisterMarketResponse> => {
    try {
        const url = `${baseUrl}/api/v1/auth/create-market-for-user`;
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                auth0Id: data.auth0Id,
                marketName: data.marketName,
                address: data.address,
                profilePicture: data.profilePicture,
                userName: data.userName,
                email: data.email,
            }),
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorData: { message?: string; error?: string; errors?: unknown } = {};
            try {
                errorData = await response.json() as { message?: string; error?: string; errors?: unknown };
            } catch {
                errorData = { message: `Erro HTTP ${response.status}: ${response.statusText}` };
            }

            if (response.status === 409) {
                throw new Error(errorData.message || 'Email já está em uso');
            }
            if (response.status === 400) {
                const errorMessage = errorData.message || 
                    (errorData.errors ? JSON.stringify(errorData.errors) : 'Erro de validação');
                throw new Error(errorMessage);
            }
            if (response.status === 401) {
                throw new Error('Usuário não autenticado');
            }
            if (response.status === 500) {
                throw new Error(errorData.message || errorData.error || 'Erro interno do servidor');
            }
            throw new Error(errorData.message || errorData.error || `Erro ao criar mercado (${response.status})`);
        }

        const result = await response.json() as RegisterMarketResponse;
        return result;
    } catch (error) {
        console.error('Erro ao criar mercado:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Erro ao criar mercado');
    }
};

export const registerMarket = async (data: RegisterMarketRequest): Promise<RegisterMarketResponse> => {
    try {
        const url = `${baseUrl}/api/v1/auth/register/market`;

        const payload = {
            marketName: data.name, // Nome do mercado
            name: data.userName || data.name, // Nome do responsável
            email: data.email,
            password: data.password,
            address: data.address,
            ...(data.profilePicture && data.profilePicture !== '$undefined' && data.profilePicture.trim() !== '' 
                ? { profilePicture: data.profilePicture } 
                : {}),
        };
        
        console.log('🔵 baseUrl config:', baseUrl);
        console.log('🔵 URL completa:', url);
        console.log('🔵 Dados enviados:', { ...payload, password: '***' });
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            cache: 'no-store',
        });

        if (!response.ok) {
            let errorData: { message?: string; error?: string; errors?: unknown } = {};
            try {
                errorData = await response.json() as { message?: string; error?: string; errors?: unknown };
            } catch {
                errorData = { message: `Erro HTTP ${response.status}: ${response.statusText}` };
            }

            if (response.status === 409) {
                throw new Error(errorData.message || 'Email já está em uso');
            }
            if (response.status === 400) {
                const errorMessage = errorData.message || 
                    (errorData.errors ? JSON.stringify(errorData.errors) : 'Erro de validação');
                throw new Error(errorMessage);
            }
            if (response.status === 401) {
                throw new Error('Usuário não autenticado');
            }
            if (response.status === 500) {
                throw new Error(errorData.message || errorData.error || 'Erro interno do servidor');
            }
            throw new Error(errorData.message || errorData.error || `Erro ao registrar mercado (${response.status})`);
        }

        const result = await response.json() as RegisterMarketResponse;
        return result;
    } catch (error) {
        console.error('Erro ao registrar mercado:', error);
        console.error('Detalhes do erro:', {
            message: error instanceof Error ? error.message : 'Erro desconhecido',
            stack: error instanceof Error ? error.stack : undefined,
        });
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Erro ao registrar mercado');
    }
};
