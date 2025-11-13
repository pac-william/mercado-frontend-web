import { getAddresses } from "@/actions/address.actions";
import { getCart } from "@/actions/cart.actions";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Separator } from "@/components/ui/separator";
import { CartItemResponseDTO } from "@/dtos/cartDTO";
import { auth0 } from "@/lib/auth0";
import { SessionData, User } from "@auth0/nextjs-auth0/types";
import Link from "next/link";
import { AddressSelectionDialog } from "./AddressSelectionDialog";
import AuthButtons from "./AuthButtons";
import CartSheet from "./CartSheet";
import Navigation from "./Navigation";
import { ProfileMenuDropDown } from "./ProfileMenuDropDown";

export default async function Header() {
    const session = await auth0.getSession() as SessionData;

    const addressResponse = await getAddresses().catch((error) => {
        console.error("Erro ao obter endereços:", error);
        return { addresses: [] };
    });
    const { addresses } = addressResponse;
    const favoriteAddress = addresses.find((address) => address.isFavorite);
    const defaultAddress = favoriteAddress ?? addresses[0];
    
    let items: CartItemResponseDTO[] = [];
    try {
        const cart = await getCart();
        items = cart.items || [];
    } catch (error) {
        console.error("Erro ao carregar carrinho:", error);
    }
    return (
        <header className="border-b border-border bg-background">
            <div className="container mx-auto flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-10">
                    <Link href="/" className="flex items-center text-2xl font-bold text-primary md:text-3xl">
                        Smart Market
                    </Link>
                    <Navigation />
                </div>

                <div className="flex flex-1 flex-row items-center justify-end gap-4">
                    <AddressSelectionDialog
                        addresses={addresses}
                        selectedAddressId={defaultAddress?.id}
                    />

                    {session ? (
                        <>
                            <Separator orientation="vertical" className="hidden h-6 md:block" />
                            <CartSheet cartItems={items} />
                        </>
                    ) : null}

                    <Separator orientation="vertical" className="hidden h-6 md:block" />
                    <AnimatedThemeToggler />
                    {session ? (
                        <ProfileMenuDropDown currentUser={session.user as User} />
                    ) : (
                        <AuthButtons />
                    )}
                </div>
            </div>
        </header>
    );
}
