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

export const metadata: Metadata = {
    title: 'Smart Market - Sugestão',
    description: 'Sugestão personalizada de produtos',
}

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

    return (
        <div className="flex flex-col flex-1">
            <div className="container mx-auto my-4">
                <RouterBack />
            </div>
            <div className="flex flex-col flex-1 justify-center items-center">
                <div className="flex flex-col flex-1 max-w-[50%] relative px-2">
                    <ScrollArea className="flex flex-col flex-grow h-0">
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
                                em {Object.keys(itemsByCategory).length} categorias diferentes.
                            </p>

                            {/* Produtos por Categoria */}
                            {Object.entries(itemsByCategory).map(([categoryName, items]) => (
                                <Card key={categoryName} className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold text-primary">
                                            {categoryName}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {items.map(item => (
                                            <ProductSuggestion key={item.name} productName={item.name} categoryId={item.categoryId} />
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                    {/* <div className="flex flex-col flex-1 w-full justify-center items-center px-4 py-8 absolute bottom-0 bg-background/50 backdrop-blur-sm border-t border-border z-50">
                        <SearchAiBar className="w-full" />
                    </div> */}
                </div>
            </div>
        </div>
    );
}

async function ProductSuggestion({ productName, categoryId }: { productName: string, categoryId: string }) {
    // Buscar produtos para cada nome (podemos otimizar isso depois)

    console.log(productName, categoryId);

    const { products } = await getProducts({ name: productName, categoryId: categoryId, size: 20 });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} variant="suggestion" badgeText={product.unit} badgeVariant="secondary" />
            ))}
            {/* Mostrar nomes que não foram encontrados como badges */}
            <Badge key={productName} variant="outline" className="w-fit">
                {productName}
            </Badge>
        </div>
    );
}