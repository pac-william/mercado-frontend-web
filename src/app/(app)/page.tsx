import { getProducts } from "@/actions/products.actions";
import Pagination from "@/app/components/Pagination";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import SearchAiBar from "../components/SearchBar";
import { Product } from "../domain/productDomain";
import ProductFilters from "./components/ProductFilters";
import SearchField from "./components/SeachField";


export const metadata: Metadata = {
    title: 'Smart Market',
    description: 'Compre produtos de qualidade com preços acessíveis',
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page: number, size: number, name: string }> }) {
    const { page, size, name } = await searchParams;
    const { products, meta } = await getProducts({ page: page || 1, size: size || 100, name: name });
    /* const { markets } = await getMarkets(); */

    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="flex flex-col gap-4 items-center my-4 mb-20">
                <HeroSection />
                <div className="flex flex-col gap-4 items-center justify-center h-64">
                    <SearchAiBar particles />
                </div>

                {/* <MarqueeDemo reviews={markets.map((market) => ({
                    name: market.name,
                    username: market.address,
                    body: market.logo || "",
                    img: market.logo || "https://placehold.co/150",
                }))} /> */}

                <div className="flex flex-1 gap-4 container mx-auto mt-20">

                    <div className="flex flex-col flex-1 gap-4">
                        <div className="flex flex-1 gap-4">
                            <SearchField paramName="name" />
                            <ProductFilters />
                        </div>
                        {
                            products?.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 flex-1">
                                        {products?.map((product: Product) => {
                                            return (
                                                <div key={product.id}>
                                                    <ProductCard
                                                        product={product}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <Card className="p-4 bg-card border-border">
                                        <Pagination meta={meta} />
                                    </Card>
                                </>
                            ) : (
                                <div className="flex flex-col gap-4 items-center justify-center">
                                    <h1 className="text-2xl font-bold text-nowrap text-foreground">Nenhum produto encontrado</h1>
                                </div>
                            )
                        }

                    </div>
                </div>

            </div>
            <Footer />
        </ScrollArea >
    )
}