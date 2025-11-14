import { getMarketById } from "@/actions/market.actions";
import { auth0 } from "@/lib/auth0";
import { User as Auth0User } from "@auth0/nextjs-auth0/types";
import { Market } from "../domain/marketDomain";
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
    
    // Try to get market, but handle errors gracefully
    let market: Market | null = null;
    try {
        market = await getMarketById(product.marketId);
    } catch (error) {
        console.error(`Error fetching market ${product.marketId}:`, error);
        // Create a fallback market object
        market = new Market(
            product.marketId,
            "Market",
            "",
            "",
            ""
        );
    }

    return (
        <ProductCardClient 
            product={product} 
            market={market} 
            user={session?.user as Auth0User | undefined}
            variant={variant}
            badgeText={badgeText}
            badgeVariant={badgeVariant}
            initialQuantity={initialQuantity}
            onQuantityChange={onQuantityChange}
        />
    );
}
