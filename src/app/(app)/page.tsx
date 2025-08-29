import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "../components/SearchBar";
import ProductCard from "../components/ProductCard";
import { products, getMarketById } from "@/lib/mock-data";

export default function Home() {
    return (
        <div className="container mx-auto flex flex-col flex-1 gap-4">
            <SearchBar />
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 pr-4">
                    {
                        products.map((product, index) => {
                            const market = getMarketById(product.marketId);
                            return (
                                <ProductCard 
                                    key={product.id} 
                                    market_name={market?.name || "Mercado não encontrado"} 
                                    market_address={market?.address || "Endereço não disponível"} 
                                    product_name={product.name} 
                                    product_description={product.description} 
                                    price={product.price} 
                                    index={index} 
                                />
                            );
                        })
                    }
                </div>
            </ScrollArea>
        </div>
    )
}