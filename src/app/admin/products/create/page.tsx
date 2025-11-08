import Link from "next/link";

import { getMarketById } from "@/actions/market.actions";
import { getCategories } from "@/actions/categories.actions";
import { getUserByAuth0Id } from "@/actions/user.actions";
import { getProductsById } from "@/actions/products.actions";
import RouterBack from "@/components/RouterBack";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth0 } from "@/lib/auth0";
import { ProductCreateForm } from "./components/ProductCreateForm";
import type { Category } from "@/app/domain/categoryDomain";
import type { Product } from "@/app/domain/productDomain";

interface CreateProductPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function CreateProduct({ searchParams }: CreateProductPageProps) {
    const resolvedSearchParams = await searchParams;
    const productIdParam = resolvedSearchParams?.productId;
    const productId = Array.isArray(productIdParam) ? productIdParam[0] : productIdParam;

    const session = await auth0.getSession();

    if (!session?.user?.sub) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">Sessão inválida. Faça login novamente.</p>
            </div>
        );
    }

    const backendUser = await getUserByAuth0Id(session.user.sub);
    const marketId = backendUser.marketId;

    if (!marketId) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold">Nenhum mercado vinculado</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    Para cadastrar produtos, associe um mercado à sua conta.
                </p>
                <Button asChild>
                    <Link href="/admin/settings">Ir para configurações</Link>
                </Button>
            </div>
        );
    }

    let marketName: string | undefined;
    try {
        const market = await getMarketById(marketId);
        marketName = market.name;
    } catch (error) {
        console.error("Erro ao buscar mercado vinculado:", error);
    }

    let categories: Category[] = [];
    try {
        const categoriesResponse = await getCategories({ size: 200 });
        categories = categoriesResponse.categories;
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
    }

    if (categories.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-4">
                <h2 className="text-xl font-semibold">Nenhuma categoria disponível</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    Cadastre categorias antes de criar produtos.
                </p>
            </div>
        );
    }

    let existingProduct: Product | null = null;
    if (productId) {
        try {
            existingProduct = await getProductsById(productId);
        } catch (error) {
            console.error("Erro ao carregar produto para edição:", error);
        }
    }

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-full">
                <div className="flex flex-1 flex-col gap-6 w-full max-w-6xl mx-auto px-6 my-4 mb-[120px]">
                    <RouterBack />
                    <div>
                        <h1 className="text-2xl font-bold">
                            {existingProduct ? "Editar Produto" : "Cadastro de Produto"}
                        </h1>
                        <p className="text-muted-foreground">
                            {existingProduct
                                ? "Atualize as informações do produto selecionado."
                                : "Cadastre novos produtos no mercado vinculado."}
                        </p>
                    </div>

                    <ProductCreateForm
                        marketId={marketId}
                        marketName={marketName}
                        categories={categories}
                        product={existingProduct ?? undefined}
                    />

                </div>
            </ScrollArea>
        </div>
    )
}