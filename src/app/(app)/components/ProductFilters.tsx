"use client";

import PriceSlider from "@/components/price-slider";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Filter, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [openPriceDialog, setOpenPriceDialog] = useState(false);

    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push("/");
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
                    <DropdownMenuItem onClick={() => updateFilter("sort", "priceAsc")}>
                        Menor preço
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("sort", "priceDesc")}>
                        Maior preço
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("sort", "name")}>
                        Nome A-Z
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => updateFilter("sort", "nameDesc")}>
                        Nome Z-A
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={openPriceDialog} onOpenChange={setOpenPriceDialog}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className="h-9 rounded-full bg-muted/50 hover:bg-muted text-foreground border-border"
                    >
                        Preço
                        <ChevronDown size={16} className="ml-1" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Filtrar por Preço</DialogTitle>
                    </DialogHeader>
                    <PriceSlider />
                </DialogContent>
            </Dialog>

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

