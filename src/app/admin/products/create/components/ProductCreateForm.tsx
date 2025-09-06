"use client"

import { createProduct } from "@/actions/products.actions";
import { Market } from "@/app/domain/market";
import CropperZoomSlider from "@/components/CropperZoomSlider";
import SingleImageUploader from "@/components/SingleImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProductDTO } from "@/dtos/productDTO";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ProductCreateFormProps {
    markets: Market[];
}

export const ProductCreateForm = ({ markets }: ProductCreateFormProps) => {
    const [productImage, setProductImage] = useState<string | null>(null);
    const [previewProduct, setPreviewProduct] = useState<ProductDTO | null>(null);

    // 1. Define your form.
    const form = useForm<z.infer<typeof ProductDTO>>({
        resolver: zodResolver(ProductDTO),
        defaultValues: {
            name: "",
            price: 0,
            marketId: "",
        },
    });

    const handleSetProductImage = useCallback((image: string) => {
        setProductImage(image);
    }, []);

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof ProductDTO>) {
        // Create a product object for preview and submission
        const productData: ProductDTO = {
            name: values.name,
            price: values.price,
            marketId: values.marketId,
        };

        createProduct(productData);
    }

    return (
            <Card>
                <CardHeader>
                    <CardTitle>Produto</CardTitle>
                    <CardDescription>Cadastro de Produto</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className="grid grid-cols-[auto_1fr] flex-1 gap-4">
                    <SingleImageUploader className="col-span-2" onImageChange={handleSetProductImage} />
                    <CropperZoomSlider image={productImage || "https://picsum.photos/400/512?random=1"} />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome do Produto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite o nome do produto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Preço</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="Digite o preço"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="marketId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mercado</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um mercado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {markets.map((market) => (
                                                    <SelectItem key={market.id} value={market.id}>
                                                        {market.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </CardContent>
                <Separator />
                <CardFooter>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        className="ml-auto"
                        disabled={!form.formState.isValid}
                    >
                        Cadastrar
                    </Button>
                </CardFooter>
            </Card>
    )
}
