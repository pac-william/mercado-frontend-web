"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { History, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const handleCloseSheet = () => {
        setIsOpen(false);
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="flex w-full justify-between items-center p-4 bg-white border-b border-gray-200">
            <div className="flex flex-row gap-4 container mx-auto">
                <h1 className="text-2xl font-bold text-black items-center flex">
                    <Link href="/">
                        Smart Market
                    </Link>
                </h1>
                <div className="ml-auto flex flex-row gap-2">
                    <Sheet open={isOpen} onOpenChange={setIsOpen} defaultOpen={false}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon_lg" className="relative">
                                <ShoppingCart size={24} />
                                <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center">19</Badge>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="gap-0" side="right">
                            <SheetHeader>
                                <SheetTitle>Carrinho</SheetTitle>
                                <SheetDescription>
                                    Aqui você pode ver os produtos que você adicionou ao carrinho.
                                </SheetDescription>
                            </SheetHeader>
                            <Separator />
                            <div className="flex flex-row gap-4 p-4 justify-center">
                                <Button variant="link" size="sm" asChild onClick={() => handleCloseSheet()}>
                                    <Link href="/cart">
                                        Ir para carrinho
                                    </Link>
                                </Button>
                            </div>
                            <div className="flex flex-col flex-1 gap-4 p-4">
                                <h1 className="text-lg font-bold">Itens:</h1>
                            </div>
                            <Separator />
                            <div className="flex flex-row gap-4 p-4 justify-between">
                                <h1 className="text-lg font-bold">Total:</h1>
                                <p className="text-lg font-bold">R$ 100,00</p>
                            </div>
                        </SheetContent>
                    </Sheet>

                    <Button variant="outline" size="icon_lg" asChild>
                        <Link href="/history">
                            <History size={24} />
                        </Link>
                    </Button>
                    <Button variant="outline" size="icon_lg" asChild>
                        <Link href="/profile">
                            <User size={24} />
                        </Link>
                    </Button>
                </div>
            </div>
        </header>
    )
}