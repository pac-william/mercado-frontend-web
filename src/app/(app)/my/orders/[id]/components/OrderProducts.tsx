import Image from "next/image";

import { getProductsById } from "@/actions/products.actions";
import { Product } from "@/app/domain/productDomain";
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

const placeholderImage = "https://placehold.co/80x80?text=Produto";

const isValidUrl = (value?: string | null) => {
    if (!value) {
        return false;
    }
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

const getImageSrc = (image?: string | null) => {
    return isValidUrl(image) ? image! : placeholderImage;
};

export default async function OrderProducts({ items }: OrderProductsProps) {
    const uniqueProductIds = Array.from(new Set(items.map((item) => item.productId)));
    const productMap = new Map<string, Product | null>();

    await Promise.all(
        uniqueProductIds.map(async (productId) => {
            try {
                const product = await getProductsById(productId);
                productMap.set(productId, product);
            } catch (error) {
                console.error("Erro ao buscar produto do pedido:", error);
                productMap.set(productId, null);
            }
        })
    );

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
                    {items.map((item) => {
                        const product = productMap.get(item.productId) ?? null;
                        const productName = product?.name ?? "Produto não encontrado";
                        const imageSrc = getImageSrc(product?.image);

                        return (
                            <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                                            <Image
                                                src={imageSrc}
                                                alt={productName}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-card-foreground">{productName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                ID: {item.productId}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <span>Quantidade: {item.quantity}</span>
                                                <span>•</span>
                                                <span>Preço unit.: {formatPrice(item.price)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-card-foreground">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}


