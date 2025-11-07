'use client';

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { createOrder } from "@/actions/order.actions";
import { AddressDomain } from "@/app/domain/addressDomain";
import { formatPrice } from "@/app/utils/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CartResponse } from "@/dtos/cartDTO";

interface OrderSummaryProps {
    cart: CartResponse;
    addresses: AddressDomain[];
}

const formatDeliveryAddress = (address: AddressDomain) => {
    const complement = address.complement ? ` - ${address.complement}` : "";
    return `${address.street}, ${address.number}${complement} - ${address.neighborhood}, ${address.city} - ${address.state}, ${address.zipCode}`;
};

export default function OrderSummary({ cart, addresses }: OrderSummaryProps) {
    const subtotal = cart.totalValue;
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleCreateOrder = () => {
        if (!cart.items.length) {
            toast.error("Seu carrinho está vazio");
            return;
        }

        const address = addresses.find((item) => item.isFavorite) ?? addresses.at(0);

        if (!address) {
            toast.error("Cadastre ou selecione um endereço de entrega");
            return;
        }

        const marketId = cart.items[0]?.product.marketId;

        if (!marketId) {
            toast.error("Não foi possível identificar o mercado do pedido");
            return;
        }

        startTransition(async () => {
            try {
                await createOrder({
                    userId: cart.userId,
                    marketId,
                    deliveryAddress: formatDeliveryAddress(address),
                    items: cart.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                });

                toast.success("Pedido realizado com sucesso");
                router.push("/my/history");
                router.refresh();
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Erro ao finalizar pedido";
                toast.error(message);
            }
        });
    };

    return (
        <Card className="flex flex-col flex-1 bg-card border-border">
            <CardHeader>
                <CardTitle className="text-card-foreground">Resumo do Pedido</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-1 flex-col p-4">
                <ScrollArea className="flex flex-grow flex-col h-0 overflow-y-auto pr-4">
                    <div className="flex flex-col gap-3">
                        {cart.items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-card-foreground line-clamp-2">
                                        {item.product.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.quantity}x {formatPrice(item.product.price)}
                                    </p>
                                </div>
                                <span className="text-sm font-medium text-card-foreground">
                                    {formatPrice(item.product.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <Separator />
            <CardFooter className="flex flex-col gap-2 p-4">
                <div className="flex justify-between w-full text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-card-foreground">{formatPrice(subtotal)}</span>
                </div>

                <Separator />

                <div className="flex justify-between w-full">
                    <span className="font-semibold text-card-foreground">Total</span>
                    <span className="font-bold text-lg text-card-foreground">
                        {formatPrice(cart.totalValue)}
                    </span>
                </div>
                <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCreateOrder}
                    disabled={isPending || !cart.items.length || !addresses.length}
                >
                    {isPending ? "Finalizando..." : "Finalizar pedido"}
                </Button>
            </CardFooter>
        </Card>
    );
}


