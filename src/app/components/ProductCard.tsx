import InputPlusMinus from "@/components/input-plus-minus";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import { formatPrice } from "../utils/formatters";

interface ProductCardProps {
    market_name: string;
    market_address: string;
    product_description: string;
    price: number;
    index: number;
}

export default function ProductCard({ market_name, market_address, product_description, price, index }: ProductCardProps) {

    const mountPriceView = (price: number, type: "old" | "new") => {
        return (
            <div className="flex flex-row items-start leading-none">
                <p className={`mt-[2px] mr-[2px] ${type === "old" ? "text-muted-foreground line-through text-sm font-normal" : "text-lg font-bold"}`}>{formatPrice(price)}</p>
            </div>
        );
    };

    return (
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row gap-2 border-b">
                <Image src={`https://picsum.photos/256/256?random=${index}`} alt="Product" width={100} height={100} className="object-cover rounded-full w-16 h-16" />
                <div className="bg-white rounded-full flex flex-col gap-1">
                    <span className="text-sm font-bold">{market_name}</span>
                    <span className="text-xs line-clamp-1">{market_address}</span>
                    <div className="flex flex-row gap-1">
                        <Star size={16} className="text-yellow-500" />
                        <Star size={16} className="text-yellow-500" />
                        <Star size={16} className="text-yellow-500" />
                        <Star size={16} className="text-yellow-500" />
                        <Star size={16} className="text-yellow-500" />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0 relative w-full aspect-square">
                <Image src={`https://picsum.photos/256/256?random=${index + 10}`} alt="Product" fill className="object-cover" />
            </CardContent>

            <CardFooter className="flex flex-col gap-2 border-t items-start">
                <p className="text-sm">{product_description}</p>
                <div className="grid grid-cols-[auto_1fr] items-center w-full">
                    <p>De</p>
                    <div className="flex flex-row items-center ml-2">
                        {mountPriceView(price, "old")}
                    </div>
                    <p>Por</p>
                    <div className="flex flex-row items-center ml-2">
                        {mountPriceView(price, "new")}
                    </div>
                </div>
            </CardFooter>

            <CardFooter className="flex flex-row justify-between gap-2 mt-auto">
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