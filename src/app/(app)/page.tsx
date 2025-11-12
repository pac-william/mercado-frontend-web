import { getProducts } from "@/actions/products.actions";
import Pagination from "@/app/components/Pagination";
import PriceSlider from "@/components/price-slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import SearchAiBar from "../components/SearchBar";
import { Product } from "../domain/productDomain";
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
                    <div className="w-[320px] h-[calc(100vh-113px)] sticky top-4">
                        <Card className="flex flex-col h-full bg-card border-border">
                            <CardHeader>
                                <CardTitle className="text-card-foreground">Filtros</CardTitle>
                                <CardDescription className="text-muted-foreground">Filtre os produtos por categoria, preço, etc.</CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="flex flex-1 flex-col">
                                <ScrollArea className="flex flex-col flex-grow h-0 pr-4">
                                    <div className="flex flex-col flex-1 gap-4">
                                        <PriceSlider />
                                        <Card className="flex flex-col bg-card border-border">
                                            <CardHeader>
                                                <Label className="text-card-foreground">Categoria</Label>
                                            </CardHeader>
                                            <Separator />
                                            <CardContent >
                                                <ScrollArea className="h-[140px]">
                                                    <div className="grid grid-cols-[auto_1fr] gap-2">
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Frutas</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Legumes</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Carnes</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Peixes</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Bebidas</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Doces</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Bebidas</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Doces</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Bebidas</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Doces</Label>
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>

                                        <Card className="flex flex-col bg-card border-border">
                                            <CardHeader>
                                                <Label className="text-card-foreground">Mercado</Label>
                                            </CardHeader>
                                            <Separator />
                                            <CardContent>
                                                <ScrollArea className="h-[140px]">
                                                    <div className="grid grid-cols-[auto_1fr] gap-2">
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 1</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 2</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 3</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 4</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 5</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 6</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 7</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 8</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 9</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 10</Label>
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>

                                        <Card className="flex flex-col">
                                            <CardHeader>
                                                <Label>Categoria</Label>
                                            </CardHeader>
                                            <Separator />
                                            <CardContent >
                                                <ScrollArea className="h-[140px]">
                                                    <div className="grid grid-cols-[auto_1fr] gap-2">
                                                        <Checkbox />
                                                        <Label>Frutas</Label>
                                                        <Checkbox />
                                                        <Label>Legumes</Label>
                                                        <Checkbox />
                                                        <Label>Carnes</Label>
                                                        <Checkbox />
                                                        <Label>Peixes</Label>
                                                        <Checkbox />
                                                        <Label>Bebidas</Label>
                                                        <Checkbox />
                                                        <Label>Doces</Label>
                                                        <Checkbox />
                                                        <Label>Bebidas</Label>
                                                        <Checkbox />
                                                        <Label>Doces</Label>
                                                        <Checkbox />
                                                        <Label>Bebidas</Label>
                                                        <Checkbox />
                                                        <Label>Doces</Label>
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>

                                        <Card className="flex flex-col bg-card border-border">
                                            <CardHeader>
                                                <Label className="text-card-foreground">Mercado</Label>
                                            </CardHeader>
                                            <Separator />
                                            <CardContent>
                                                <ScrollArea className="h-[140px]">
                                                    <div className="grid grid-cols-[auto_1fr] gap-2">
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 1</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 2</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 3</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 4</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 5</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 6</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 7</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 8</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 9</Label>
                                                        <Checkbox />
                                                        <Label className="text-card-foreground">Mercado 10</Label>
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex flex-col flex-1 gap-4">
                        <SearchField paramName="name" />
                        {
                            products?.length > 0 ? (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 flex-1">
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