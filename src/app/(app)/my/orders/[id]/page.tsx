import { getAddressById } from "@/actions/address.actions";
import { getOrderById } from "@/actions/order.actions";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays } from "lucide-react";
import moment from "moment";
import DeliveryInfo from "./components/DeliveryInfo";
import OrderProducts from "./components/OrderProducts";
import OrderSummary from "./components/OrderSummary";
import OrderTimeline from "./components/OrderTimeline";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const order = await getOrderById(id);

    const address = await getAddressById(order.addressId);
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
                                <p className="text-muted-foreground">{moment(order.createdAt).format('DD/MM/YYYY HH:mm')}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <OrderTimeline currentStatus="pending" />
                            <OrderProducts items={order.items} />
                            <DeliveryInfo
                                address={address}
                                delivererId={order.delivererId}
                            />
                        </div>

                        <div className="lg:col-span-1">
                            <OrderSummary
                                total={order.total}
                                discount={order.discount}
                                itemsTotal={order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}


