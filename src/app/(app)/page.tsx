import { getMarketById, products } from "@/lib/mock-data";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

export default function Home() {
    return (
        <div className="flex flex-col gap-4 items-center">
            <HeroSection />
            <SearchBar />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 container mx-auto">
                {
                    products.map((product, index) => {
                        const market = getMarketById(product.marketId);
                        return (
                            <ProductCard
                                key={product.id}
                                market_name={market?.name || "Mercado não encontrado"}
                                market_address={market?.address || "Endereço não disponível"}
                                product_description={product.description}
                                price={product.price}
                                index={index}
                            />
                        );
                    })
                }
            </div>
        </div >
    )
}