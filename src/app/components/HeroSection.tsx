"use client"

import { getActiveCampaignsForCarousel, type Campaign } from "@/actions/campaign.actions";
import { getMarketById } from "@/actions/market.actions";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HeroSection() {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState(0);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [marketNames, setMarketNames] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const activeCampaigns = await getActiveCampaignsForCarousel();
                const sortedCampaigns = activeCampaigns.sort((a, b) => a.slot - b.slot);
                setCampaigns(sortedCampaigns);

                const uniqueMarketIds = [...new Set(sortedCampaigns.map(c => c.marketId))];
                const marketNamesMap: Record<string, string> = {};
                
                await Promise.all(
                    uniqueMarketIds.map(async (marketId) => {
                        try {
                            const market = await getMarketById(marketId);
                            marketNamesMap[marketId] = market.name;
                        } catch (error) {
                            console.error(`Erro ao buscar mercado ${marketId}:`, error);
                            marketNamesMap[marketId] = "Mercado";
                        }
                    })
                );
                
                setMarketNames(marketNamesMap);
            } catch (error) {
                console.error("Erro ao buscar campanhas:", error);
                setCampaigns([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCampaigns();
    }, []);

    useEffect(() => {
        if (!api || campaigns.length <= 1) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, 10000);

        return () => clearInterval(interval);
    }, [api, campaigns.length]);

    useEffect(() => {
        if (!api || campaigns.length <= 1) return;

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api, campaigns.length]);

    const handleImageError = (campaignId: string) => {
        setImageErrors((prev) => new Set(prev).add(campaignId));
    };

    if (loading || campaigns.length === 0) {
        return (
            <div className="w-full relative">
                <div className="h-[500px] relative bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <div className="text-center space-y-4 px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                            {loading ? "Carregando ofertas..." : "Nenhuma oferta disponível no momento"}
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base">
                            {loading ? "Aguarde enquanto buscamos as melhores promoções" : "Volte em breve para conferir nossas promoções"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (campaigns.length === 1) {
        const campaign = campaigns[0];
        const hasError = imageErrors.has(campaign.id);
        
        return (
            <div className="w-full relative">
                <div className="h-[500px] relative">
                    {hasError ? (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                            <div className="text-center space-y-2 px-4">
                                <p className="text-gray-600 text-lg font-medium">Imagem não disponível</p>
                                <p className="text-gray-500 text-sm">{campaign.title}</p>
                            </div>
                        </div>
                    ) : (
                        <Image
                            unoptimized
                            src={campaign.imageUrl}
                            alt={campaign.title}
                            fill
                            className="w-full h-full object-cover"
                            priority
                            onError={() => handleImageError(campaign.id)}
                        />
                    )}
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-md text-sm font-medium backdrop-blur-sm">
                        Promovido por {marketNames[campaign.marketId] || "Mercado"}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full relative">
            <Carousel
                setApi={setApi}
                className="w-full h-full"
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent className="h-full">
                    {campaigns.map((campaign) => {
                        const hasError = imageErrors.has(campaign.id);
                        return (
                            <CarouselItem key={campaign.id} className="h-[500px] relative">
                                {hasError ? (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                        <div className="text-center space-y-2 px-4">
                                            <p className="text-gray-600 text-lg font-medium">Imagem não disponível</p>
                                            <p className="text-gray-500 text-sm">{campaign.title}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <Image
                                        unoptimized
                                        src={campaign.imageUrl}
                                        alt={campaign.title}
                                        width={1000}
                                        height={500}
                                        className="w-full h-full object-cover"
                                        priority={campaigns.indexOf(campaign) === 0}
                                        onError={() => handleImageError(campaign.id)}
                                    />
                                )}
                                <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-md text-sm font-medium backdrop-blur-sm">
                                    Promovido por {marketNames[campaign.marketId] || "Mercado"}
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                    
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />

                {/* Indicadores de slide */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {campaigns.map((_, index) => (
                        <button
                            key={campaigns[index].id}
                            className={`w-2 h-2 rounded-full transition-colors ${index === current ? "bg-primary" : "bg-primary/50"
                                }`}
                            onClick={() => api?.scrollTo(index)}
                        />
                    ))}
                </div>
            </Carousel>
        </div>
    );
}