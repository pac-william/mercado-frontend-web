'use client';

import { updateCartItemQuantity } from "@/actions/cart.actions";
import ProductCardClient from "@/app/components/ProductCardClient";
import { Market } from "@/app/domain/marketDomain";
import { formatPrice } from "@/app/utils/formatters";
import RouterBack from "@/components/RouterBack";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemResponseDTO, CartResponse } from "@/dtos/cartDTO";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type CartContentProps = {
    initialCarts: CartResponse[];
    markets: Market[];
};

type MarketGroup = {
    marketId: string;
    cartId: string;
    items: CartItemResponseDTO[];
    totalItems: number;
    totalValue: number;
};

export default function CartContent({ initialCarts, markets }: CartContentProps) {
    const [carts, setCarts] = useState<CartResponse[]>(Array.isArray(initialCarts) ? initialCarts : []);
    const [enabledMarkets, setEnabledMarkets] = useState<Record<string, boolean>>({});

    const cartItems = useMemo(() => carts.flatMap((cart) => cart.items), [carts]);

    const marketMap = useMemo<Record<string, Market>>(() => {
        const map: Record<string, Market> = {};
        markets.forEach((market) => {
            map[market.id] = market;
        });
        return map;
    }, [markets]);

    const handleQuantityChange = async (productId: string, quantity: number) => {
        const cartItem = cartItems.find((item) => item.product.id === productId);
        if (!cartItem) return;

        try {
            const updatedCart = await updateCartItemQuantity(cartItem.id, { quantity });
            setCarts((previous) =>
                previous.map((cart) => (cart.id === updatedCart.id ? updatedCart : cart))
            );
            toast.success("Quantidade atualizada");
        } catch (error) {
            console.error("Erro ao atualizar quantidade:", error);
            toast.error("Erro ao atualizar quantidade");
        }
    };

    const marketGroups = useMemo<MarketGroup[]>(() => {
        return carts.map((cart) => ({
            marketId: cart.marketId,
            cartId: cart.id,
            items: cart.items,
            totalItems: cart.totalItems,
            totalValue: cart.totalValue,
        }));
    }, [carts]);
    const defaultOpenMarkets = marketGroups.map((group) => group.marketId);
    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-4 container mx-auto my-4">
                    <RouterBack />
                    <h1 className="text-2xl font-bold text-foreground">Carrinho</h1>
                    <div className="flex flex-1 flex-row gap-4">
                        <div className="flex flex-1 flex-col gap-4">
                            {marketGroups.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <p className="text-lg text-muted-foreground mb-4">Seu carrinho está vazio</p>
                                    <Button asChild>
                                        <Link href="/">Continuar comprando</Link>
                                    </Button>
                                </div>
                            ) : (
                                <Accordion type="multiple" defaultValue={defaultOpenMarkets} className="space-y-4">
                                    {marketGroups?.map((group) => {
                                        const market = marketMap[group.marketId];
                                        const isEnabled = enabledMarkets[group.marketId] ?? true;
                                        return (
                                            <AccordionItem key={group.marketId} value={group.marketId} className="flex-1 border-0">
                                                <Card className="flex flex-1 flex-row items-center p-4 gap-2">
                                                    <div className="flex flex-row items-center gap-3 flex-1">
                                                        <Checkbox
                                                            checked={isEnabled}
                                                            onCheckedChange={(checked) =>
                                                                setEnabledMarkets((previous: Record<string, boolean>) => ({
                                                                    ...previous,
                                                                    [group.marketId]: checked as boolean,
                                                                }))
                                                            }
                                                        />
                                                        <div className="flex flex-row gap-3 flex-1">
                                                            <div className="bg-white rounded-full flex items-center justify-center overflow-hidden">
                                                                {market?.profilePicture ? (
                                                                    <Image
                                                                        unoptimized
                                                                        src={market.profilePicture}
                                                                        alt={market.name ?? `Mercado ${group.marketId}`}
                                                                        width={52}
                                                                        height={52}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                                                                )}
                                                            </div>
                                                            <div className="flex flex-col flex-1">
                                                                <span className="text-xl font-semibold text-foreground">
                                                                    {market?.name ?? `Mercado ${group.marketId}`}
                                                                </span>
                                                                <span className="text-sm text-muted-foreground">
                                                                    {group.totalItems} {group.totalItems === 1 ? "item" : "itens"} · {formatPrice(group.totalValue)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-1 flex-row items-center gap-4">
                                                        <div className="flex flex-1 flex-row items-center justify-end gap-2">
                                                            <div className="flex flex-col gap-2">
                                                                <span className="text-2xl font-bold text-foreground">Total: {formatPrice(group.totalValue)}</span>
                                                            </div>
                                                            <Link
                                                                href={`/my/checkout?marketId=${group.marketId}`}
                                                                aria-disabled={!isEnabled}
                                                                className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${isEnabled
                                                                    ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
                                                                    : "border-border text-muted-foreground pointer-events-none opacity-60"
                                                                    }`}
                                                            >
                                                                Finalizar compra
                                                            </Link>
                                                        </div>

                                                        <Button variant="outline" size="icon" className="rounded-full" asChild>
                                                            <AccordionTrigger />
                                                        </Button>
                                                    </div>
                                                </Card>
                                                <AccordionContent className="space-y-3 px-0 py-4">
                                                    {isEnabled ? (
                                                        <div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                                                                {group.items.map((item) => (
                                                                    <ProductCardClient
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
                                                                        market={market}
                                                                        onQuantityChange={handleQuantityChange}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="rounded-lg border border-dashed border-muted p-4 text-sm text-muted-foreground">
                                                            Lista deste mercado desabilitada. Habilite para editar os itens.
                                                        </div>
                                                    )}
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })}
                                </Accordion>
                            )}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

