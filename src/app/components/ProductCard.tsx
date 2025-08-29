import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import InputPlusMinus from "@/components/input-plus-minus";

interface ProductCardProps {
    market_name: string;
    market_address: string;
    product_name: string;
    product_description: string;
    price: number;
    index: number;
}

export default function ProductCard({ market_name, market_address, product_name, product_description, price, index }: ProductCardProps) {
    return (
        <Card className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
                <Image src={`https://picsum.photos/256/256?random=${index}`} alt="Product" width={100} height={100} className="object-cover rounded-full w-16 h-16" />
                <div className="bg-white rounded-full p-2 flex flex-col gap-1">
                    <span className="text-sm font-bold">{market_name}</span>
                    <span className="text-xs">{market_address}</span>
                </div>
            </div>
            <Image src={`https://picsum.photos/256/256?random=${index + 10}`} alt="Product" width={100} height={100} className="object-cover h-64 w-64" />

            <div>
                <p className="text-sm text-gray-500">{product_description}</p>
                <p className="text-2xl font-bold">R$ {price}</p>
            </div>

            <div className="flex flex-row justify-between gap-2 mt-auto">
                <InputPlusMinus />
                <div className="flex flex-row gap-2 items-center">
                    <span className="text-sm">Adicionar:</span>
                    <Button variant="outline" size="icon">
                        <ShoppingCart size={16} />
                    </Button>
                </div>
            </div>
        </Card>
    )
}