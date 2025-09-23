"use client"

import bh_supermercados from "@/../public/markets/bh_supermercados.png";
import { getProductsById } from "@/actions/products.actions";
import { Product } from "@/app/domain/productDomain";
import { formatPrice } from "@/app/utils/formatters";
import RouterBack from "@/components/RouterBack";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RotateCcw, Shield, ShoppingCart, Star, Truck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductPage({ params }: { params: Promise<{ product_id: string }> }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { product_id } = await params;
                const productData = await getProductsById(product_id);
                setProduct(productData);
            } catch (error) {
                console.error("Erro ao carregar produto:", error);
                toast.error("Erro ao carregar produto");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params]);

    const getImageSrc = () => {
        if (product?.image && isValidUrl(product.image)) {
            return product.image;
        }
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

    const shouldShowDiscount = (productId: string) => {
        const hash = productId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return Math.abs(hash) % 2 === 0;
    };

    const getDiscountPrice = (price: number, productId: string) => {
        const hash = productId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        const multiplier = 1.1 + (Math.abs(hash) % 50) / 100;
        return price * multiplier;
    };

    const addToCart = () => {
        toast.success(`${quantity} produto(s) adicionado(s) ao carrinho`);
    };

    const buyNow = () => {
        toast.success("Redirecionando para o checkout...");
    };

    const addToWishlist = () => {
        toast.success("Produto adicionado aos favoritos");
    };

    const shareProduct = () => {
        if (navigator.share) {
            navigator.share({
                title: product?.name,
                text: `Confira este produto: ${product?.name}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copiado para a área de transferência");
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col flex-1">
                <div className="container mx-auto my-4">
                    <RouterBack />
                </div>
                <div className="flex flex-col flex-1 container mx-auto">
                    <div className="animate-pulse">
                        <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        );
    }
    1
    if (!product) {
        return (
            <div className="flex flex-col flex-1">
                <div className="container mx-auto my-4">
                    <RouterBack />
                </div>
                <div className="flex flex-col flex-1 container mx-auto items-center justify-center">
                    <p className="text-muted-foreground">Produto não encontrado</p>
                </div>
            </div>
        );
    }

    const showDiscount = shouldShowDiscount(product.id);
    const discountPrice = showDiscount ? getDiscountPrice(product.price, product.id) : 0;
    const discountPercentage = showDiscount ? Math.round(((discountPrice - product.price) / discountPrice) * 100) : 0;

    return (
        <div className="flex flex-col flex-1">
            <div className="container mx-auto my-4">
                <RouterBack />
            </div>

            <div className="flex flex-col flex-1 container mx-auto pb-8">
                <div className="grid grid-cols-2">
                    {/* Imagem do produto */}
                    <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
                        <Image
                            src={getImageSrc()}
                            alt={product.name}
                            className="object-cover"
                            fill
                        />
                    </div>

                    {/* Informações do produto */}
                    <div className="space-y-6">
                        {/* Nome e preço */}
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-4">
                                {showDiscount ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-foreground">
                                            {formatPrice(product.price)}
                                        </span>
                                        <span className="text-lg text-muted-foreground line-through">
                                            {formatPrice(discountPrice)}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-foreground">
                                        {formatPrice(product.price)}
                                    </span>
                                )}
                            </div>

                            {showDiscount && (
                                <p className="text-sm text-green-600 font-medium">
                                    Economize {formatPrice(discountPrice - product.price)} ({discountPercentage}% de desconto)
                                </p>
                            )}
                        </div>

                        {/* Informações do mercado */}
                        <Card>
                            <CardHeader className="pb-3">
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={bh_supermercados}
                                        alt="Market"
                                        width={48}
                                        height={48}
                                        className="rounded-full border shadow-sm"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-foreground">BH Supermercados</h3>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className="text-yellow-500 fill-current" />
                                            ))}
                                            <span className="text-sm text-muted-foreground ml-1">(4.8)</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Truck size={16} className="text-muted-foreground" />
                                        <span>Frete grátis</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Shield size={16} className="text-muted-foreground" />
                                        <span>Garantia</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RotateCcw size={16} className="text-muted-foreground" />
                                        <span>Troca fácil</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-green-600 font-medium">Em estoque</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Controles de quantidade e ações */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="font-medium">Quantidade:</span>
                                <div className="flex items-center border rounded-md">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        className="rounded-r-none"
                                    >
                                        -
                                    </Button>
                                    <span className="px-4 py-2 min-w-[3rem] text-center border-x">
                                        {quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                                        disabled={quantity >= 10}
                                        className="rounded-l-none"
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    onClick={addToCart}
                                    className="flex-1"
                                    size="lg"
                                >
                                    <ShoppingCart size={20} className="mr-2" />
                                    Adicionar ao Carrinho
                                </Button>
                                <Button
                                    onClick={buyNow}
                                    variant="default"
                                    className="flex-1"
                                    size="lg"
                                >
                                    Comprar Agora
                                </Button>
                            </div>
                        </div>

                        {/* Informações adicionais */}
                        <div className="space-y-4">
                            <Separator />

                            <div>
                                <h3 className="font-semibold mb-2">Descrição do Produto</h3>
                                <p className="text-muted-foreground">
                                    Produto de alta qualidade com excelente custo-benefício.
                                    Ideal para o seu dia a dia, oferecendo praticidade e sabor.
                                </p>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Especificações</h3>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Peso:</span>
                                        <span>500g</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Marca:</span>
                                        <span>Genérica</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Validade:</span>
                                        <span>12 meses</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Origem:</span>
                                        <span>Brasil</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}