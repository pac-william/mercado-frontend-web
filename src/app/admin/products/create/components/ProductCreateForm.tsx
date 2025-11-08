"use client"

import { useCallback, useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { createProduct, updateProduct } from "@/actions/products.actions";
import type { Category } from "@/app/domain/categoryDomain";
import type { Product } from "@/app/domain/productDomain";
import CropperZoomSlider from "@/components/cropper-zoom-slider";
import SingleImageUploader from "@/components/single-image-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ProductDTO } from "@/dtos/productDTO";

type ProductFormValues = z.infer<typeof ProductDTO>;

interface ProductCreateFormProps {
    marketId: string;
    marketName?: string;
    categories: Category[];
}

interface ProductCreateFormProps {
    marketId: string;
    marketName?: string;
    categories: Category[];
    product?: Product;
}

export const ProductCreateForm = ({ marketId, marketName, categories, product }: ProductCreateFormProps) => {
    const [productImage, setProductImage] = useState<string | null>(product?.image ?? null);
    const initialCategoryId = product?.categoryId ?? categories[0]?.id ?? "";
    const router = useRouter();
    const isEditing = Boolean(product);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(ProductDTO) as Resolver<ProductFormValues>,
        defaultValues: {
            name: product?.name ?? "",
            price: (product?.price ?? undefined) as unknown as number,
            marketId,
            unit: product?.unit ?? "unidade",
            categoryId: initialCategoryId,
            sku: product?.sku ?? "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        form.setValue("marketId", marketId);
    }, [marketId, form]);

    useEffect(() => {
        if (categories.length > 0) {
            const current = form.getValues("categoryId");
            if (!current) {
                form.setValue("categoryId", categories[0].id);
            }
        }
    }, [categories, form]);

    const handleSetProductImage = useCallback((image: string) => {
        // Salva a URL da imagem diretamente
        setProductImage(image);
    }, []);

    async function onSubmit(values: ProductFormValues) {
        const productData: ProductDTO = {
            name: values.name,
            price: values.price,
            marketId,
            categoryId: values.categoryId,
            sku: values.sku?.trim() || undefined,
            unit: values.unit || "unidade",
            image: productImage || undefined,
        };

        try {
            if (isEditing && product) {
                await updateProduct(product.id, productData);
                toast.success("Produto atualizado com sucesso");
            } else {
                await createProduct(productData);
                toast.success("Produto cadastrado com sucesso");
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro ao cadastrar produto";
            toast.error(message);
            return;
        }

        router.push("/admin/products");
    }

    return (
        <Card className="w-full shadow-lg border-border">
            <CardHeader>
                <CardTitle>Produto</CardTitle>
                <CardDescription>Cadastro de Produto</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="w-full grid gap-6 lg:gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
                <div className="flex flex-col items-center justify-start gap-4 w-full">
                    {productImage ? (
                        <CropperZoomSlider image={productImage} />
                    ) : (
                        <SingleImageUploader onImageChange={handleSetProductImage} />
                    )}
                    <p className="text-sm text-muted-foreground text-center">
                        Faça upload da imagem do produto para destacar o item no catálogo.
                    </p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
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
                                                        value={field.value && !Number.isNaN(field.value) ? field.value : ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (!value) {
                                                                field.onChange(undefined as unknown as number);
                                                            } else {
                                                                field.onChange(parseFloat(value));
                                                            }
                                                        }}
                                                    />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione a categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="sku"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>SKU (opcional)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Código interno do produto"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="unit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Unidade de medida</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: unidade, kg, litro" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="marketId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mercado vinculado</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col gap-2">
                                            <Input
                                                value={marketName ?? "Mercado vinculado"}
                                                disabled
                                                readOnly
                                            />
                                            <input type="hidden" {...field} />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-end">
                <Button
                    onClick={form.handleSubmit(onSubmit)}
                    className="min-w-[160px]"
                    disabled={!form.formState.isValid}
                >
                    {isEditing ? "Salvar alterações" : "Cadastrar"}
                </Button>
            </CardFooter>
        </Card >
    )
}
