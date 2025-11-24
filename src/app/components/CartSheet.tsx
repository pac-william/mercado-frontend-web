"use client"

import { removeCartItem, updateCartItemQuantity } from "@/actions/cart.actions";
import { formatPrice } from "@/app/utils/formatters";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartItemResponseDTO } from "@/dtos/cartDTO";
import { Minus, Plus, ShoppingBasket, ShoppingCart, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface MarketInfo {
    name: string;
    profilePicture?: string | null;
}

interface CartSheetProps {
    cartItems: CartItemResponseDTO[];
    marketInfos?: Record<string, MarketInfo>;
}

export default function CartSheet({ cartItems, marketInfos = {} }: CartSheetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [localItems, setLocalItems] = useState<CartItemResponseDTO[]>(cartItems);
    const router = useRouter();
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<CartItemResponseDTO | null>(null);

    // Atualiza os itens locais quando cartItems mudar (após refresh)
    useEffect(() => {
        setLocalItems(cartItems);
    }, [cartItems]);

    const handleCloseSheet = () => {
        setIsOpen(false);
    }

    const handleQuantityChange = async (itemId: string, newQuantity: number) => {
        const item = localItems.find(i => i.id === itemId);
        if (!item) return;

        // Atualização otimista
        const updatedItems = localItems.map(i =>
            i.id === itemId ? { ...i, quantity: newQuantity } : i
        );
        setLocalItems(updatedItems);

        try {
            if (newQuantity === 0) {
                // Remove o item se quantidade for 0
                await removeCartItem(itemId);
                setLocalItems(prev => prev.filter(i => i.id !== itemId));
                toast.success("Item removido do carrinho");
            } else {
                // Atualiza a quantidade
                await updateCartItemQuantity(itemId, { quantity: newQuantity });
                toast.success("Quantidade atualizada");
            }
            // Atualiza o Header (Server Component)
            router.refresh();
        } catch (error) {
            // Reverte em caso de erro
            setLocalItems(cartItems);
            console.error("Erro ao atualizar quantidade:", error);
            toast.error("Erro ao atualizar quantidade");
        }
    }

    const openRemoveDialog = (item: CartItemResponseDTO) => {
        setItemToRemove(item);
        setIsRemoveDialogOpen(true);
    };

    const closeRemoveDialog = () => {
        setIsRemoveDialogOpen(false);
        setItemToRemove(null);
    };

    const handleRemoveDialogOpenChange = (open: boolean) => {
        if (!open) {
            closeRemoveDialog();
        }
    };

    const confirmRemoveItem = async () => {
        if (!itemToRemove) return;
        try {
            await handleQuantityChange(itemToRemove.id, 0);
        } finally {
            closeRemoveDialog();
        }
    };

    const totalValue = localItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);

    const totalItems = localItems.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    const marketGroups = useMemo(() => {
        const groups: Record<string, {
            marketId: string;
            items: CartItemResponseDTO[];
            totalItems: number;
            totalValue: number;
        }> = {};

        localItems.forEach((item) => {
            const { marketId } = item.product;

            if (!groups[marketId]) {
                groups[marketId] = {
                    marketId,
                    items: [],
                    totalItems: 0,
                    totalValue: 0,
                };
            }

            groups[marketId].items.push(item);
            groups[marketId].totalItems += item.quantity;
            groups[marketId].totalValue += item.product.price * item.quantity;
        });

        return Object.values(groups);
    }, [localItems]);

    const defaultOpenMarket = marketGroups.length > 0 ? [marketGroups[0].marketId] : undefined;

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen} defaultOpen={false}>
            <SheetTrigger asChild>
                <Button
                    variant="default"
                    className="relative flex items-center gap-3 bg-primary px-5 py-1 h-auto text-primary-foreground hover:bg-primary/90"
                >
                    <ShoppingBasket className="size-5" />
                    <div className="flex flex-col text-left leading-tight">
                        <span className="text-sm font-semibold">{formatPrice(totalValue)}</span>
                        {totalItems > 0 ? (
                            <span className="text-xs text-primary-foreground/80">
                                {totalItems} {totalItems === 1 ? "item" : "itens"}
                            </span>
                        ) : (
                            <span className="text-xs text-primary-foreground/80">Seu carrinho</span>
                        )}
                    </div>
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-1 flex-col gap-0 bg-background border-border" side="right">
                <SheetHeader>
                    <SheetTitle className="text-foreground">Carrinho</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        {localItems.length > 0
                            ? `${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`
                            : "Seu carrinho está vazio"
                        }
                    </SheetDescription>
                </SheetHeader>
                <Separator />

                {localItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 flex-1">
                        <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
                        <Button variant="default" asChild onClick={handleCloseSheet}>
                            <Link href="/">Continuar comprando</Link>
                        </Button>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex flex-col flex-grow h-0 overflow-y-auto p-4">
                            <div className="space-y-3">
                                <Accordion type="multiple" defaultValue={defaultOpenMarket} className="space-y-3">
                                    {marketGroups.map((group) => (
                                        <AccordionItem key={group.marketId} value={group.marketId} className="border-0">
                                            <AccordionTrigger className="px-4 py-3 text-sm font-semibold text-foreground bg-muted/40 border rounded-lg ">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center overflow-hidden">
                                                        {marketInfos[group.marketId]?.profilePicture ? (
                                                            <Image
                                                                unoptimized
                                                                src={marketInfos[group.marketId]?.profilePicture as string}
                                                                alt={marketInfos[group.marketId]?.name ?? `Mercado ${group.marketId}`}
                                                                width={40}
                                                                height={40}
                                                                className="w-full h-full object-cover rounded-full"
                                                            />
                                                        ) : (
                                                            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col leading-tight flex-1">
                                                        <span className="text-sm font-semibold text-foreground">{marketInfos[group.marketId]?.name ?? `Mercado ${group.marketId}`}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {group.totalItems} {group.totalItems === 1 ? "item" : "itens"} · {formatPrice(group.totalValue)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="space-y-3 px-0 pt-2 pb-3">
                                                {group.items.map((item) => (
                                                    <div key={item.id} className="flex flex-1 justify-between items-start gap-4 p-3 rounded-lg bg-muted/50 border">
                                                        <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center">
                                                            {item.product.image ? (
                                                                <Image
                                                                    unoptimized
                                                                    src={item.product.image}
                                                                    alt={item.product.name}
                                                                    width={64}
                                                                    height={64}
                                                                    className="w-full h-full object-cover rounded-md"
                                                                />
                                                            ) : (
                                                                <ShoppingCart className="w-6 h-6 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col flex-1 gap-2">
                                                            <p className="text-sm font-medium text-foreground line-clamp-1">{item.product.name}</p>
                                                            <p className="text-sm font-bold text-foreground">
                                                                {formatPrice(item.product.price * item.quantity)}
                                                            </p>
                                                            <div className="flex items-center gap-2">
                                                                {item.quantity > 1 ? (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="icon"
                                                                        className="h-7 w-7"
                                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                                    >
                                                                        <Minus size={12} />
                                                                    </Button>
                                                                ) : (
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="h-7 w-7"
                                                                        onClick={() => openRemoveDialog(item)}
                                                                    >
                                                                        <Trash size={12} />
                                                                    </Button>
                                                                )}
                                                                <span className="text-sm font-medium text-foreground min-w-[2rem] text-center">
                                                                    {item.quantity}
                                                                </span>
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="h-7 w-7"
                                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                                >
                                                                    <Plus size={12} />
                                                                </Button>
                                                                <span className="text-xs text-muted-foreground ml-1">{item.product.unit}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </ScrollArea>

                        <Separator />

                        <div className="flex flex-col gap-3 p-4">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Subtotal</span>
                                <span className="text-sm font-medium text-foreground">{formatPrice(totalValue)}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between">
                                <span className="text-base font-bold text-foreground">Total</span>
                                <span className="text-base font-bold text-foreground">{formatPrice(totalValue)}</span>
                            </div>
                            <Button asChild onClick={handleCloseSheet} className="w-full">
                                <Link href="/my/cart">
                                    Ver carrinho completo
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
            <AlertDialog open={isRemoveDialogOpen} onOpenChange={handleRemoveDialogOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remover item do carrinho</AlertDialogTitle>
                        <AlertDialogDescription>
                            {itemToRemove
                                ? `Tem certeza que deseja remover ${itemToRemove.product.name} do carrinho?`
                                : "Tem certeza que deseja remover este item do carrinho?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRemoveItem}>Remover</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Sheet >
    )
}