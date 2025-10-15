'use client';

import { getOrderById } from "@/actions/order.actions";
import { OrderResponseDTO } from "@/dtos/orderDTO";
import { useAuth } from "@/providers/auth-provider";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusBadge from "../../my-orders/components/StatusBadge";
import { CalendarDays } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import DeliveryInfo from "./components/DeliveryInfo";
import OrderProducts from "./components/OrderProducts";
import OrderSummary from "./components/OrderSummary";
import OrderTimeline from "./components/OrderTimeline";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [order, setOrder] = useState<OrderResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);

    const orderId = params.id as string;

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Você precisa estar logado para ver este pedido");
            router.push("/login?next=/order/" + orderId);
            return;
        }

        loadOrder();
    }, [isAuthenticated, orderId, router]);

    const loadOrder = async () => {
        setLoading(true);
        try {
            const orderData = await getOrderById(orderId);
            setOrder(orderData);
        } catch (error) {
            console.error("Erro ao carregar pedido:", error);
            toast.error("Erro ao carregar pedido");
            router.push("/my-orders");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-muted-foreground">Carregando pedido...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <h1 className="text-2xl font-bold text-foreground">Pedido não encontrado</h1>
                <p className="text-muted-foreground">O pedido que você está procurando não existe</p>
            </div>
        );
    }

    const itemsTotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const formattedDate = order.createdAt 
        ? new Date(order.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : "Data não disponível";

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-6 container mx-auto my-4 pb-8">
                    <RouterBack />
                    
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">
                                Pedido #{order.id.substring(0, 8)}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <CalendarDays className="w-4 h-4 text-muted-foreground" />
                                <p className="text-muted-foreground">{formattedDate}</p>
                            </div>
                        </div>
                        <StatusBadge status={order.status} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <OrderTimeline currentStatus={order.status} />
                            <OrderProducts items={order.items} />
                            <DeliveryInfo 
                                address={order.deliveryAddress} 
                                delivererId={order.delivererId}
                            />
                        </div>
                        
                        <div className="lg:col-span-1">
                            <OrderSummary 
                                total={order.total}
                                discount={order.discount}
                                itemsTotal={itemsTotal}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}


