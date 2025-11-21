'use client'

import { Package } from "lucide-react";
import { useMemo, useState } from "react";

import OrderCard from "./OrderCard";
import StatusFilters from "./StatusFilters";

type FilterStatus =
    | "ALL"
    | "PENDING"
    | "CONFIRMED"
    | "PREPARING"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";

interface OrderItem {
    id: string;
    status: FilterStatus | string;
    total: number;
    deliveryAddress: string;
    createdAt?: string | Date;
    marketId?: string;
}

interface MarketInfo {
    name?: string;
    address?: string;
    profilePicture?: string | null;
}

interface OrdersContentProps {
    orders: OrderItem[];
    marketInfos?: Record<string, MarketInfo>;
}

const emptyCounts: Record<FilterStatus, number> = {
    ALL: 0,
    PENDING: 0,
    CONFIRMED: 0,
    PREPARING: 0,
    OUT_FOR_DELIVERY: 0,
    DELIVERED: 0,
    CANCELLED: 0,
};

const MARKET_PLACEHOLDER = "https://placehold.co/64x64?text=Logo";

const isValidUrl = (value?: string | null) => {
    if (!value) {
        return false;
    }
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

export default function OrdersContent({ orders, marketInfos }: OrdersContentProps) {
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");

    const counts = useMemo(() => {
        const initial = { ...emptyCounts };

        orders.forEach((order) => {
            initial.ALL += 1;
            const status = order.status as FilterStatus;
            if (status in initial) {
                initial[status] += 1;
            }
        });

        return initial;
    }, [orders]);

    const filteredOrders = useMemo(() => {
        if (activeFilter === "ALL") {
            return orders;
        }

        return orders.filter((order) => order.status === activeFilter);
    }, [activeFilter, orders]);

    const hasOrders = filteredOrders.length > 0;

    return (
        <div className="flex flex-col gap-6">
            <StatusFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
                counts={counts}
            />

            {hasOrders ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredOrders.map((order) => {
                        const info = order.marketId ? marketInfos?.[order.marketId] : undefined;
                        const imageSrc =
                            info?.profilePicture && isValidUrl(info.profilePicture)
                                ? info.profilePicture
                                : MARKET_PLACEHOLDER;

                        return (
                            <OrderCard
                                key={order.id}
                                id={order.id}
                                status={order.status}
                                total={order.total}
                                deliveryAddress={order.deliveryAddress}
                                createdAt={order.createdAt ? new Date(order.createdAt) : undefined}
                                marketId={order.marketId}
                                marketName={info?.name}
                                marketAddress={info?.address}
                                marketPicture={imageSrc}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="p-6 bg-muted rounded-full">
                        <Package className="w-12 h-12 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {activeFilter === "ALL"
                                ? "Nenhum pedido encontrado"
                                : `Nenhum pedido ${activeFilter.toLowerCase()}`}
                        </h3>
                        <p className="text-muted-foreground">
                            {activeFilter === "ALL"
                                ? "Faça seu primeiro pedido para começar"
                                : "Tente selecionar outro filtro"}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

