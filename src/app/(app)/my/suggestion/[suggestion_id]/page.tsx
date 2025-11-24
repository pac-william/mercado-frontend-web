import { getMarkets } from "@/actions/market.actions";
import { getProducts } from "@/actions/products.actions";
import { getSuggestionById } from "@/actions/suggestion.actions";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/domain/productDomain";
import { formatPrice } from "@/app/utils/formatters";
import RouterBack from "@/components/RouterBack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Suggestion, SuggestionItem } from "@/types/suggestion";
import "moment/locale/pt-br";
import { Metadata } from "next";
import Link from "next/link";
import CategoryMenu from "./CategoryMenu";

export const metadata: Metadata = {
    title: 'Smart Market - Sugestão',
    description: 'Sugestão personalizada de produtos',
}

const formatCategoryId = (name: string) =>
    name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

const formatProductAnchorId = (categoryName: string, productName: string) =>
    `${formatCategoryId(categoryName)}-${formatCategoryId(productName)}`;

export default async function SuggestionPage({ params, searchParams }: { params: Promise<{ suggestion_id: string }>, searchParams: Promise<{ marketId: string }> }) {
    const suggestion_id = (await params).suggestion_id;
    const marketId = (await searchParams).marketId;

    let suggestionData = null;

    try {
        suggestionData = await getSuggestionById(suggestion_id) as Suggestion;
    } catch (error) {
        console.error('Erro ao buscar sugestão:', error);
    }

    if (!suggestionData) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center">
                <p className="text-muted-foreground">Nenhuma sugestão encontrada</p>
            </div>
        );
    }

    // Agrupar items por categoria para exibição
    const itemsByCategory = suggestionData.data.items.reduce((acc, item) => {
        if (!acc[item.categoryName]) {
            acc[item.categoryName] = [];
        }
        acc[item.categoryName].push(item);
        return acc;
    }, {} as Record<string, typeof suggestionData.data.items>);

    const categorySections = Object.entries(itemsByCategory).map(([categoryName, items]) => ({
        id: formatCategoryId(categoryName),
        name: categoryName,
        items: items.map((item) => ({
            ...item,
            anchorId: formatProductAnchorId(categoryName, item.name),
        })),
    }));

    const menuCategories = categorySections.map(({ id, name, items }) => ({
        id,
        name,
        items: items.map(({ name, anchorId }) => ({
            name,
            anchorId,
        })),
    }));

    const { markets } = await getMarkets();

    // Calcular preços para cada mercado
    const marketCalculations = await Promise.all(
        markets.map(async (market) => {
            const calculation = await calculateMarketPrice(market.id, suggestionData.data.items);
            return {
                market,
                ...calculation,
            };
        })
    );

    return (
        <div className="flex flex-1 flex-row gap-4 container mx-auto">
            <CategoryMenu
                title={suggestionData.task}
                categories={menuCategories}
                receipt={suggestionData.data.receipt || undefined}
            />
            <div className="flex flex-col flex-1  my-4">
                <div className="flex flex-1 gap-4">
                    <div className="flex flex-col flex-1 pr-2">
                        <ScrollArea className="flex flex-col flex-grow h-0">
                            <RouterBack />
                            {/* Header da sugestão */}
                            <div className="flex flex-col gap-4 p-4">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-foreground">
                                            Melhores preços
                                        </h1>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {marketCalculations.slice(0, 4).map(({ market, totalPrice, itemsFound, totalItems }) => {
                                        const isSelected = marketId === market.id;
                                        return (
                                            <Link key={market.id} href={`/my/suggestion/${suggestion_id}?marketId=${market.id}`} className="flex flex-1">
                                                <Card className={cn(
                                                    "flex flex-col gap-0 transition-all w-full hover:bg-accent",
                                                    isSelected && "ring-2 ring-primary/50 bg-accent"
                                                )}>
                                                    <CardHeader className="flex flex-row gap-4">
                                                        <Avatar>
                                                            <AvatarImage src={market.profilePicture || ""} alt={market.name} width={100} height={100} />
                                                            <AvatarFallback className="bg-primary text-primary-foreground">CN</AvatarFallback>
                                                        </Avatar>
                                                        <CardTitle>
                                                            {market.name}
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <Separator />
                                                    <CardContent className="flex flex-col gap-2">
                                                        <span className="text-lg font-bold text-foreground">
                                                            Total: {formatPrice(totalPrice)}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            {itemsFound} de {totalItems} itens encontrados
                                                        </span>
                                                    </CardContent>
                                                </Card>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>


                            {marketId ? (
                                <div className="flex flex-col gap-4 p-4 mb-32">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <h1 className="text-3xl font-bold text-foreground">
                                                {suggestionData.task}
                                            </h1>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Produtos do mercado selecionado
                                            </p>
                                        </div>
                                    </div>

                                    {/* Produtos por Categoria */}
                                    {categorySections.map(({ id, name, items }) => (
                                        <Card
                                            key={id}
                                            id={id}
                                            className="bg-card border-border"
                                        >
                                            <CardHeader>
                                                <CardTitle className="text-xl font-semibold text-primary">
                                                    {name}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex flex-col gap-6">
                                                {items.map(item => (
                                                    <div key={item.anchorId} id={item.anchorId} className="flex flex-col gap-2">
                                                        <h3 className="text-lg font-medium text-foreground">
                                                            {item.name}
                                                        </h3>
                                                        <ProductSuggestion productName={item.name} categoryId={item.categoryId} marketId={marketId} />
                                                    </div>
                                                ))}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 px-4">
                                    <p className="text-lg text-muted-foreground text-center">
                                        Selecione um mercado acima para ver os produtos disponíveis
                                    </p>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}

const isValidObjectId = (value?: string) => {
    if (!value) return false;
    return /^[0-9a-fA-F]{24}$/.test(value);
};

interface MarketPriceCalculation {
    totalPrice: number;
    itemsFound: number;
    totalItems: number;
}

async function calculateMarketPrice(
    marketId: string,
    suggestionItems: SuggestionItem[]
): Promise<MarketPriceCalculation> {
    let totalPrice = 0;
    let itemsFound = 0;
    const totalItems = suggestionItems.length;

    // Buscar produtos para cada item da sugestão neste mercado
    for (const item of suggestionItems) {
        const filters: { name: string; categoryId?: string; marketId?: string } = {
            name: item.name,
            marketId: marketId,
        };

        /* if (isValidObjectId(item.categoryId)) {
            filters.categoryId = item.categoryId;
        } */

        try {
            const { products } = await getProducts(filters);

            if (products.length > 0) {
                // Pegar o produto mais barato disponível
                const cheapestProduct = products.reduce((min, product) =>
                    product.price < min.price ? product : min
                );
                totalPrice += cheapestProduct.price;
                itemsFound++;
            }
        } catch (error) {
            console.error(`Erro ao buscar produto ${item.name} para mercado ${marketId}:`, error);
        }
    }

    return {
        totalPrice,
        itemsFound,
        totalItems,
    };
}

async function ProductSuggestion({ productName, categoryId, marketId }: { productName: string, categoryId: string, marketId?: string }) {
    // Se não houver marketId selecionado, não mostrar produtos
    if (!marketId) {
        return null;
    }

    const filters: { name: string; categoryId?: string; marketId?: string } = {
        name: productName,
        /* size: 20,
        marketId: marketId, // Garantir que sempre filtra por mercado */
    };

    if (isValidObjectId(categoryId)) {
        filters.categoryId = categoryId;
    }

    let products: Product[] = [];
    try {
        const response = await getProducts(filters);
        products = response.products;
    } catch (error) {
        console.error("Erro ao buscar produtos para sugestão:", error);
    }

    if (products.length === 0) {
        return (
            <p className="text-sm text-muted-foreground italic">
                Nenhum produto encontrado para este item
            </p>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} variant="suggestion" badgeText={product.unit} badgeVariant="secondary" />
            ))}
        </div>
    );
}