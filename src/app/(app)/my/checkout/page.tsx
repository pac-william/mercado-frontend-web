import { getAddresses } from "@/actions/address.actions";
import { getCart } from "@/actions/cart.actions";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import CheckoutContent from "./components/CheckoutContent";
import { CartResponse } from "@/dtos/cartDTO";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
    searchParams?: {
        marketId?: string;
    };
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
    const { addresses } = await getAddresses();
    const carts = await getCart();
    const selectedMarketId = searchParams?.marketId;

    const cart = Array.isArray(carts)
        ? carts.find((item) => (selectedMarketId ? item.marketId === selectedMarketId : true)) ?? carts[0]
        : carts;

    if (!cart || !cart.items?.length) {
        return (
            <div className="flex flex-col flex-1">
                <ScrollArea className="flex flex-col flex-grow h-0">
                    <div className="flex flex-1 flex-col gap-4 container mx-auto my-4">
                        <RouterBack />
                        <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>
                        <p className="text-muted-foreground">Nenhum carrinho válido foi encontrado para finalizar.</p>
                    </div>
                </ScrollArea>
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-4 container mx-auto my-4">
                    <RouterBack />
                    <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>

                    <CheckoutContent addresses={addresses} cart={cart as CartResponse} />
                </div>
            </ScrollArea>
        </div>
    );
}