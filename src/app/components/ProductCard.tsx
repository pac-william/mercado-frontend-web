import { getMarketById } from "@/actions/market.actions";
import InputPlusMinus from "@/components/input-plus-minus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { Product } from "../domain/product";
import { formatPrice } from "../utils/formatters";

interface ProductCardProps {
    product: Product;
    variant?: "quantity-select" | "buy-now";
}

export default async function ProductCard({ product, variant = "buy-now" }: ProductCardProps) {

    let market = await getMarketById(product.marketId);

    if (!market) {
        market = {
            id: "1",
            name: "Market 1",
            address: "Address 1",
            logo: "https://picsum.photos/256/256?random=1"
        };
    }

    const mountPriceView = (price: number, type: "old" | "new") => {
        return (
            <div className="flex flex-row items-start leading-none">
                <p className={`mt-[2px] mr-[2px] ${type === "old" ? "text-muted-foreground line-through text-sm font-normal" : "text-lg font-bold"}`}>{formatPrice(price)}</p>
            </div>
        );
    };

    switch (variant) {
        case "quantity-select":
            return (
                <Card className="flex flex-col max-w-xs w-full">
                    <CardHeader className="flex flex-row gap-2">
                        <Image src={market.logo} alt="Product" width={100} height={100} className="object-cover rounded-full w-16 h-16 shadow-md border" />
                        <div className="bg-white rounded-full flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">{market.name}</span>
                                <span className="text-xs line-clamp-1">{market.address}</span>
                            </div>
                            <div className="flex flex-row gap-1">
                                <Star size={16} className="text-yellow-500" />
                                <Star size={16} className="text-yellow-500" />
                                <Star size={16} className="text-yellow-500" />
                                <Star size={16} className="text-yellow-500" />
                                <Star size={16} className="text-yellow-500" />
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="p-0 relative w-full aspect-square">
                        <Image src={"https://picsum.photos/256/256?random=1"} alt="Product" fill className="object-cover" />
                    </CardContent>

                    <CardFooter className="flex flex-col flex-1 gap-2 items-start">
                        <p className="text-sm">{product.name}</p>
                        <div className="grid grid-cols-[auto_1fr] items-center w-full">
                            <p>De</p>
                            <div className="flex flex-row items-center ml-2">
                                {mountPriceView(product.price, "old")}
                            </div>
                            <p>Por</p>
                            <div className="flex flex-row items-center ml-2">
                                {mountPriceView(product.price, "new")}
                            </div>
                        </div>
                    </CardFooter>

                    <Separator />

                    <CardFooter className="flex flex-row justify-between gap-2">
                        <InputPlusMinus />
                        <div className="flex flex-row gap-2 items-center">
                            <Button variant="outline" size="icon">
                                <ShoppingCart size={16} />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            );
        case "buy-now":
            return (
                <Card className="flex flex-col h-fit max-w-xs w-full">
                    <CardHeader className="flex flex-row gap-2">
                        <Image src={market.logo} alt="Product" width={100} height={100} className="object-cover rounded-full aspect-square w-16 h-16 shadow-md border" />
                        <div className="bg-white rounded-full flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">{market.name}</span>
                                <span className="text-xs line-clamp-1">{market.address}</span>
                            </div>
                            <div className="flex flex-row gap-1">
                                <Star size={16} className="text-yellow-500" />
                                <Star size={16} className="text-yellow-500" />
                                <Star size={16} className="text-yellow-500" />
                                <Star size={16} className="text-yellow-500" />
                                <Star size={16} className="text-yellow-500" />
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="p-0 relative w-full aspect-square">
                        <Image src={"https://picsum.photos/256/256?random=1"} alt="Product" fill className="object-cover" />
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2 items-start">
                        <p className="text-sm">{product.name}</p>
                        <div className="flex flex-row flex-1 w-full justify-between">
                            <div className="grid grid-cols-[auto_1fr] items-center w-full">
                                <p>De</p>
                                <div className="flex flex-row items-center ml-2">
                                    {mountPriceView(product.price, "old")}
                                </div>
                                <p>Por</p>
                                <div className="flex flex-row items-center ml-2">
                                    {mountPriceView(product.price, "new")}
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <Button variant="outline" size="icon">
                                    <ShoppingCart size={16} />
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            );
    }
}