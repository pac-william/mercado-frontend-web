import { getProductsById } from "@/actions/products.actions";
import ProductCard from "@/app/components/ProductCard";
import SearchAiBar from "@/app/components/SearchBar";
import { Product } from "@/app/domain/productDomain";
import RouterBack from "@/components/RouterBack";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import suggestionData from "@/suggestion-mock.json";
import { ChefHat, Clock, Users } from "lucide-react";
import "moment/locale/pt-br";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Smart Market - Sugestão de Churrasco',
    description: 'Sugestão personalizada para seu churrasco',
}

export default async function SuggestionPage() {
    // Extrair todos os IDs únicos dos produtos do mock
    const getAllProductIds = () => {
        const ids: string[] = [];

        // IDs dos produtos principais
        suggestionData.items.forEach(category => {
            category.subcategories.forEach(subcategory => {
                subcategory.products.forEach(product => {
                    ids.push(product.id);
                });
            });
        });

        // IDs dos produtos recomendados opcionais
        suggestionData.recommended_but_optional.forEach(product => {
            ids.push(product.id);
        });

        return [...new Set(ids)]; // Remove duplicatas
    };

    const productIds = getAllProductIds();

    // Buscar todos os produtos reais do backend
    const products = await Promise.all(
        productIds.map(id => getProductsById(id).catch(() => null))
    );

    // Criar um mapa de produtos por ID para acesso rápido
    const productMap = new Map<string, Product>();
    products.forEach(product => {
        if (product) {
            productMap.set(product.id, product);
        }
    });

    // Calcular total dos produtos usando apenas dados do endpoint
    const calculateTotal = () => {
        let total = 0;
        suggestionData.items.forEach(category => {
            category.subcategories.forEach(subcategory => {
                subcategory.products.forEach(mockProduct => {
                    const realProduct = productMap.get(mockProduct.id);
                    if (realProduct) {
                        total += realProduct.price * mockProduct.quantity;
                    }
                });
            });
        });
        return total;
    };

    const total = calculateTotal();

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
                                    <h1 className="text-3xl font-bold text-foreground">Sugestão de {suggestionData.occasion}</h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Para {suggestionData.people} pessoas</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                Em um churrasco, geralmente calcula-se cerca de 300 a 400g de carne por pessoa, além de acompanhamentos e bebidas.
                                Para {suggestionData.people} pessoas, isso significa aproximadamente {Math.ceil(suggestionData.people * 0.35)}kg de carne.
                                Também é importante considerar acompanhamentos clássicos, carvão suficiente para manter a brasa acesa durante toda a refeição,
                                e bebidas para refrescar os convidados.
                            </p>

                            {/* Categorias de produtos */}
                            {suggestionData.items.map((category, categoryIndex) => (
                                <Card key={categoryIndex} className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold text-primary">
                                            {category.category}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {category.subcategories.map((subcategory, subIndex) => (
                                            <div key={subIndex} className="mb-6">
                                                <h3 className="text-lg font-medium mb-4 text-card-foreground">
                                                    {subcategory.name}
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                    {subcategory.products.map((mockProduct) => {
                                                        const realProduct = productMap.get(mockProduct.id);

                                                        if (!realProduct) {
                                                            return null; // Não renderiza produtos não encontrados
                                                        }

                                                        return (
                                                            <ProductCard
                                                                key={mockProduct.id}
                                                                product={realProduct}
                                                                variant="suggestion"
                                                                badgeText={`${mockProduct.quantity} ${mockProduct.unit}`}
                                                                badgeVariant="secondary"
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Produtos recomendados opcionais */}
                            {suggestionData.recommended_but_optional.length > 0 && (
                                <Card key={suggestionData.recommended_but_optional.length} className="bg-card border-border">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-semibold text-primary">
                                            Produtos Recomendados (Opcionais)
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                            {suggestionData.recommended_but_optional.map((mockProduct) => {
                                                const realProduct = productMap.get(mockProduct.id);

                                                if (!realProduct) {
                                                    return null; // Não renderiza produtos não encontrados
                                                }

                                                return (
                                                    <ProductCard
                                                        key={mockProduct.id}
                                                        product={realProduct}
                                                        variant="suggestion"
                                                        badgeText="Opcional"
                                                        badgeVariant="outline"
                                                    />
                                                );
                                            })}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Instruções */}
                            <Card className="bg-card border-border">
                                <CardHeader>
                                    <CardTitle className="text-xl font-semibold text-primary flex items-center gap-2">
                                        <Clock className="h-5 w-5" />
                                        Instruções Passo a Passo
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {suggestionData.instructions.map((instruction, index) => (
                                            <div key={index} className="flex gap-4">
                                                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                                                    {instruction.step}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-card-foreground mb-2">{instruction.description}</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {instruction.products_used.map((productName, productIndex) => (
                                                            <Badge key={productIndex} variant="outline" className="text-xs">
                                                                {productName}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </ScrollArea>
                    <div className="flex flex-col flex-1 w-full justify-center items-center px-4 py-8 absolute bottom-0 bg-background/50 backdrop-blur-sm border-t border-border z-50">
                        <SearchAiBar className="w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}