import { formatPrice } from "@/app/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

interface ProductItem {
    id: string;
    productId: string;
    quantity: number;
    price: number;
}

interface OrderProductsProps {
    items: ProductItem[];
}

export default function OrderProducts({ items }: OrderProductsProps) {
    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <Package className="w-5 h-5" />
                    Produtos do Pedido
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {items.map((item) => (
                        <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="font-medium text-card-foreground">
                                        Produto ID: {item.productId}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-sm text-muted-foreground">
                                            Quantidade: {item.quantity}
                                        </span>
                                        <span className="text-muted-foreground">•</span>
                                        <span className="text-sm text-muted-foreground">
                                            Preço unit.: {formatPrice(item.price)}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-card-foreground">
                                        {formatPrice(item.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}


