"use server"

import { Market, MarketPaginatedResponse } from "@/app/domain/marketDomain"
import { baseUrl } from "@/config/server"
import { MarketDTO } from "@/dtos/marketDTO"
import { auth0 } from "@/lib/auth0"

export const getMarkets = async () => {
    try {
        const response = await fetch(`${baseUrl}/api/v1/markets`, {
            cache: 'no-store',
        });
        
        if (!response.ok) {
            throw new Error('Erro ao buscar mercados');
        }
        
        const data = await response.json() as MarketPaginatedResponse;
        return data;
    } catch (error) {
        console.error('Erro ao buscar mercados:', error);
        throw error;
    }
}

export const getMarketById = async (id: string) => {
    try {
        const response = await fetch(`${baseUrl}/api/v1/markets/${id}`, {
            cache: 'no-store',
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Mercado não encontrado');
            }
            throw new Error('Erro ao buscar mercado');
        }
        
        const data = await response.json() as Market;
        return data;
    } catch (error) {
        console.error('Erro ao buscar mercado:', error);
        throw error;
    }
}

export const createMarket = async (market: MarketDTO) => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/markets`, {
            method: "POST",
            body: JSON.stringify(market),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.tokenSet.idToken}`,
            },
            cache: 'no-store',
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Usuário não autenticado');
            }
            if (response.status === 403) {
                throw new Error('Acesso negado');
            }
            if (response.status === 400) {
                const error = await response.json();
                throw new Error(error.message || 'Erro de validação');
            }
            throw new Error('Erro ao criar mercado');
        }
        
        const data = await response.json() as Market;
        return data;
    } catch (error) {
        console.error('Erro ao criar mercado:', error);
        throw error;
    }
}