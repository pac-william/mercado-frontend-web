'use client';

import { getCart as getCartAction, removeCartItem, updateCartItemQuantity } from "@/actions/cart.actions";
import { getMarkets } from "@/actions/market.actions";
import ProductCard from "@/app/components/ProductCard";
import { Market } from "@/app/domain/marketDomain";
import { formatPrice } from "@/app/utils/formatters";
import LoadingSpinner from "@/components/LoadingSpinner";
import RouterBack from "@/components/RouterBack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CartResponse } from "@/dtos/cartDTO";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import MarketsCorousel from "./components/MarketsCorousel";

export default function Cart() {
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);

    const deliveryFee = 10;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [cartData, marketsData] = await Promise.all([
                getCartAction(),
                getMarkets()
            ]);
            setCart(cartData);
            setMarkets(marketsData.markets || []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            toast.error("Erro ao carregar carrinho");
        } finally {
            setLoading(false);
        }
    };

    const cartItems = cart?.items || [];

    const subtotal = cart?.totalValue || 0;
    const total = subtotal + deliveryFee;

    const handleQuantityChange = async (productId: string, quantity: number) => {
        const cartItem = cartItems.find(item => item.product.id === productId);
        if (!cartItem) return;

        try {
            const updatedCart = await updateCartItemQuantity(cartItem.id, { quantity });
            setCart(updatedCart);
            toast.success("Quantidade atualizada");
        } catch (error) {
            console.error("Erro ao atualizar quantidade:", error);
            toast.error("Erro ao atualizar quantidade");
        }
    };

    const handleRemoveItem = async (productId: string) => {
        const cartItem = cartItems.find(item => item.product.id === productId);
        if (!cartItem) return;

        try {
            await removeCartItem(cartItem.id);
            await loadData(); // Reload cart to reflect changes
            toast.success("Item removido do carrinho");
        } catch (error) {
            console.error("Erro ao remover item:", error);
            toast.error("Erro ao remover item");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-4 container mx-auto my-4">
                    <RouterBack />
                    <h1 className="text-2xl font-bold text-foreground">Carrinho</h1>
                    <MarketsCorousel markets={markets} />
                    <div className="flex flex-1 flex-row gap-4">
                        <div className="flex flex-1 flex-col gap-4">
                            {cartItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <p className="text-lg text-muted-foreground mb-4">Seu carrinho está vazio</p>
                                    <Button asChild>
                                        <Link href="/">Continuar comprando</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {cartItems.map((item) => {
                                        return (
                                            <ProductCard
                                                key={item.id}
                                                product={{
                                                    id: item.product.id,
                                                    name: item.product.name,
                                                    price: item.product.price,
                                                    unit: item.product.unit,
                                                    marketId: item.product.marketId,
                                                    image: item.product.image || undefined,
                                                }}
                                                variant="quantity-select"
                                                initialQuantity={item.quantity}
                                                onQuantityChange={handleQuantityChange}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <div className="w-[380px] h-[calc(100vh-100px)] sticky top-4">
                            <div className="flex flex-col gap-4 h-full">
                                <Card className="flex flex-col flex-1 bg-card border-border">
                                    <CardContent className="flex flex-1 flex-col gap-2">
                                        <ScrollArea className="flex flex-col flex-grow h-0 pr-4 gap-2">
                                            <h1 className="text-lg font-bold text-card-foreground">Itens:</h1>
                                            <div className="flex flex-col gap-2">
                                                {cartItems.map((item) => {
                                                    return (
                                                        <div key={item.id} className="flex items-center justify-between gap-2 group">
                                                            <div className="flex gap-4 flex-1 min-w-0">
                                                                <div className="flex gap-2 shrink-0">
                                                                    <span className="text-sm text-card-foreground">{item.quantity}</span>
                                                                    <span className="text-sm text-muted-foreground">{item.product.unit}</span>
                                                                </div>
                                                                <span className="text-sm truncate text-card-foreground flex-1">{item.product.name}</span>
                                                                <span className="text-sm text-card-foreground font-medium shrink-0">{formatPrice(item.product.price * item.quantity)}</span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleRemoveItem(item.product.id)}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-destructive" />
                                                            </Button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </ScrollArea>
                                        <Separator />
                                        <div className="flex flex-col gap-1">
                                            <div className="flex justify-between">
                                                <span className="text-sm text-card-foreground">Frete</span>
                                                <span className="text-sm text-card-foreground">{formatPrice(deliveryFee)}</span>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="text-card-foreground">SubTotal</span>
                                            <span className="font-medium text-card-foreground">{formatPrice(subtotal)}</span>
                                        </div>
                                    </CardContent>
                                    <Separator />
                                    <CardFooter className="flex flex-row justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-muted-foreground">Total</span>
                                            <span className="text-lg font-bold text-card-foreground">{formatPrice(total)}</span>
                                        </div>
                                        <div>
                                            <Button asChild disabled={cartItems.length === 0}>
                                                <Link href="/my/checkout">
                                                    Continuar para o Checkout
                                                </Link>
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea >
        </div >
    )
}   