"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function MarketFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [freeDelivery, setFreeDelivery] = useState(searchParams.get("freeDelivery") === "true");
    const [partnerDelivery, setPartnerDelivery] = useState(searchParams.get("partnerDelivery") === "true");

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/market?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push("/market");
        setFreeDelivery(false);
        setPartnerDelivery(false);
    };

    const toggleFilter = (key: string, value: boolean, setter: (value: boolean) => void) => {
        setter(value);
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, "true");
        } else {
            params.delete(key);
        }
        router.push(`/market?${params.toString()}`);
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-9 rounded-full bg-muted/50 hover:bg-muted text-foreground border-border"
                    >
                        Ordenar
                        <ChevronDown size={16} className="ml-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => updateFilter("sort", "rating")}>
                        Melhor avaliação
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("sort", "distance")}>
                        Mais próximo
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("sort", "deliveryTime")}>
                        Menor tempo de entrega
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("sort", "name")}>
                        Nome A-Z
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant={freeDelivery ? "default" : "outline"}
                className={`h-9 rounded-full ${freeDelivery
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted text-foreground border-border"
                    }`}
                onClick={() => toggleFilter("freeDelivery", !freeDelivery, setFreeDelivery)}
            >
                Entrega Grátis
            </Button>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-9 rounded-full bg-muted/50 hover:bg-muted text-foreground border-border"
                    >
                        Vale-refeição
                        <ChevronDown size={16} className="ml-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => updateFilter("mealVoucher", "all")}>
                        Todos
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("mealVoucher", "accepted")}>
                        Aceita vale-refeição
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("mealVoucher", "notAccepted")}>
                        Não aceita
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-9 rounded-full bg-muted/50 hover:bg-muted text-foreground border-border"
                    >
                        Distância
                        <ChevronDown size={16} className="ml-1" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => updateFilter("distance", "1")}>
                        Até 1 km
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("distance", "3")}>
                        Até 3 km
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("distance", "5")}>
                        Até 5 km
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("distance", "10")}>
                        Até 10 km
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Button
                variant={partnerDelivery ? "default" : "outline"}
                className={`h-9 rounded-full ${partnerDelivery
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/50 hover:bg-muted text-foreground border-border"
                    }`}
                onClick={() => toggleFilter("partnerDelivery", !partnerDelivery, setPartnerDelivery)}
            >
                Entrega Parceira
            </Button>

            <Button
                variant="outline"
                className="h-9 rounded-full bg-muted/50 hover:bg-muted text-foreground border-border"
            >
                <Filter size={16} className="mr-1" />
                Filtros <ListFilter size={16} />
            </Button>

            <Button
                variant="outline"
                className="h-9 rounded-full bg-muted/50 hover:bg-muted text-foreground border-border"
                onClick={clearFilters}
            >
                Limpar
            </Button>
        </div>
    );
}

