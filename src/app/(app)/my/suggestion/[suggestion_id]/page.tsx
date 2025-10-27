import { getProductsById } from "@/actions/products.actions";
import { getSuggestionById } from "@/actions/suggestion.actions";
import ProductCard from "@/app/components/ProductCard";
import SearchAiBar from "@/app/components/SearchBar";
import { Product } from "@/app/domain/productDomain";
import RouterBack from "@/components/RouterBack";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
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
        suggestionData = await getSuggestionById(suggestion_id);
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

    // Extrair todos os IDs únicos dos produtos
    const getAllProductIds = () => {
        const ids: string[] = [];

        // IDs dos produtos encontrados nas buscas
        suggestionData.data.searchResults.productsBySearchTerm.forEach(result => {
            result.products.forEach(product => {
                ids.push(product.id);
            });
        });

        return [...new Set(ids)]; // Remove duplicatas
    };

    const productIds = getAllProductIds();

    // Buscar todos os produtos reais do backend
    const fetchedProducts = await Promise.all(
        productIds.map(id => getProductsById(id).catch(() => null))
    );

    // Criar um mapa de produtos por ID para acesso rápido
    const productMap = new Map<string, Product>();
    fetchedProducts.forEach(product => {
        if (product) {
            productMap.set(product.id, product);
        }
    });

    // Agrupar produtos por categoria
    const productsByCategory = suggestionData.data.searchResults.productsBySearchTerm.map(result => ({
        searchTerm: result.searchTerm,
        categoryName: result.categoryName,
        products: result.products.filter(product => productMap.has(product.id))
    }));

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

                            {/* Produtos Essenciais */}
                            {suggestionData.data.essential_products.length > 0 && (
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold text-primary">
                                            Produtos Essenciais
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {suggestionData.data.essential_products.map((product, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Badge variant="default">{product.categoryName}</Badge>
                                                    <span className="text-card-foreground">{product.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Produtos Comuns */}
                            {suggestionData.data.common_products.length > 0 && (
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold text-primary">
                                            Produtos Comuns
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {suggestionData.data.common_products.map((product, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Badge variant="secondary">{product.categoryName}</Badge>
                                                    <span className="text-card-foreground">{product.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Utensílios */}
                            {suggestionData.data.utensils.length > 0 && (
                                <Card className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold text-primary">
                                            Utensílios
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-2">
                                            {suggestionData.data.utensils.map((product, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <Badge variant="outline">{product.categoryName}</Badge>
                                                    <span className="text-card-foreground">{product.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Produtos por Categoria */}
                            {productsByCategory.map((category, categoryIndex) => (
                                <Card key={categoryIndex} className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold text-primary">
                                            {category.categoryName}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">
                                            Busca: &quot;{category.searchTerm}&quot;
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {category.products.map((product) => {
                                                const realProduct = productMap.get(product.id);

                                                if (!realProduct) {
                                                    return null;
                                                }

                                                return (
                                                    <ProductCard
                                                        key={product.id}
                                                        product={realProduct}
                                                        variant="suggestion"
                                                        badgeText={product.unit}
                                                        badgeVariant="secondary"
                                                    />
                                                );
                                            })}
                                        </div>
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
