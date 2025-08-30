import { ScrollArea } from "@/components/ui/scroll-area";
import { getMarketById, products } from "@/lib/mock-data";
import { Metadata } from "next";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";


export const metadata: Metadata = {
    title: 'Smart Market',
    description: 'Compre produtos de qualidade com preços acessíveis',
}

export default function Home() {
    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="flex flex-col gap-4 items-center my-4">
                <HeroSection />
                <div className="flex flex-col gap-4 items-center justify-center h-64">
                    <SearchBar />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 container mx-auto">
                    {
                        products.map((product) => {
                            const market = getMarketById(product.marketId);
                            return (
                                <ProductCard
                                    key={product.id}
                                    market={market!}
                                    product={product}
                                />
                            );
                        })
                    }
                </div>
            </div >
        </ScrollArea>
    )
}