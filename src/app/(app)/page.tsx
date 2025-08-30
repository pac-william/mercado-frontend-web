import { getMarketById, products } from "@/lib/mock-data";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
    return (
        <div className="flex flex-col gap-4 items-center">
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
    )
}