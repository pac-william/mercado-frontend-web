import { formatPrice } from "@/app/utils/formatters";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Receipt } from "lucide-react";

interface OrderSummaryProps {
    total: number;
    discount?: number | null;
    itemsTotal: number;
}

export default function OrderSummary({ total, discount, itemsTotal }: OrderSummaryProps) {
    const subtotal = itemsTotal;
    const discountValue = discount || 0;

    return (
        <Card className="bg-card border-border ">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Receipt className="w-5 h-5" />
                    Resumo do Pedido
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-card-foreground font-medium">
                        {formatPrice(subtotal)}
                    </span>
                </div>

                {discountValue > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="text-green-600 dark:text-green-400">
                            Desconto
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-medium">
                            -{formatPrice(discountValue)}
                        </span>
                    </div>
                )}
            </CardContent>
            <Separator />
            <CardFooter className="pt-4">
                <div className="flex justify-between w-full">
                    <span className="font-semibold text-card-foreground">Total</span>
                    <span className="font-bold text-xl text-card-foreground">
                        {formatPrice(total)}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}


