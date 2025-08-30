import { getProducts } from "@/actions/products.actions";
import CartMarketGroup from "@/app/components/CartMarketGroup";
import RouterBack from "@/components/RouterBack";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Smart Market - Carrinho',
    description: 'Gerencie seu carrinho de compras',
}

export default async function Cart() {
    const products = await getProducts();
    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-col gap-4 container mx-auto my-4">
                    <RouterBack />
                    <h1 className="text-2xl font-bold">Carrinho</h1>
                    <div className="flex flex-col gap-4">
                        <CartMarketGroup marketName="Mercado 1" marketAddress="Endereço 1" products={products} />
                        <CartMarketGroup marketName="Mercado 2" marketAddress="Endereço 2" products={products} />
                        <CartMarketGroup marketName="Mercado 3" marketAddress="Endereço 3" products={products} />
                    </div>
                </div>
            </ScrollArea>
            <footer className="flex w-full justify-between items-center p-4 bg-white border-b border-gray-200 shadow-lg border-t">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Total</h1>
                    <p className="text-sm text-gray-500">R$ 100,00</p>
                </div>
                <Button>
                    <ShoppingCart size={24} />
                    <span className="text-sm font-bold">Finalizar Compra</span>
                </Button>
            </footer >
        </div >
    )
}   