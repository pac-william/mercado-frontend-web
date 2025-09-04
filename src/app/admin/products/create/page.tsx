"use client"

import ProductCard from "@/app/components/ProductCard";
import CropperZoomSlider from "@/components/CropperZoomSlider";
import RouterBack from "@/components/RouterBack";
import SingleImageUploader from "@/components/SingleImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Market, Product } from "@/lib/mock-data";
import { useCallback, useState } from "react";

const market: Market = {
    id: "1",
    name: "Market 1",
    address: "Address 1",
    phone: "Phone 1",
    rating: 1,
    deliveryFee: 1,
    minOrder: 1,
    category: "Category 1",
    profilePicture: "https://picsum.photos/256/256?random=1",
    distance: 1,
};

export default function CreateProduct() {
    const [productImage, setProductImage] = useState<string | null>(null);

    const [product, setProduct] = useState<Product>(
        {
            id: "1",
            name: "Product 1",
            description: "Description 1",
            price: 1,
            unit: "Unit 1",
            category: "Category 1",
            brand: "Brand 1",
            stock: 1,
            marketId: "1",
            images: ["https://picsum.photos/256/256?random=2"],
        }
    );

    const handleSetProductImage = useCallback((image: string) => {
        setProductImage(image);
        setProduct(prevProduct => ({ ...prevProduct, images: [image] }));
    }, []);
    
    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-4 container mx-auto my-4 mb-[120px]    ">
                    <RouterBack />
                    <h1 className="text-2xl font-bold">Cadastro de Produto</h1>
                    <div className="grid grid-cols-2 gap-4">
                        <Card >
                            <CardHeader>
                                <CardTitle>Produto</CardTitle>
                                <CardDescription>Cadastro de Produto</CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="grid grid-cols-[auto_1fr] flex-1 gap-4">
                                <SingleImageUploader className="col-span-2" onImageChange={handleSetProductImage} />
                                <CropperZoomSlider image={productImage || "https://picsum.photos/400/512?random=1"} />
                                <div className="flex flex-col gap-2">
                                    <div className="grid grid-cols-1 gap-2">
                                        <Label>Nome</Label>
                                        <Input placeholder="Nome" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Label>Descrição</Label>
                                        <Input placeholder="Descrição" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Label>Preço</Label>
                                        <Input placeholder="Preço" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Label>Unidade</Label>
                                        <Input placeholder="Unidade" />
                                    </div>
                                    <div className="grid grid-cols-1 gap-2">
                                        <Label>Categoria</Label>
                                        <Input placeholder="Categoria" />
                                    </div>
                                </div>
                            </CardContent>
                            <Separator />
                            <CardFooter>
                                <Button className="ml-auto">Cadastrar</Button>
                            </CardFooter>
                        </Card>
                        <ProductCard market={market} product={product} />
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}