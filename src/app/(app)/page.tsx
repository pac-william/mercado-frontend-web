import { getProducts } from "@/actions/products.actions";
import PriceSlider from "@/components/price-slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import HeroSection from "../components/HeroSection";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";


export const metadata: Metadata = {
    title: 'Smart Market',
    description: 'Compre produtos de qualidade com preços acessíveis',
}

export default async function Home() {
    const products = await getProducts({ page: 1, size: 20 });
    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="flex flex-col gap-4 items-center my-4">
                <HeroSection />
                <div className="flex flex-col gap-4 items-center justify-center h-64">
                    <SearchBar />
                </div>
                <div className="flex flex-1 gap-4 container mx-auto">
                    <div className="w-[300px] h-[calc(100vh-113px)] sticky top-4">
                        <Card className="flex flex-col h-full">
                            <CardHeader>
                                <CardTitle>Filtros</CardTitle>
                                <CardDescription>Filtre os produtos por categoria, preço, etc.</CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="flex flex-1 flex-col">
                                <ScrollArea className="flex flex-col flex-grow h-0 pr-4">
                                    <div className="flex flex-col flex-1 gap-4">
                                        <PriceSlider />
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

                                        <Card className="flex flex-col">
                                            <CardHeader>
                                                <Label>Mercado</Label>
                                            </CardHeader>
                                            <Separator />
                                            <CardContent>
                                                <ScrollArea className="h-[140px]">
                                                    <div className="grid grid-cols-[auto_1fr] gap-2">
                                                        <Checkbox />
                                                        <Label>Mercado 1</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 2</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 3</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 4</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 5</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 6</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 7</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 8</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 9</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 10</Label>
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

                                        <Card className="flex flex-col">
                                            <CardHeader>
                                                <Label>Mercado</Label>
                                            </CardHeader>
                                            <Separator />
                                            <CardContent>
                                                <ScrollArea className="h-[140px]">
                                                    <div className="grid grid-cols-[auto_1fr] gap-2">
                                                        <Checkbox />
                                                        <Label>Mercado 1</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 2</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 3</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 4</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 5</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 6</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 7</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 8</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 9</Label>
                                                        <Checkbox />
                                                        <Label>Mercado 10</Label>
                                                    </div>
                                                </ScrollArea>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 flex-1">
                        {
                            products.map((product) => {
                                return (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                );
                            })
                        }
                    </div>
                </div>
            </div>
        </ScrollArea >
    )
}