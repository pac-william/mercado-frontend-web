import { getOrders } from "@/actions/order.actions";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrdersContent from "./components/OrdersContent";

export default async function MyOrdersPage() {

    const ordersResponse = await getOrders();
    const orders = ordersResponse?.orders ?? [];


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

                    <OrdersContent orders={orders} />
                </div>
            </ScrollArea>
        </div>
    );
}

