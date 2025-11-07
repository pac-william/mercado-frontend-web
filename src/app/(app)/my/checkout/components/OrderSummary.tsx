'use client';

import { formatPrice } from "@/app/utils/formatters";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

interface OrderSummaryProps {
    items: OrderItem[];
    discount?: number;
    couponCode?: string;
}

export default function OrderSummary({ items, discount = 0, couponCode }: OrderSummaryProps) {
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal - discount;

    return (
        <Card className="flex flex-col flex-1 bg-card border-border">
            <CardHeader>
                <CardTitle className="text-card-foreground">Resumo do Pedido</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-1 flex-col p-4">
                <ScrollArea className="flex flex-grow flex-col h-0 overflow-y-auto pr-4">
                    <div className="flex flex-col gap-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between items-start gap-2">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-card-foreground line-clamp-2">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {item.quantity}x {formatPrice(item.price)}
                                    </p>
                                </div>
                                <span className="text-sm font-medium text-card-foreground">
                                    {formatPrice(item.price * item.quantity)}
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

                {discount > 0 && couponCode && (
                    <div className="flex justify-between w-full text-sm">
                        <span className="text-green-600">
                            Desconto ({couponCode})
                        </span>
                        <span className="text-green-600 font-medium">
                            -{formatPrice(discount)}
                        </span>
                    </div>
                )}

                <Separator />

                <div className="flex justify-between w-full">
                    <span className="font-semibold text-card-foreground">Total</span>
                    <span className="font-bold text-lg text-card-foreground">
                        {formatPrice(total)}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}


