import { getProducts } from "@/actions/products.actions";
import { getCategories } from "@/actions/categories.actions";
import { getUserByAuth0Id } from "@/actions/user.actions";
import SearchField from "@/app/(app)/components/SeachField";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import CategoryFilter from "./components/CategoryFilter";
import { AdminProductCard } from "./components/AdminProductCard";

interface ProductsPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

const parseSearchParam = (param?: string | string[]): string | undefined => {
    if (!param) return undefined;
    if (Array.isArray(param)) return param[0];
    return param;
};

export default async function Products({ searchParams }: ProductsPageProps) {   
    const resolvedSearchParams = await searchParams;

    const session = await auth0.getSession();

    if (!session?.user?.sub) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <p className="text-muted-foreground">
                    Sessão inválida. Faça login novamente.
                </p>
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
                    Para gerenciar produtos, associe um mercado à sua conta.
                </p>
                <Button asChild>
                    <Link href="/admin/settings">
                        Ir para configurações
                    </Link>
                </Button>
            </div>
        );
    }

    const nameFilter = parseSearchParam(resolvedSearchParams?.search);
    const categoryFilter = parseSearchParam(resolvedSearchParams?.categoryId);
    const page = Number(parseSearchParam(resolvedSearchParams?.page)) || 1;
    const pageSize = Number(parseSearchParam(resolvedSearchParams?.size)) || 20;

    let categoriesResponse;
    let productsResponse;
    try {
        [categoriesResponse, productsResponse] = await Promise.all([
            getCategories({ size: 100 }),
            getProducts({
                page,
                size: pageSize,
                name: nameFilter,
                marketId,
                categoryId: categoryFilter,
            }),
        ]);
    } catch (error) {
        console.error("Erro ao carregar dados de produtos:", error);
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center space-y-2">
                    <p className="text-lg font-semibold">Não foi possível carregar os produtos</p>
                    <p className="text-sm text-muted-foreground">
                        Tente recarregar a página ou verifique sua conexão com o servidor.
                    </p>
                </div>
            </div>
        );
    }

    const products = Array.isArray(productsResponse.products) ? productsResponse.products : [];
    const totalProducts = productsResponse.meta?.total ?? products.length;
    const hasProducts = products.length > 0;

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-full">
                <div className="flex flex-1 flex-col gap-6 container mx-auto my-4 mb-[120px]">
                    <div className="flex flex-row gap-4 items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold">Produtos</h1>
                            <p className="text-sm text-muted-foreground">
                                Gerencie os produtos do seu mercado
                            </p>
                        </div>
                        <Button asChild>
                            <Link href="/admin/products/create">
                                Cadastrar Produto
                            </Link>
                        </Button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                            <SearchField
                                placeholder="Buscar produto por nome"
                                className="max-w-full lg:max-w-md"
                                width="w-full"
                            />
                            <CategoryFilter
                                categories={categoriesResponse.categories}
                                className="w-full lg:w-[220px]"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {totalProducts === 1
                                ? "1 produto encontrado"
                                : `${totalProducts} produtos encontrados`}
                        </p>
                    </div>

                    {hasProducts ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                            {products.map((product) => (
                                <AdminProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-1 items-center justify-center py-20 border border-dashed border-border rounded-lg bg-muted/20">
                            <div className="text-center space-y-2">
                                <p className="text-lg font-medium">Nenhum produto encontrado</p>
                                <p className="text-sm text-muted-foreground">
                                    Ajuste os filtros ou cadastre um novo produto.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}