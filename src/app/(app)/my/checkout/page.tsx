import { getAddresses } from "@/actions/address.actions";
import { getCart } from "@/actions/cart.actions";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import CheckoutContent from "./components/CheckoutContent";

export default async function CheckoutPage() {

    const { addresses } = await getAddresses();
    const items = await getCart();

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-4 container mx-auto my-4">
                    <RouterBack />
                    <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>

                    <CheckoutContent addresses={addresses} cart={items} />
                </div>
            </ScrollArea>
        </div>

    );
}