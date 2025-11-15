"use client"

import { addItemToCart } from "@/actions/cart.actions";
import { Button } from "@/components/ui/button";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Loader, MinusIcon, PlusIcon, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ProductActionsProps {
    productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const { user, isLoading: userLoading } = useUser();
    const router = useRouter();

    const addToCart = async () => {
        // Verificar se o usuário está autenticado
        if (!user && !userLoading) {
            const currentPath = window.location.pathname;
            router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        setAddingToCart(true);
        try {
            await addItemToCart({
                productId: productId,
                quantity: quantity
            });
            toast.success(`${quantity} produto(s) adicionado(s) ao carrinho`);
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            const errorMessage = error instanceof Error ? error.message : "Erro ao adicionar produto ao carrinho";
            toast.error(errorMessage);
        } finally {
            setAddingToCart(false);
        }
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
                    disabled={addingToCart || userLoading}
                >
                    {addingToCart ? (
                        <>
                            <Loader size={20} className="mr-2 animate-spin" />
                            Adicionando...
                        </>
                    ) : (
                        <>
                            <ShoppingCart size={20} className="mr-2" />
                            Adicionar ao Carrinho
                        </>
                    )}
                </Button>

            </div>
        </div>
    );
}

