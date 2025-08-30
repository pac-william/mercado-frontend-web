import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/lib/mock-data";
import ProductCard from "./ProductCard";

interface CartMarketGroupProps {
    marketName: string;
    marketAddress: string;
    products: Product[];
}

export default function CartMarketGroup({
    marketName,
    marketAddress,
    products,
}: CartMarketGroupProps) {
    return (
        <Card className="">
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                <AccordionItem value="item-1" className="flex flex-col justify-between">
                    <div className="flex flex-row justify-between p-4 gap-4 items-center">
                        <div className="grid grid-cols-[auto_1fr_auto] gap-2 items-center w-full">
                            <Checkbox />
                            <div className="flex flex-row gap-2 items-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col text-left">
                                    <span className="font-bold">{marketName}</span>
                                    <span className="text-sm text-muted-foreground">{marketAddress}</span>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <div className="flex flex-row gap-2 items-center">
                                    <span className="text-sm text-muted-foreground">Total</span>
                                    <span className="text-sm font-bold">R$ 100,00</span>
                                </div>
                                <div className="flex flex-row gap-2 items-center">
                                    <span className="text-sm text-muted-foreground">Items:</span>
                                    <span className="text-sm font-bold">10</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="icon" asChild>
                            <AccordionTrigger />
                        </Button>
                    </div>
                    <AccordionContent className="p-4 border-t">
                        <Carousel className="w-full">
                            <CarouselContent className="flex flex-1">
                                {products.slice(0, 15).map((product, index) => (
                                    <CarouselItem key={product.id} className="max-w-[320px] min-w-[320px] basis-1/4">
                                        <ProductCard
                                            market_name={marketName}
                                            market_address={marketAddress}
                                            product_description={product.description}
                                            price={product.price}
                                            index={index}
                                        />
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
}