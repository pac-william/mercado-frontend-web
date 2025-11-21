import { getMarketById } from "@/actions/market.actions";
import { getOrders } from "@/actions/order.actions";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import OrdersContent from "./components/OrdersContent";

export const dynamic = "force-dynamic";

export default async function MyOrdersPage() {

    const ordersResponse = await getOrders();
    const orders = ordersResponse?.orders ?? [];
    const uniqueMarketIds = Array.from(new Set(orders.map((order) => order.marketId).filter(Boolean)));
    const marketInfos: Record<string, { name?: string; address?: string; profilePicture?: string | null }> = {};

    await Promise.all(
        uniqueMarketIds.map(async (marketId) => {
            try {
                const market = await getMarketById(marketId);
                marketInfos[marketId] = {
                    name: market?.name,
                    address: market?.address,
                    profilePicture: market?.profilePicture,
                };
            } catch (error) {
                console.error("Erro ao buscar mercado:", error);
                marketInfos[marketId] = {};
            }
        })
    );


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

                    <OrdersContent orders={orders} marketInfos={marketInfos} />
                </div>
            </ScrollArea>
        </div>
    );
}

