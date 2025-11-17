"use client"

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
import { getActiveCampaignsForCarousel, type Campaign } from "@/actions/campaign.actions";

export default function HeroSection() {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState(0);
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const activeCampaigns = await getActiveCampaignsForCarousel();
                const sortedCampaigns = activeCampaigns.sort((a, b) => a.slot - b.slot);
                setCampaigns(sortedCampaigns);
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

    if (loading || campaigns.length === 0) {
        return null;
    }

    if (campaigns.length === 1) {
        return (
            <div className="w-full relative">
                <div className="h-[500px] relative">
                    <Image
                        src={campaigns[0].imageUrl}
                        alt={campaigns[0].title}
                        fill
                        className="w-full h-full object-cover"
                        priority
                    />
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-md text-sm font-medium backdrop-blur-sm">
                        Promovido por Mercado
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
                    {campaigns.map((campaign) => (
                        <CarouselItem key={campaign.id} className="h-[500px] relative">
                            <Image
                                src={campaign.imageUrl}
                                alt={campaign.title}
                                width={1000}
                                height={500}
                                className="w-full h-full object-cover"
                                priority={campaigns.indexOf(campaign) === 0}
                            />
                            <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-md text-sm font-medium backdrop-blur-sm">
                                Promovido por NOME DO MERCADO AQUI MEU BROTHERRRRR
                            </div>
                        </CarouselItem>
                    ))}
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