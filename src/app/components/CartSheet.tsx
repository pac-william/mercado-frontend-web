"use client"

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { useState } from "react";

export default function CartSheet() {
    const [isOpen, setIsOpen] = useState(false);

    const handleCloseSheet = () => {
        setIsOpen(false);
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen} defaultOpen={false}>
            <SheetTrigger asChild>
                <Button variant="link" size="sm" className="relative">
                    Carrinho
                </Button>
            </SheetTrigger>
            <SheetContent className="gap-0 bg-background border-border" side="right">
                <SheetHeader>
                    <SheetTitle className="text-foreground">Carrinho</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                        Aqui você pode ver os produtos que você adicionou ao carrinho.
                    </SheetDescription>
                </SheetHeader>
                <Separator />
                <div className="flex flex-row gap-4 p-4 justify-center">
                    <Button variant="link" size="sm" asChild onClick={() => handleCloseSheet()}>
                        <Link href="/my/cart">
                            Ir para carrinho
                        </Link>
                    </Button>
                </div>
                <div className="flex flex-col flex-1 gap-4 p-4">
                    <h1 className="text-lg font-bold text-foreground">Itens:</h1>
                </div>
                <Separator />
                <div className="flex flex-row gap-4 p-4 justify-between">
                    <h1 className="text-lg font-bold text-foreground">Total:</h1>
                    <p className="text-lg font-bold text-foreground">R$ 100,00</p>
                </div>
            </SheetContent>
        </Sheet>
    )
}