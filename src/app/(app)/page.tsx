import { getProducts } from "@/actions/products.actions";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Metadata } from "next";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import SearchAiBar from "../components/SearchBar";
import { Product } from "../domain/productDomain";


export const metadata: Metadata = {
    title: 'Smart Market',
    description: 'Compre produtos de qualidade com preços acessíveis',
}

export default async function Home({ searchParams }: { searchParams: Promise<{ page: number, size: number, name: string }> }) {
    const { page, size, name } = await searchParams;
    const { products } = await getProducts({ page: page || 1, size: size || 100, name: name });
    /* const { markets } = await getMarkets(); */

    const sections = ["Promoções", "Destaques", "Novidades"];

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0 overflow-y-auto pr-4">
                <HeroSection />
                <div className="flex flex-col gap-4 items-center justify-center h-64">
                    <SearchAiBar particles />
                </div>
                <div className="flex flex-1 gap-4 my-20 container mx-auto select-none">
                    <div className="flex flex-col flex-1 gap-12 w-full">
                        {sections.map((section, index) => {
                            const sectionItems = products.slice(index * 12, (index + 1) * 12);
                            if (sectionItems.length === 0) return null;
                            return (
                                <div key={section} className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-4xl font-bold text-primary">{section}</h2>
                                    </div>
                                    <div className="flex flex-grow">
                                        <Carousel className="w-full" opts={{ align: "start", loop: true, dragFree: true }}>
                                            <CarouselContent className="flex flex-1">
                                                {sectionItems.map((product: Product) => (
                                                    <CarouselItem key={product.id} className="2xl:basis-1/6 xl:basis-1/4 lg:basis-1/3 md:basis-1/2 sm:basis-1/1">
                                                        <ProductCard product={product} />
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <div className="flex justify-end gap-2 mt-2">
                                                <CarouselPrevious />
                                                <CarouselNext />
                                            </div>
                                        </Carousel>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <Footer />
            </ScrollArea >
        </div>
    )
}