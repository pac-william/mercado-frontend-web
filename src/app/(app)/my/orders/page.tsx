'use client';

import { Order } from "@/app/domain/orderDomain";
import LoadingSpinner from "@/components/LoadingSpinner";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Package } from "lucide-react";
import { useState } from "react";
import OrderCard from "./components/OrderCard";
import StatusFilters from "./components/StatusFilters";

type FilterStatus = "ALL" | "PENDING" | "CONFIRMED" | "PREPARING" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";

export default function MyOrdersPage() {
    const [orders] = useState<Order[]>([]);
    const [loading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<FilterStatus>("ALL");


    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-6 container mx-auto my-4 pb-8">
                    <RouterBack />
                    
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-foreground">Meus Pedidos</h1>
                        <p className="text-muted-foreground">
                            Acompanhe o status dos seus pedidos
                        </p>
                    </div>

                    <StatusFilters 
                        activeFilter={activeFilter}
                        onFilterChange={setActiveFilter}
                        counts={{ ALL: 0 }}
                    />

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <LoadingSpinner size="lg" />
                            <p className="text-muted-foreground">Carregando pedidos...</p>
                        </div>
                    ) : orders.length === 0 ? (
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
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {orders.map((order) => (
                                <OrderCard
                                    key={order.id}
                                    id={order.id}
                                    status={order.status}
                                    total={order.total}
                                    deliveryAddress={order.deliveryAddress}
                                    createdAt={order.createdAt}
                                    marketId={order.marketId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

