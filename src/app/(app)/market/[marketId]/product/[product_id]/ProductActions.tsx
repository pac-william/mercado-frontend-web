"use client"

import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductActions() {
    const [quantity, setQuantity] = useState(1);

    const addToCart = () => {
        toast.success(`${quantity} produto(s) adicionado(s) ao carrinho`);
    };

    const buyNow = () => {
        toast.success("Redirecionando para o checkout...");
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <span className="font-medium">Quantidade:</span>
                <div className="flex items-center">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="rounded-r-none"
                    >
                        <MinusIcon size={16} />
                    </Button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">
                        {quantity}
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        disabled={quantity >= 10}
                        className="rounded-l-none"
                    >
                        <PlusIcon size={16} />
                    </Button>
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <Button
                    onClick={addToCart}
                    size="lg"
                >
                    <ShoppingCart size={20} className="mr-2" />
                    Adicionar ao Carrinho
                </Button>
                <Button
                    onClick={buyNow}
                    variant="default"
                    size="lg"
                >
                    Comprar Agora
                </Button>
            </div>
        </div>
    );
}

