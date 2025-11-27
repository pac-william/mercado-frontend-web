import { getMarketById } from "@/actions/market.actions";
import { auth0 } from "@/lib/auth0";
import { User as Auth0User } from "@auth0/nextjs-auth0/types";
import { Product } from "../domain/productDomain";
import ProductCardClient from "./ProductCardClient";

interface ProductCardProps {
    product: Product;
    variant?: "quantity-select" | "buy-now" | "owner" | "history" | "suggestion";
    badgeText?: string;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
    initialQuantity?: number;
    onQuantityChange?: (productId: string, quantity: number) => void;
}

export default async function ProductCard({
    product,
    variant = "buy-now",
    badgeText,
    badgeVariant = "secondary",
    initialQuantity,
    onQuantityChange
}: ProductCardProps) {
    const session = await auth0.getSession();
    
    const market = await getMarketById(product.marketId);

    return (
        <ProductCardClient 
            product={product} 
            market={market ?? null} 
            user={session?.user as Auth0User | undefined}
            variant={variant}
            badgeText={badgeText}
            badgeVariant={badgeVariant}
            initialQuantity={initialQuantity}
            onQuantityChange={onQuantityChange}
        />
    );
}
