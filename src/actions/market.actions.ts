"use server"

import { Market, MarketPaginatedResponse } from "@/app/domain/marketDomain"
import { baseUrl } from "@/config/server"
import { MarketDTO } from "@/dtos/marketDTO"

export const getMarkets = async () => {
    // Usando dados mock diretamente (como estava antes)
    const { markets } = await import('@/lib/mock-data');
    
    return {
        markets,
        meta: {
            page: 1,
            size: markets.length,
            total: markets.length,
            totalPages: 1,
            totalItems: markets.length
        }
    } as any; // Usar any temporariamente para evitar problemas de tipo
}

export const getMarketById = async (id: string) => {
    // Usando dados mock diretamente (como estava antes)
    const { markets } = await import('@/lib/mock-data');
    const market = markets.find(m => m.id === id);
    
    if (!market) {
        throw new Error('Mercado não encontrado');
    }
    
    return market as any; // Usar any temporariamente para evitar problemas de tipo
}

export const createMarket = async (market: MarketDTO) => {
    const response = await fetch(`${baseUrl}/api/v1/markets`, {
        method: "POST",
        body: JSON.stringify(market),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json() as Market
    return data
}