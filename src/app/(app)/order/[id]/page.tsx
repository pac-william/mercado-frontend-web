'use client';

import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays } from "lucide-react";
import DeliveryInfo from "./components/DeliveryInfo";
import OrderProducts from "./components/OrderProducts";
import OrderSummary from "./components/OrderSummary";
import OrderTimeline from "./components/OrderTimeline";

export default function OrderDetailsPage() {



    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-6 container mx-auto my-4 pb-8">
                    <RouterBack />

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Pedido #
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                <p className="text-muted-foreground">Data não disponível</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <OrderTimeline currentStatus="pending" />
                            <OrderProducts items={[]} />
                            <DeliveryInfo
                                address="Endereço não disponível"
                                delivererId="delivererId não disponível"
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <OrderSummary
                                total={0}
                                discount={0}
                                itemsTotal={0}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}


