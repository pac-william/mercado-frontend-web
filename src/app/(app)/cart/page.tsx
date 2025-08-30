import { getProducts } from "@/actions/products.actions";
import CartMarketGroup from "@/app/components/CartMarketGroup";

export default async function Cart() {
    const products = await getProducts();
    return (
        <div className="flex flex-col gap-4 container mx-auto">
            <h1 className="text-2xl font-bold">Carrinho</h1>
            <div className="flex flex-col gap-4">
                <CartMarketGroup marketName="Mercado 1" marketAddress="Endereço 1" products={products} />
                <CartMarketGroup marketName="Mercado 2" marketAddress="Endereço 2" products={products} />
                <CartMarketGroup marketName="Mercado 3" marketAddress="Endereço 3" products={products} />
            </div>
        </div >
    )
}   