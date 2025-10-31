import { getProducts } from "@/actions/products.actions";
import { getSuggestionById } from "@/actions/suggestion.actions";
import ProductCard from "@/app/components/ProductCard";
import SearchAiBar from "@/app/components/SearchBar";
import { Product, ProductPaginatedResponse } from "@/app/domain/productDomain";
import RouterBack from "@/components/RouterBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Suggestion } from "@/types/suggestion";
import { ChefHat, Users } from "lucide-react";
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

    console.log(suggestionData.data.searchResults.productsBySearchTerm);

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
                                <ChefHat className="h-8 w-8 text-primary" />
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">
                                        Sugestão de Produtos
                                    </h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">
                                            {suggestionData.data.searchResults.statistics.totalProductsFound} produtos encontrados
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                Encontramos {suggestionData.data.searchResults.statistics.totalProductsFound} produtos
                                relacionados à sua busca em {suggestionData.data.searchResults.statistics.totalSearches} categorias diferentes.
                            </p>

                            {/* Produtos por Categoria */}
                            {suggestionData.data.searchResults.productsBySearchTerm.map((productSearchResult, searchTermIndex) => (
                                <Card key={searchTermIndex} className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold text-primary">
                                            {productSearchResult.categoryName}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Busca: &quot;{productSearchResult.searchTerm}&quot;
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <ProductSuggestion productName={productSearchResult.searchTerm} />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                    <div className="flex flex-col flex-1 w-full justify-center items-center px-4 py-8 absolute bottom-0 bg-background/50 backdrop-blur-sm border-t border-border z-50">
                        <SearchAiBar className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    );
}

async function ProductSuggestion({ productName }: { productName: string }) {
    const { products } = await getProducts({ name: productName, size: 20 }) as ProductPaginatedResponse;

    console.log(products);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} variant="suggestion" badgeText={product.unit} badgeVariant="secondary" />
            ))}
        </div>
    );
}