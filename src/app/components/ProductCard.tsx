"use client"

import bh_supermercados from "@/../public/markets/bh_supermercados.png";
import InputPlusMinus from "@/components/input-plus-minus";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Edit2, ShoppingCart, Star, Trash2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { ProductCreateForm } from "../admin/products/create/components/ProductCreateForm";
import { Product } from "../domain/productDomain";
import { formatPrice } from "../utils/formatters";

interface ProductCardProps {
    product: Product;
    variant?: "quantity-select" | "buy-now" | "admin" | "history";
}

export default function ProductCard({ product, variant = "buy-now" }: ProductCardProps) {

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

    const addToCart = () => {
        toast.success("Produto adicionado ao carrinho");
    }

    const deleteProduct = () => {
        toast.success("Produto deletado");
    }

    switch (variant) {
        case "quantity-select":
            return (
                <Card className="flex flex-col max-w-xs w-full">
                    <CardHeader className="flex flex-row gap-2">
                        <Image src={bh_supermercados} alt="Product" width={100} height={100} className="object-cover rounded-full aspect-square w-12 h-12 shadow-md border" />
                        <div className="bg-white rounded-full flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Market 1</span>
                                <div className="flex flex-row gap-1">
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="p-0 relative w-full aspect-square">
                        <Image src={getImageSrc()} alt="Product" fill className="object-cover p-8" />
                    </CardContent>

                    <CardFooter className="flex flex-col flex-1 gap-2 items-start">
                        <p className="text-sm line-clamp-2">{product.name}</p>
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
                        <InputPlusMinus />
                        <div className="flex flex-row gap-2 items-end">
                            <Button variant="outline" size="icon">
                                <ShoppingCart size={16} />
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            );
        case "buy-now":
            return (
                <Card className="flex flex-col max-w-xs w-full">
                    <CardHeader className="flex flex-row gap-2">
                        <Image src={bh_supermercados} alt="Product" width={100} height={100} className="object-cover rounded-full aspect-square w-12 h-12 shadow-md border" />
                        <div className="bg-white rounded-full flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Market 1</span>
                                <div className="flex flex-row gap-1">
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="p-0 relative w-full aspect-square">
                        <Image src={getImageSrc()} alt="Product" fill className="object-cover p-8" />
                    </CardContent>

                    <CardFooter className="flex flex-col flex-1 gap-2 items-start">
                        <p className="text-sm line-clamp-2">{product.name}</p>
                        <div className="flex flex-row w-full justify-between mt-auto">
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
                            <div className="flex flex-row gap-2 items-end">
                                <Button variant="outline" size="icon" onClick={() => addToCart()} >
                                    <ShoppingCart size={16} />
                                </Button>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            );
        case "admin":
            return (
                <Card className="flex flex-col max-w-xs w-full">
                    <CardHeader className="flex flex-row gap-2 items-center justify-between">
                        <Badge variant={"outline"} >
                            Categoria
                        </Badge>
                        <div className="flex flex-row gap-2 items-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" >
                                        <Edit2 size={16} />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="p-0 gap-0 max-w-2xl">
                                    <DialogHeader className="p-4">
                                        <DialogTitle>Editar produto</DialogTitle>
                                        <DialogDescription>
                                            Aqui você pode editar as informações do produto.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Separator />
                                    <div className="p-4 flex flex-col gap-2">
                                        <ProductCreateForm markets={[]} />
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" >
                                        <Trash2 size={16} />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="p-0 gap-0">
                                    <AlertDialogHeader className="p-4">
                                        <AlertDialogTitle>Deletar produto</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Aqui você pode deletar o produto.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <Separator />
                                    <AlertDialogFooter className="p-4">
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteProduct()}>Deletar</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </div>
                    </CardHeader>

                    <Separator />

                    <CardHeader className="flex flex-row gap-2">
                        <Image src={bh_supermercados} alt="Product" width={100} height={100} className="object-cover rounded-full aspect-square w-12 h-12 shadow-md border" />
                        <div className="bg-white rounded-full flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold">Market 1</span>
                                <div className="flex flex-row gap-1">
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                    <Star size={16} className="text-yellow-500" />
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <Separator />

                    <CardContent className="p-0 relative w-full aspect-square">
                        <Image src={getImageSrc()} alt="Product" fill className="object-cover p-8" />
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2 items-start">
                        <p className="text-sm line-clamp-2">{product.name}</p>
                        <div className="flex flex-row w-full justify-between mt-auto">
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
                        </div>
                    </CardFooter>

                </Card>
            );
        case "history":
            return (
                <Card className="flex h-full flex-col max-w-xs w-full">
                    <CardContent className="p-0 relative w-full aspect-square">
                        <Image src={getImageSrc()} alt="Product" fill className="object-cover p-8" />
                    </CardContent>

                    <CardFooter className="flex flex-col flex-1 gap-2 items-start">
                        <p className="text-sm line-clamp-2">{product.name}</p>
                        <div className="flex flex-row w-full justify-between mt-auto">
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

                        </div>
                    </CardFooter>
                </Card>
            );
    }
}