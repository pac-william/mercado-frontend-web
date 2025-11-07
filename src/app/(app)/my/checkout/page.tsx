import { getAddresses } from "@/actions/address.actions";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";

export async function CheckoutPage() {

    const { addresses } = await getAddresses();

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-4 container mx-auto my-4">
                    <RouterBack />
                    <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>

                    <div className="flex flex-1 flex-row gap-4">
                        <div className="flex flex-1 flex-col gap-4">
                            {/* <CouponInput />

                            <PaymentMethod />

                            <DeliveryForm /> */}
                        </div>

                        <div className="w-[380px] h-[calc(100vh-100px)] sticky top-4">
                            <div className="flex flex-col gap-4 h-full">
                                {/* <OrderSummary /> */}
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>

    );
}


