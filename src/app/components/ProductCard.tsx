import { getMarketById } from "@/actions/market.actions";
import { auth0 } from "@/lib/auth0";
import { User as Auth0User } from "@auth0/nextjs-auth0/types";
import { Market } from "../domain/marketDomain";
import { Product } from "../domain/productDomain";
import ProductCardClient from "./ProductCardClient";

interface ProductCardProps {
    product: Product;
    market?: Market | null;
    variant?: "quantity-select" | "buy-now" | "owner" | "history" | "suggestion";
    badgeText?: string;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
    initialQuantity?: number;
    onQuantityChange?: (productId: string, quantity: number) => void;
}

export default async function ProductCard({
    product,
    market,
    variant = "buy-now",
    badgeText,
    badgeVariant = "secondary",
    initialQuantity,
    onQuantityChange
}: ProductCardProps) {
    const session = await auth0.getSession();
    
    // Try to get market, but handle errors gracefully
    let resolvedMarket: Market | null = market ?? null;

    if (!resolvedMarket) {
        try {
            resolvedMarket = await getMarketById(product.marketId);
        } catch (error) {
            console.error(`Error fetching market ${product.marketId}:`, error);
        }
    }

    if (!resolvedMarket) {
        resolvedMarket = new Market(
            product.marketId,
            "Market",
            "",
            "",
            ""
        );
    }

    // Convert classes to plain objects for Client Component
    const productPlain = {
        id: product.id,
        name: product.name,
        price: product.price,
        unit: product.unit,
        marketId: product.marketId,
        image: product.image,
        categoryId: product.categoryId,
        sku: product.sku,
        category: null,
    };

    const marketPlain = resolvedMarket ? {
        id: resolvedMarket.id,
        name: resolvedMarket.name,
        address: resolvedMarket.address,
        profilePicture: resolvedMarket.profilePicture,
        bannerImage: resolvedMarket.bannerImage,
        rating: resolvedMarket.rating,
        ratingCount: resolvedMarket.ratingCount,
        addressId: resolvedMarket.addressId,
        addressData: resolvedMarket.addressData,
    } : null;

    return (
        <ProductCardClient 
            product={productPlain} 
            market={marketPlain} 
            user={session?.user as Auth0User | undefined}
            variant={variant}
            badgeText={badgeText}
            badgeVariant={badgeVariant}
            initialQuantity={initialQuantity}
            onQuantityChange={onQuantityChange}
        />
    );
}
