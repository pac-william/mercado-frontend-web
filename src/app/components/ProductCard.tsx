import InputPlusMinus from "@/components/input-plus-minus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Market, Product } from "@/lib/mock-data";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "../utils/formatters";

interface ProductCardProps {
    market: Market;
    product: Product;
}

export default function ProductCard({ market, product }: ProductCardProps) {

    const mountPriceView = (price: number, type: "old" | "new") => {
        return (
            <div className="flex flex-row items-start leading-none">
                <p className={`mt-[2px] mr-[2px] ${type === "old" ? "text-muted-foreground line-through text-sm font-normal" : "text-lg font-bold"}`}>{formatPrice(price)}</p>
            </div>
        );
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row gap-2">
                <Image src={market.profilePicture} alt="Product" width={100} height={100} className="object-cover rounded-full w-16 h-16 shadow-md border" />
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
                <Image src={`https://picsum.photos/256/256?random=${product.id}`} alt="Product" fill className="object-cover" />
            </CardContent>

            <CardFooter className="flex flex-col gap-2 items-start">
                <p className="text-sm">{product.description}</p>
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
                    <span className="text-sm">Adicionar:</span>
                    <Button variant="outline" size="icon">
                        <ShoppingCart size={16} />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}