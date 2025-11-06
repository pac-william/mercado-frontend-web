import { getCart } from "@/actions/cart.actions";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItemResponseDTO } from "@/dtos/cartDTO";
import { auth0 } from "@/lib/auth0";
import { SessionData, User } from "@auth0/nextjs-auth0/types";
import { LogIn } from "lucide-react";
import Link from "next/link";
import CartSheet from "./CartSheet";
import { ProfileMenuDropDown } from "./ProfileMenuDropDown";

export default async function Header() {
    const session = await auth0.getSession() as SessionData;

    let items: CartItemResponseDTO[] = [];
    try {
        const cart = await getCart();
        items = cart.items || [];
    } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
    }

    return (
        <header className="flex w-full justify-between items-center p-4 bg-background border-b border-border">
            <div className="flex flex-row gap-4 container mx-auto">
                <h1 className="text-2xl font-bold text-foreground items-center flex">
                    <Link href="/" className="text-foreground hover:text-primary">
                        Smart Market
                    </Link>
                </h1>
                <div className="ml-auto flex flex-row gap-8">
                    <div className="flex flex-row gap-2">
                        <CartSheet cartItems={items} />

                        <Separator orientation="vertical" />

                        <Button variant="link" size="sm" asChild>
                            <Link href="/my/shopping">
                                Compras
                            </Link>
                        </Button>

                        <Separator orientation="vertical" />
                    </div>

                    <div className="flex flex-row gap-2">
                        <AnimatedThemeToggler />
                        {session ? (
                            <ProfileMenuDropDown currentUser={session.user as User} />
                        ) : (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/auth/login">
                                    Entrar
                                    <LogIn size={24} />
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header >
    )
}