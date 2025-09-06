import { getMarkets } from "@/actions/market.actions";
import { getProducts } from "@/actions/products.actions";
import ProductCard from "@/app/components/ProductCard";
import { formatPrice } from "@/app/utils/formatters";
import RouterBack from "@/components/RouterBack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";
import SelectMethod from "./components/SelectMethod";

export const metadata: Metadata = {
    title: 'Smart Market - Carrinho',
    description: 'Gerencie seu carrinho de compras',
}

export default async function Cart() {
    const products = await getProducts();

    const deliveryFee = 10;
    const discountPercentage = 0.05;

    const cartItems = products.slice(0, 8).map(product => ({
        ...product,
        quantity: Math.floor(Math.random() * 3) + 1
    }));

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const discount = subtotal * discountPercentage;
    const total = subtotal - discount + deliveryFee;

    const markets = await getMarkets();
    
    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-4 container mx-auto my-4">
                    <RouterBack />
                    <h1 className="text-2xl font-bold">Carrinho</h1>
                    <Carousel className="w-full">
                        <CarouselContent className="flex flex-1">
                            {markets.map((market) => {
                                return (
                                    <CarouselItem key={market.id} className="max-w-[320px] min-w-[320px] basis-1/4">
                                        <Card className="flex flex-1 flex-row gap-2 p-4 shadow-none">
                                            <Avatar className="w-10 h-10 shadow-md">
                                                <AvatarImage src={market.logo} alt={market.name} width={100} height={100} className="rounded-full" />
                                                <AvatarFallback>{market.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span>{market.name}</span>
                                                <span className="text-sm text-muted-foreground">Total: {formatPrice(0)}</span>
                                                <span className="text-sm text-muted-foreground">Distância: {0}km</span>

                                            </div>
                                        </Card>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>
                    </Carousel>
                    <div className="flex flex-1 flex-row gap-4">
                        <div className="flex flex-1 flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                        <div className="w-[400px] h-[calc(100vh-113px)] sticky top-4">
                            <div className="flex flex-col gap-4 h-full">
                                <SelectMethod />
                                <Card className="flex flex-col flex-1">
                                    <CardContent className="flex flex-1 flex-col gap-2">
                                        <ScrollArea className="flex flex-col flex-grow h-0 pr-4 gap-2">
                                            <h1 className="text-lg font-bold">Itens:</h1>
                                            <div className="flex flex-col">
                                                {cartItems.map((item) => {
                                                    return (
                                                        <div key={item.id} className="grid grid-cols-8">
                                                            <div className="flex col-span-2 gap-2">
                                                                <span className="text-sm">{item.quantity}</span>
                                                                <span className="text-sm">{}</span>
                                                            </div>
                                                            <span className="text-sm col-span-4 ">{item.name}</span>
                                                            <span className="text-sm col-span-2">{formatPrice(item.price * item.quantity)}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </ScrollArea>
                                        <Separator />
                                        <div className="flex flex-col">
                                            <span>Descontos: {formatPrice(discount)} -5%</span>
                                            <span>Frete: {formatPrice(deliveryFee)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex flex-col">
                                            <span>SubTotal: {formatPrice(subtotal)}</span>
                                        </div>
                                    </CardContent>
                                    <Separator />
                                    <CardFooter className="flex flex-row justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-muted-foreground">Total</span>
                                            <span className="text-lg font-bold">{formatPrice(total)}</span>
                                        </div>
                                        <div>
                                            <Button>
                                                Continuar para o Checkout
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </ScrollArea >
        </div >
    )
}   