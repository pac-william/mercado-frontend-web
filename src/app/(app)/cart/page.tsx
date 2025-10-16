'use client';

import { validateCoupon } from "@/actions/coupon.actions";
import { getMarkets } from "@/actions/market.actions";
import { getProducts } from "@/actions/products.actions";
import ProductCard from "@/app/components/ProductCard";
import { formatPrice } from "@/app/utils/formatters";
import RouterBack from "@/components/RouterBack";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SelectMethod from "./components/SelectMethod";

export default function Cart() {
    const [products, setProducts] = useState<any[]>([]);
    const [markets, setMarkets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [validating, setValidating] = useState(false);

    const deliveryFee = 10;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [productsData, marketsData] = await Promise.all([
                getProducts(),
                getMarkets()
            ]);
            setProducts(productsData.products || []);
            setMarkets(marketsData.markets || []);
        } catch (error) {
            toast.error("Erro ao carregar dados");
        } finally {
            setLoading(false);
        }
    };

    const cartItems = products.slice(0, 8).map(product => ({
        ...product,
        quantity: Math.floor(Math.random() * 3) + 1
    }));

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = subtotal - couponDiscount + deliveryFee;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;

        setValidating(true);
        try {
            const result = await validateCoupon({
                code: couponCode.trim().toUpperCase(),
                orderTotal: subtotal
            });

            if (result.isValid && result.discount) {
                setAppliedCoupon(couponCode.trim().toUpperCase());
                setCouponDiscount(result.discount);
                toast.success(`Cupom aplicado! Desconto de ${formatPrice(result.discount)}`);
                setCouponCode("");
            } else {
                toast.error(result.message || "Cupom inválido");
            }
        } catch (error) {
            toast.error("Erro ao validar cupom");
        } finally {
            setValidating(false);
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(undefined);
        setCouponDiscount(0);
        toast.info("Cupom removido");
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-4 container mx-auto my-4">
                    <RouterBack />
                    <h1 className="text-2xl font-bold text-foreground">Carrinho</h1>
                    <Carousel className="w-full">
                        <CarouselContent className="flex flex-1">
                            {markets.slice(0, 8).map((market) => {
                                return (
                                    <CarouselItem key={market.id} className="max-w-[320px] min-w-[320px] basis-1/4">
                                        <Card className="flex flex-1 flex-row gap-2 p-4 shadow-none bg-card border-border">
                                            <Avatar className="w-10 h-10 shadow-md">
                                                <AvatarImage src={market.logo} alt={market.name} width={100} height={100} className="rounded-full" />
                                                <AvatarFallback className="bg-primary text-primary-foreground">{market.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="text-card-foreground font-medium">{market.name}</span>
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
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {
                                    products.map((product) => {
                                        return (
                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                                variant="quantity-select"
                                            />
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <div className="w-[380px] h-[calc(100vh-113px)] sticky top-4">
                            <div className="flex flex-col gap-4 h-full">
                                <SelectMethod />
                                <Card className="flex flex-col flex-1 bg-card border-border">
                                    <CardContent className="flex flex-1 flex-col gap-2">
                                        <ScrollArea className="flex flex-col flex-grow h-0 pr-4 gap-2">
                                            <h1 className="text-lg font-bold text-card-foreground">Itens:</h1>
                                            <div className="flex flex-col">
                                                {cartItems.map((item) => {
                                                    return (
                                                        <div key={item.id} className="grid grid-cols-8 gap-2">
                                                            <div className="flex col-span-2 gap-2">
                                                                <span className="text-sm text-card-foreground">{item.quantity}</span>
                                                                <span className="text-sm text-muted-foreground">un</span>
                                                            </div>
                                                            <span className="text-sm col-span-4 truncate text-nowrap text-card-foreground">{item.name}</span>
                                                            <span className="text-sm col-span-2 text-card-foreground font-medium">{formatPrice(item.price * item.quantity)}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </ScrollArea>
                                        <Separator />
                                        
                                        <div className="flex flex-col gap-2 p-3 bg-muted/50 rounded-lg">
                                            <span className="text-sm font-medium text-card-foreground">
                                                Cupom de Desconto
                                            </span>
                                            
                                            {appliedCoupon ? (
                                                <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                                            {appliedCoupon}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        onClick={handleRemoveCoupon}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-auto p-1 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Digite o código"
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                        disabled={validating}
                                                        className="flex-1"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleApplyCoupon();
                                                            }
                                                        }}
                                                    />
                                                    <Button 
                                                        onClick={handleApplyCoupon} 
                                                        disabled={!couponCode.trim() || validating}
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        {validating ? "..." : "Aplicar"}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <Separator />
                                        <div className="flex flex-col gap-1">
                                            {couponDiscount > 0 && (
                                                <div className="flex justify-between">
                                                    <span className="text-sm text-green-600 dark:text-green-400">
                                                        Desconto ({appliedCoupon})
                                                    </span>
                                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                                        -{formatPrice(couponDiscount)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex justify-between">
                                                <span className="text-sm text-card-foreground">Frete</span>
                                                <span className="text-sm text-card-foreground">{formatPrice(deliveryFee)}</span>
                                            </div>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between">
                                            <span className="text-card-foreground">SubTotal</span>
                                            <span className="font-medium text-card-foreground">{formatPrice(subtotal)}</span>
                                        </div>
                                    </CardContent>
                                    <Separator />
                                    <CardFooter className="flex flex-row justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-muted-foreground">Total</span>
                                            <span className="text-lg font-bold text-card-foreground">{formatPrice(total)}</span>
                                        </div>
                                        <div>
                                            <Button asChild>
                                                <Link href="/checkout">
                                                Continuar para o Checkout
                                                </Link>
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