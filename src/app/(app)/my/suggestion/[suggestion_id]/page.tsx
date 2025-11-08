import { getProducts } from "@/actions/products.actions";
import { getSuggestionById } from "@/actions/suggestion.actions";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/domain/productDomain";
import RouterBack from "@/components/RouterBack";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suggestion } from "@/types/suggestion";
import { Package, ShoppingBag, Utensils } from "lucide-react";
import "moment/locale/pt-br";
import { Metadata } from "next";
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

export default async function SuggestionPage({ params }: { params: Promise<{ suggestion_id: string }> }) {
    const suggestion_id = (await params).suggestion_id;

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

    const essentialItems = suggestionData.data.items.filter(item => item.type === "essential");
    const commonItems = suggestionData.data.items.filter(item => item.type === "common");
    const utensilItems = suggestionData.data.items.filter(item => item.type === "utensil");

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

    return (
        <div className="flex flex-col flex-1 container mx-auto my-4">
            <div className="flex flex-1 gap-4">
                <CategoryMenu title={suggestionData.task} categories={menuCategories} />
                <div className="flex flex-col flex-1 pr-2">
                    <ScrollArea className="flex flex-col flex-grow h-0">
                        <RouterBack />
                        {/* Header da sugestão */}
                        <div className="flex flex-col gap-4 p-4 mb-32">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">
                                        {suggestionData.task}
                                    </h1>
                                    <div className="flex items-center gap-4 mt-2">
                                        <Badge variant="default" className="gap-1">
                                            <Package className="h-3 w-3" />
                                            {essentialItems.length} essenciais
                                        </Badge>
                                        <Badge variant="secondary" className="gap-1">
                                            <ShoppingBag className="h-3 w-3" />
                                            {commonItems.length} comuns
                                        </Badge>
                                        <Badge variant="outline" className="gap-1">
                                            <Utensils className="h-3 w-3" />
                                            {utensilItems.length} utensílios
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                Encontramos {suggestionData.data.items.length} produtos
                                em {categorySections.length} categorias diferentes.
                            </p>

                            {/* Lista dos produtos necessários */}
                            <div className="flex flex-col gap-2">
                                {essentialItems.map(item => (
                                    <Badge key={item.name} variant="outline" className="text-xs">
                                        {item.name}
                                    </Badge>
                                ))}
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
                                                <ProductSuggestion productName={item.name} categoryId={item.categoryId} />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}

const isValidObjectId = (value?: string) => {
    if (!value) return false;
    return /^[0-9a-fA-F]{24}$/.test(value);
};

async function ProductSuggestion({ productName, categoryId }: { productName: string, categoryId: string }) {
    const filters: { name: string; size: number; categoryId?: string } = {
        name: productName,
        size: 20,
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

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} variant="suggestion" badgeText={product.unit} badgeVariant="secondary" />
            ))}
        </div>
    );
}