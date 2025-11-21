import { getCart as getCartAction } from "@/actions/cart.actions";
import { getMarkets } from "@/actions/market.actions";
import { Market } from "@/app/domain/marketDomain";
import { CartResponse } from "@/dtos/cartDTO";
import CartContent from "./components/CartContent";

export const dynamic = "force-dynamic";

export default async function Cart() {
    let carts: CartResponse[] = [];
    let markets: Market[] = [];

    try {
        const [cartData, marketsData] = await Promise.all([
            getCartAction(),
            getMarkets(),
        ]);

        carts = Array.isArray(cartData) ? cartData : [];
        markets = marketsData?.markets ?? [];
    } catch (error) {
        console.error("Erro ao carregar dados do carrinho:", error);
    }

    return <CartContent initialCarts={carts} markets={markets} />;
}