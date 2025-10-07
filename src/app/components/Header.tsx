"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { isAdmin } from "@/lib/auth";
import { useAuth } from "@/providers/auth-provider";
import { History, Settings, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Header() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const handleCloseSheet = () => {
        setIsOpen(false);
    }

    const handleLogout = async () => {
        try {
            await logout();
            toast.success('Logout realizado com sucesso!');
            router.push('/');
        } catch (error) {
            toast.error('Erro ao fazer logout');
        }
    };

    return (
        <header className="flex w-full justify-between items-center p-4 bg-background border-b border-border">
            <div className="flex flex-row gap-4 container mx-auto">
                <h1 className="text-2xl font-bold text-foreground items-center flex">
                    <Link href="/" className="text-foreground hover:text-primary">
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
                                    <Link href="/cart">
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
                    {isAdmin(user) && (
                        <Button variant="outline" size="icon_lg" asChild>
                            <Link href="/admin">
                                <Settings size={24} />
                            </Link>
                        </Button>
                    )}
                    {/* <Button
                        variant="outline"
                        size="icon_lg"
                        onClick={handleLogout}
                        disabled={loading}
                        title="Logout"
                    >
                        <LogOut size={24} />
                    </Button> */}
                </div>
            </div>
        </header>
    )
}