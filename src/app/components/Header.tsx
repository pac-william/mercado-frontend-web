import { getAddresses } from "@/actions/address.actions";
import { getCart } from "@/actions/cart.actions";
import { getMarketById } from "@/actions/market.actions";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { Separator } from "@/components/ui/separator";
import { CartItemResponseDTO, CartResponse } from "@/dtos/cartDTO";
import { auth0 } from "@/lib/auth0";
import { SessionData, User } from "@auth0/nextjs-auth0/types";
import Link from "next/link";
import { AddressSelectionDialog } from "./AddressSelectionDialog";
import AuthButtons from "./AuthButtons";
import CartSheet from "./CartSheet";
import ChatButton from "./ChatButton";
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
    const marketInfos: Record<string, { name: string; profilePicture?: string }> = {};

    if (session) {
        try {
            const carts = await getCart() as CartResponse[];
            items = carts.flatMap((cart) => cart.items ?? []);
        } catch (error) {
            console.error("Erro ao carregar carrinho:", error);
        }
    }

    if (items.length > 0) {
        const uniqueMarketIds = [...new Set(items.map((item) => item.product.marketId))];
        await Promise.all(
            uniqueMarketIds.map(async (marketId) => {
                try {
                    const market = await getMarketById(marketId);
                    marketInfos[marketId] = {
                        name: market.name,
                        profilePicture: market.profilePicture,
                    };
                } catch (error) {
                    console.error(`Erro ao buscar mercado ${marketId}:`, error);
                    marketInfos[marketId] = {
                        name: marketId,
                        profilePicture: undefined,
                    };
                }
            })
        );
    }

    return (
        <header className="border-b border-border bg-background">
            <div className="container mx-auto flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:gap-10">
                    <Link href="/" className="flex items-center text-2xl font-bold text-primary md:text-3xl">
                        Smart Market
                    </Link>
                    <Navigation />
                </div>

                <div className="flex flex-1 flex-row items-center justify-end gap-4">

                    {session ? (
                        <>
                            <AddressSelectionDialog
                                addresses={addresses}
                                selectedAddressId={defaultAddress?.id}
                            />
                            <Separator orientation="vertical" className="hidden h-6 md:block" />
                            <CartSheet cartItems={items} marketInfos={marketInfos} />
                        </>
                    ) : null}

                    <Separator orientation="vertical" className="hidden h-6 md:block" />
                    <div className="flex flex-row items-center gap-2">
                        {session && <ChatButton />}
                        <AnimatedThemeToggler />
                        {session ? (
                            <ProfileMenuDropDown currentUser={session.user as User} />
                        ) : (
                            <AuthButtons />
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
