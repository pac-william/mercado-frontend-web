"use client"

import { formatPrice } from "@/app/utils/formatters";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CartItemResponseDTO } from "@/dtos/cartDTO";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CartSheetProps {
    cartItems: CartItemResponseDTO[];
}

export default function CartSheet({ cartItems }: CartSheetProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleCloseSheet = () => {
        setIsOpen(false);
    }

    const totalValue = cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);

    const totalItems = cartItems.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen} defaultOpen={false}>
            <SheetTrigger asChild>
                <Button variant="link" size="sm" className="relative">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                    Carrinho
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-1 flex-col gap-0 bg-background border-border" side="right">
                <SheetHeader>
                    <SheetTitle className="text-foreground">Carrinho</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        {cartItems.length > 0
                            ? `${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`
                            : "Seu carrinho está vazio"
                        }
                    </SheetDescription>
                </SheetHeader>
                <Separator />

                {cartItems.length === 0 ? (
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
                            <div className="flex flex-col gap-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex flex-1 justify-between items-start gap-4 p-3 rounded-lg bg-muted/50 border">
                                        <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center">
                                            {item.product.image ? (
                                                <Image
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
                                        <div className="flex flex-col flex-1">
                                            <p className="text-sm font-medium text-foreground  line-clamp-1">{item.product.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.quantity}x {item.product.unit}</p>
                                            <p className="text-sm font-bold text-foreground mt-1">
                                                {formatPrice(item.product.price * item.quantity)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
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
        </Sheet>
    )
}