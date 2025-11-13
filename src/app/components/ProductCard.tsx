"use client"

import bh_supermercados from "@/../public/markets/bh_supermercados.png";
import { addItemToCart } from "@/actions/cart.actions";
import InputPlusMinus from "@/components/input-plus-minus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Loader2, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "../domain/productDomain";
import { formatPrice } from "../utils/formatters";

interface ProductCardProps {
    product: Product;
    variant?: "quantity-select" | "buy-now" | "owner" | "history" | "suggestion";
    badgeText?: string;
    badgeVariant?: "default" | "secondary" | "destructive" | "outline";
    initialQuantity?: number;
    onQuantityChange?: (productId: string, quantity: number) => void;
}

export default function ProductCard({ product, variant = "buy-now", badgeText, badgeVariant = "secondary", initialQuantity, onQuantityChange }: ProductCardProps) {
    const [addingToCart, setAddingToCart] = useState(false);
    const [quantity, setQuantity] = useState(initialQuantity || 1);
    const { user, isLoading } = useUser();
    const router = useRouter();

    const getImageSrc = () => {

        if (product.image && isValidUrl(product.image)) {
            return product.image;
        }
        // Fallback para a imagem padrão
        return "https://ibassets.com.br/ib.item.image.medium/m-20161111154302022002734292c24125421585da814b5db62401.jpg";
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    };

    const mountPriceView = (price: number, type: "old" | "new") => {
        return (
            <div className="flex flex-row items-start leading-none">
                <p className={`mt-[2px] mr-[2px] ${type === "old" ? "text-muted-foreground line-through text-sm font-normal" : "text-lg font-bold"}`}>{formatPrice(price)}</p>
            </div>
        );
    };

    // Deterministic function to determine if product should show discount
    const shouldShowDiscount = (productId: string) => {
        // Use product ID to create a deterministic "random" value
        const hash = productId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return Math.abs(hash) % 2 === 0;
    };

    // Deterministic function to calculate discount price
    const getDiscountPrice = (price: number, productId: string) => {
        const hash = productId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        const multiplier = 1.1 + (Math.abs(hash) % 50) / 100; // Between 1.1 and 1.6
        return price * multiplier;
    };

    const handleAddToCart = async () => {
        // Verificar se o usuário está autenticado
        if (!user && !isLoading) {
            // Redirecionar para login com parâmetro redirect
            const currentPath = window.location.pathname;
            router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
            return;
        }

        setAddingToCart(true);
        try {
            await addItemToCart({
                productId: product.id,
                quantity: quantity
            });
            toast.success("Produto adicionado ao carrinho");
        } catch (error) {
            console.error("Erro ao adicionar ao carrinho:", error);
            toast.error("Erro ao adicionar produto ao carrinho");
        } finally {
            setAddingToCart(false);
        }
    }
    switch (variant) {
        case "quantity-select":
            return (
                <Card className="flex flex-col max-w-xs w-full bg-card border-border">
                    <CardHeader className="flex flex-row gap-2">
                        <Image src={bh_supermercados} alt="Product" width={100} height={100} className="object-cover rounded-full aspect-square w-12 h-12 shadow-md border" />
                        <div className="rounded-full flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-card-foreground">Market 1</span>
                                <div className="flex flex-row gap-1">
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="p-0 relative w-full aspect-square">
                        <Image src={getImageSrc()} alt="Product" fill className="object-cover p-8" />
                    </CardContent>

                    <CardFooter className="flex flex-col flex-1 gap-2 items-start">
                        <p className="text-sm line-clamp-2 text-card-foreground">{product.name}</p>
                        <div className="grid grid-cols-[auto_1fr] items-center w-full">
                            {
                                shouldShowDiscount(product.id) ? (
                                    <>
                                        <p>De</p>
                                        <div className="flex flex-row items-center ml-2">
                                            {mountPriceView(getDiscountPrice(product.price, product.id), "old")}
                                        </div>
                                        <p>Por</p>
                                    </>
                                ) : null
                            }
                            <div className="flex flex-row items-center ml-2">
                                {mountPriceView(product.price, "new")}
                            </div>
                        </div>
                    </CardFooter>

                    <Separator />

                    <CardFooter className="flex flex-row justify-between gap-2">
                        <InputPlusMinus
                            value={quantity}
                            onChange={(value) => {
                                const newQuantity = value ?? 1;
                                setQuantity(newQuantity);
                                onQuantityChange?.(product.id, newQuantity);
                            }}
                        />
                        <div className="flex flex-row gap-2 items-end">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleAddToCart}
                                disabled={addingToCart}
                            >
                                {addingToCart ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ShoppingCart size={16} />
                                )}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            );
        case "buy-now":
            return (
                <Card className="flex flex-col max-w-xs w-full bg-card border-border">
                    <CardHeader className="flex flex-row gap-2">
                        <Link href={`/market/${product.marketId}`}>
                            <Image src={bh_supermercados} alt="Product" width={100} height={100} className="object-cover rounded-full aspect-square w-12 h-12 shadow-md border" />
                        </Link>
                        <div className="rounded-full flex flex-col gap-2">
                            <div className="flex flex-col">
                                <Link href={`/market/${product.marketId}`}>
                                    <span className="1text-sm font-bold text-card-foreground">Market 1</span>
                                </Link>
                                <div className="flex flex-row gap-1">
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="p-0 relative w-full aspect-square">
                        <Link href={`/market/${product.marketId}/product/${product.id}`}>
                            <Image src={getImageSrc()} alt="Product" fill className="object-cover p-8 cursor-pointer" />
                        </Link>
                    </CardContent>

                    <CardFooter className="flex flex-col flex-1 gap-2 items-start">
                        <p className="text-sm line-clamp-2 text-card-foreground">{product.name}</p>
                        <div className="flex flex-row w-full justify-between mt-auto">
                            <div className="grid grid-cols-[auto_1fr] items-center w-full">
                                {
                                    shouldShowDiscount(product.id) ? (
                                        <>
                                            <p className="text-card-foreground">De</p>
                                            <div className="flex flex-row items-center ml-2">
                                                {mountPriceView(getDiscountPrice(product.price, product.id), "old")}
                                            </div>
                                            <p className="text-card-foreground">Por</p>
                                        </>
                                    ) : null
                                }
                                <div className="flex flex-row items-center ml-2">
                                    {mountPriceView(product.price, "new")}
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 items-end">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                >
                                    {addingToCart ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ShoppingCart size={16} />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            );
        case "owner":
            return (
                <Card className="flex flex-col max-w-xs w-full bg-card border-border">
                    <CardContent className="p-0 relative w-full aspect-square">
                        <Link href={`/market/${product.marketId}/product/${product.id}`}>
                            <Image src={getImageSrc()} alt="Product" fill className="object-cover p-8 cursor-pointer" />
                        </Link>
                    </CardContent>

                    <CardFooter className="flex flex-col flex-1 gap-2 items-start">
                        <p className="text-sm line-clamp-2 text-card-foreground">{product.name}</p>
                        <div className="flex flex-row w-full justify-between mt-auto">
                            <div className="grid grid-cols-[auto_1fr] items-center w-full">
                                {
                                    shouldShowDiscount(product.id) ? (
                                        <>
                                            <p className="text-card-foreground">De</p>
                                            <div className="flex flex-row items-center ml-2">
                                                {mountPriceView(getDiscountPrice(product.price, product.id), "old")}
                                            </div>
                                            <p className="text-card-foreground">Por</p>
                                        </>
                                    ) : null
                                }
                                <div className="flex flex-row items-center ml-2">
                                    {mountPriceView(product.price, "new")}
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 items-end">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                >
                                    {addingToCart ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ShoppingCart size={16} />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            );
        case "history":
            return (
                <Card className="flex h-full flex-col max-w-xs w-full bg-card border-border">
                    <CardContent className="p-0 relative w-full aspect-square">
                        <Image src={getImageSrc()} alt="Product" fill className="object-cover p-8" />
                    </CardContent>

                    <CardFooter className="flex flex-col flex-1 gap-2 items-start">
                        <p className="text-sm line-clamp-2 text-card-foreground">{product.name}</p>
                        <div className="flex flex-row w-full justify-between mt-auto">
                            <div className="grid grid-cols-[auto_1fr] items-center w-full">
                                {
                                    shouldShowDiscount(product.id) ? (
                                        <>
                                            <p className="text-card-foreground">De</p>
                                            <div className="flex flex-row items-center ml-2">
                                                {mountPriceView(getDiscountPrice(product.price, product.id), "old")}
                                            </div>
                                            <p className="text-card-foreground">Por</p>
                                        </>
                                    ) : null
                                }
                                <div className="flex flex-row items-center ml-2">
                                    {mountPriceView(product.price, "new")}
                                </div>
                            </div>

                        </div>
                    </CardFooter>
                </Card>
            );
        case "suggestion":
            return (
                <Card className="flex flex-col max-w-xs w-full relative">
                    {badgeText && (
                        <div className="absolute top-2 right-2 z-10">
                            <Badge variant={badgeVariant} className="text-xs">
                                {badgeText}
                            </Badge>
                        </div>
                    )}
                    <CardHeader className="flex flex-row gap-2">
                        <Image src={bh_supermercados} alt="Product" width={100} height={100} className="object-cover rounded-full aspect-square w-12 h-12 shadow-md border" />
                        <div className="rounded-full flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-card-foreground">Market 1</span>
                                <div className="flex flex-row gap-1">
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                    <Star size={16} className="text-amber-300" fill="currentColor" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="p-0 relative w-full aspect-square">
                        <Image src={getImageSrc()} alt="Product" fill className="object-cover p-8" />
                    </CardContent>

                    <CardFooter className="flex flex-col flex-1 gap-2 items-start">
                        <p className="text-sm line-clamp-2 text-card-foreground">{product.name}</p>
                        <div className="flex flex-row w-full justify-between mt-auto">
                            <div className="grid grid-cols-[auto_1fr] items-center w-full">
                                {
                                    shouldShowDiscount(product.id) ? (
                                        <>
                                            <p className="text-card-foreground">De</p>
                                            <div className="flex flex-row items-center ml-2">
                                                {mountPriceView(getDiscountPrice(product.price, product.id), "old")}
                                            </div>
                                            <p className="text-card-foreground">Por</p>
                                        </>
                                    ) : null
                                }
                                <div className="flex flex-row items-center ml-2">
                                    {mountPriceView(product.price, "new")}
                                </div>
                            </div>
                            <div className="flex flex-row gap-2 items-end">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleAddToCart}
                                    disabled={addingToCart}
                                >
                                    {addingToCart ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <ShoppingCart size={16} />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            );
    }
}