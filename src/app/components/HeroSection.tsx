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

const heroImages = [
    "/hero/criativo-65b3c52c4e82aMjYvMDEvMjAyNCAxMWg0Mw==.jpg",
    "/hero/5ad42047-7cd0-4f88-8717-005ad295fee8.jpg",
    "/hero/a394c1be-7783-49fe-b792-8b46397f0037.jpg",
    "/hero/Social_media_banner_here_has_savings_for_products_on_great_deals.jpg",
    "/hero/10834881.jpg",
    "/hero/10834883.jpg"
];

export default function HeroSection() {
    const [api, setApi] = useState<CarouselApi | null>(null);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        const interval = setInterval(() => {
            api.scrollNext();
        }, 10000);

        return () => clearInterval(interval);
    }, [api]);

    useEffect(() => {
        if (!api) return;

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

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
                    {heroImages.map((image, index) => (
                        <CarouselItem key={index} className="h-[500px]">
                            <Image
                                src={image}
                                alt={`Hero Image ${index + 1}`}
                                width={1000}
                                height={500}
                                className="w-full h-full object-cover"
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                    
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />

                {/* Indicadores de slide */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {heroImages.map((_, index) => (
                        <button
                            key={index}
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