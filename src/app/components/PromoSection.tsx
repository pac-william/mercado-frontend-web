"use client";

import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function PromoSection() {
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

    useEffect(() => {
        if (!carouselApi) return;

        const interval = setInterval(() => {
            carouselApi.scrollNext();
        }, 4000);

        return () => {
            clearInterval(interval);
        };
    }, [carouselApi]);

    return (
        <div className="flex flex-1 container mx-auto">
            <div className="flex flex-grow w-0">
                <Carousel className="w-full" opts={{ align: "start", loop: true }} setApi={setCarouselApi}>
                    <CarouselContent className="flex flex-1">
                        {Array.from({ length: 10 }).map((_, index) => (
                            <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/3 xl:basis-1/4">
                                <div className="relative h-52 w-full overflow-hidden rounded-lg">
                                    <Image src="https://placehold.co/400x250/png?text=1280x720" alt="Promoção" fill className="object-cover" sizes="(min-width: 768px) 320px, 100vw" priority />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <div className="flex justify-end gap-2 mt-4">
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>
            </div>
        </div>
    );
}