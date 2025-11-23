"use server"

import { baseUrl } from "@/config/server";

export interface MarketAddressDomain {
    id: string;
    marketId: string;
    name: string;
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    latitude?: number | null;
    longitude?: number | null;
    createdAt: string;
    updatedAt: string;
}

export const getMarketAddressByMarketId = async (marketId: string): Promise<MarketAddressDomain | null> => {
    try {
        const response = await fetch(`${baseUrl}/api/v1/markets/${marketId}/address`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            if (response.status === 404) {
                return null;
            }
            throw new Error('Erro ao buscar endereço do mercado');
        }

        const address = await response.json() as MarketAddressDomain;
        return address;
    } catch (error) {
        console.error('Erro ao buscar endereço do mercado:', error);
        throw error;
    }
}


