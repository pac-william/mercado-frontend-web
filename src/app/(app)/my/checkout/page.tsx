import { getAddresses } from "@/actions/address.actions";
import { getCart } from "@/actions/cart.actions";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import DeliveryForm from "./components/DeliveryForm";
import OrderSummary from "./components/OrderSummary";
import PaymentMethod from "./components/PaymentMethod";

export default async function CheckoutPage() {

    const { addresses } = await getAddresses();
    const items = await getCart();

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-4 container mx-auto my-4">
                    <RouterBack />
                    <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>

                    <div className="flex flex-1 flex-row gap-4">
                        <div className="flex flex-1 flex-col gap-4">

                            <PaymentMethod />

                            <DeliveryForm addresses={addresses} />

                        </div>

                        <div className="w-[380px] h-[calc(100vh-100px)] sticky top-4">
                            <div className="flex flex-col gap-4 h-full">
                                <OrderSummary cart={items} addresses={addresses} />
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>

    );
}