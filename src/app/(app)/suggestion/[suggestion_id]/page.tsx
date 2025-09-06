import { getProducts } from "@/actions/products.actions";
import ProductCard from "@/app/components/ProductCard";
import SearchBar from "@/app/components/SearchBar";
import RouterBack from "@/components/RouterBack";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import "moment/locale/pt-br";
import { Metadata } from "next";
import Link from "next/link";


export const metadata: Metadata = {
    title: 'Smart Market - Agente',
    description: 'Veja o perfil do agente',
}

export default async function AgentPage({ params }: { params: Promise<{ suggestion_id: string }> }) {
    const { suggestion_id } = await params;
    const products = await getProducts();

    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="container mx-auto my-4">
                <RouterBack />
            </div>
            <div className="flex flex-col gap-4 items-center justify-center h-64">
                <SearchBar />
            </div>
            <div className="flex flex-col gap-4 container mx-auto my-4">
                <h1 className="text-2xl font-bold">Planejando seu churrasco para 5 pessoas</h1>
                <p>Em um churrasco, geralmente calcula-se cerca de 300 a 400g de carne por pessoa, além de acompanhamentos e bebidas. Para 5 pessoas, isso significa aproximadamente 2kg de carne. Também é importante considerar acompanhamentos clássicos, carvão suficiente para manter a brasa acesa durante toda a refeição, e bebidas para refrescar os convidados.</p>



            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 container mx-auto">
                {
                    products.slice(0, 4).map((product) => {
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        );
                    })
                }
            </div>
            <div className="flex flex-col gap-4 container mx-auto my-4">
                <p>A combinação de cortes nobres (picanha) + opções mais econômicas (fraldinha, linguiça) garante sabor e custo-benefício. Acompanhamentos</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 container mx-auto">
                {
                    products.slice(0, 3).map((product) => {
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        );
                    })
                }
            </div>
            <div className="flex flex-col gap-4 container mx-auto my-4">
                <p>Sugestão extra: se tiver convidados vegetarianos, o queijo coalho é uma ótima opção para agradar a todos.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 container mx-auto">
                {
                    products.slice(0, 5).map((product) => {
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        );
                    })
                }
            </div>
            <div className="flex flex-col gap-4 container mx-auto my-4">
                <p>Cálculo rápido: para 5 pessoas, considere 1,5L de bebida por pessoa (incluindo cerveja, refrigerante e água). Outros essenciais: 1kg de carvão, 1kg de carne, 1kg de acompanhamento, 1kg de bebida.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 container mx-auto">
                {
                    products.slice(0, 2).map((product) => {
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        );
                    })
                }
            </div>
            <div className="flex flex-col gap-4 container mx-auto my-4">
                <p>Com esta lista, você terá carne suficiente, acompanhamentos variados, bebidas na medida e insumos para não faltar nada durante o churrasco. Basta clicar em “Adicionar todos ao carrinho” e aproveitar o seu evento sem preocupação.</p>
            </div>
            <footer className="flex w-full justify-between items-center p-4 bg-white border-b border-gray-200 shadow-lg border-t">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold">Total</h1>
                    <p className="text-sm text-gray-500">R$ 100,00</p>
                </div>
                <Button asChild>
                    <Link href="/cart">
                        <ShoppingCart size={24} />
                        <span className="text-sm font-bold">Ir para carrinho</span>
                    </Link>
                </Button>
            </footer >
        </ScrollArea>
    )
}