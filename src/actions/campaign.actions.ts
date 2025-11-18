"use server";

import { baseUrl } from "@/config/server";

export type Campaign = {
    id: string;
    marketId: string;
    title: string;
    imageUrl: string;
    slot: number;
    startDate: string;
    endDate: string | null;
    status: "DRAFT" | "SCHEDULED" | "ACTIVE" | "EXPIRED";
    createdAt: string;
    updatedAt: string;
};

export const getActiveCampaignsForCarousel = async (marketId?: string): Promise<Campaign[]> => {
    try {
        const params = new URLSearchParams();
        if (marketId) {
            params.append("marketId", marketId);
        }

        const response = await fetch(
            `${baseUrl}/api/v1/campaigns/carousel?${params.toString()}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            if (response.status === 404 || response.status === 500) {
                return [];
            }
            throw new Error("Erro ao buscar campanhas");
        }

        const campaigns = (await response.json()) as Campaign[];
        return campaigns;
    } catch (error) {
        console.error("Erro ao buscar campanhas:", error);
        return [];
    }
};

