'use client';

import { Button } from "@/components/ui/button";

type FilterStatus = "ALL" | "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

interface StatusFiltersProps {
    activeFilter: FilterStatus;
    onFilterChange: (filter: FilterStatus) => void;
    counts?: Record<string, number>;
}

const filters: { value: FilterStatus; label: string }[] = [
    { value: "ALL", label: "Todos" },
    { value: "PENDING", label: "Pendente" },
    { value: "CONFIRMED", label: "Confirmado" },
    { value: "PREPARING", label: "Preparando" },
    { value: "OUT_FOR_DELIVERY", label: "Em entrega" },
    { value: "DELIVERED", label: "Entregue" },
    { value: "CANCELLED", label: "Cancelado" }
];

export default function StatusFilters({ activeFilter, onFilterChange, counts }: StatusFiltersProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {filters.map((filter) => {
                const count = counts?.[filter.value] || 0;
                const isActive = activeFilter === filter.value;
                
                return (
                    <Button
                        key={filter.value}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        onClick={() => onFilterChange(filter.value)}
                        className="gap-2"
                    >
                        {filter.label}
                        {count > 0 && (
                            <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                                isActive 
                                    ? "bg-primary-foreground text-primary" 
                                    : "bg-muted text-muted-foreground"
                            }`}>
                                {count}
                            </span>
                        )}
                    </Button>
                );
            })}
        </div>
    );
}

