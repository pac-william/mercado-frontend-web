"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Edit2, Loader2, Trash2 } from "lucide-react";

import { Product } from "@/app/domain/productDomain";
import { formatPrice } from "@/app/utils/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { deleteProduct } from "@/actions/products.actions";

interface AdminProductCardProps {
    product: Product;
}

export function AdminProductCard({ product }: AdminProductCardProps) {
    const imageSrc =
        product.image && isValidUrl(product.image)
            ? product.image
            : "https://ibassets.com.br/ib.item.image.medium/m-20161111154302022002734292c24125421585da814b5db62401.jpg";

    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handleEdit = () => {
        startTransition(() => {
            router.push(`/admin/products/create?productId=${product.id}`);
        });
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteProduct(product.id);
            toast.success("Produto deletado com sucesso");
            startTransition(() => {
                router.refresh();
            });
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Erro ao deletar produto";
            toast.error(message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Card className="flex flex-col max-w-xs w-full bg-card border-border shadow-sm transition hover:shadow-md overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2 pt-4 px-4">
                <Badge variant="outline" className="text-xs text-muted-foreground border-border">
                    {product.category?.name ?? "Sem categoria"}
                </Badge>
            </CardHeader>

            <div className="relative w-full aspect-square">
                <Link href={`/product/${product.id}`} className="relative block w-full h-full">
                    <Image
                        src={imageSrc}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 300px"
                    />
                </Link>
            </div>

            <CardFooter className="flex flex-col gap-3 items-start p-4 pt-3 flex-1">
                <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm font-semibold line-clamp-2">{product.name}</p>
                    <p className="text-lg font-bold">{formatPrice(product.price)}</p>
                    <p className="text-xs text-muted-foreground">
                        Unidade: {product.unit ?? "unidade"} {product.sku ? `• SKU: ${product.sku}` : ""}
                    </p>
                </div>

                <div className="flex w-full gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={handleEdit}
                        disabled={isPending}
                    >
                        <Edit2 className="w-4 h-4 mr-2" />
                        {isPending ? "Abrindo..." : "Editar"}
                    </Button>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="flex-1" disabled={isDeleting}>
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Deletando...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Deletar
                                    </>
                                )}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="p-0 gap-0 bg-background border-border">
                            <AlertDialogHeader className="p-4">
                                <AlertDialogTitle className="text-foreground">Deletar produto</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                    Tem certeza que deseja deletar este produto? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Separator />
                            <AlertDialogFooter className="p-4">
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                                    Confirmar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardFooter>
        </Card>
    );
}

const isValidUrl = (value: string) => {
    try {
        new URL(value);
        return true;
    } catch {
        return false;
    }
};

