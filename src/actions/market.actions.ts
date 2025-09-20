"use server"

import { Market, MarketPaginatedResponse } from "@/app/domain/marketDomain"
import { baseUrl } from "@/config/server"
import { MarketDTO } from "@/dtos/marketDTO"

export const getMarkets = async () => {
    const response = await fetch(`${baseUrl}/api/v1/markets`)
    const data = await response.json() as MarketPaginatedResponse
    return data
}

export const getMarketById = async (id: string) => {
    const response = await fetch(`${baseUrl}/api/v1/markets/${id}`)
    const data = await response.json() as Market
    return data
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