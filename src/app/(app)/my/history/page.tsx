import { getSuggestionById, getUserSuggestions } from "@/actions/suggestion.actions";
import RouterBack from "@/components/RouterBack";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { auth0 } from "@/lib/auth0";
import { Suggestion } from "@/types/suggestion";
import { ChefHat, ChevronLeft, ChevronRight, Clock, Package, ShoppingBag, SquareArrowOutUpRight } from "lucide-react";
import moment from "moment";
import "moment/locale/pt-br";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Smart Market - Histórico de Sugestões',
    description: 'Veja seu histórico de sugestões de produtos',
}

interface PageProps {
    searchParams: Promise<{ page?: string; size?: string }>;
}

export default async function History({ searchParams }: PageProps) {
    const session = await auth0.getSession();
    if (!session) {
        redirect('/auth/login');
    }

    const { page, size } = await searchParams;
    const currentPage = parseInt(page || '1', 10);
    const pageSize = parseInt(size || '10', 10);

    let suggestions: Suggestion[] = [];
    let meta = {
        total: 0,
        page: 1,
        size: 10,
        totalPages: 0,
        totalItems: 0
    };

    try {
        // Buscar lista de IDs das sugestões
        const response = await getUserSuggestions(currentPage, pageSize);
        meta = response.meta;

        // Buscar detalhes de cada sugestão individualmente
        const suggestionPromises = response.suggestions.map(suggestion =>
            getSuggestionById(suggestion.id).catch(() => null)
        );

        const fetchedSuggestions = await Promise.all(suggestionPromises);
        suggestions = fetchedSuggestions.filter((s): s is Suggestion => s !== null);
    } catch (error) {
        console.error('Erro ao buscar histórico de sugestões:', error);
    }

    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="flex flex-col gap-6 container mx-auto my-4">
                <div className="flex items-center gap-4">
                    <RouterBack />
                    <div className="flex items-center gap-3">
                        <ChefHat className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Histórico de Sugestões</h1>
                            <p className="text-sm text-muted-foreground">
                                {meta.totalItems} {meta.totalItems === 1 ? 'sugestão' : 'sugestões'} encontradas
                                {meta.totalPages > 1 && ` • Página ${meta.page} de ${meta.totalPages}`}
                            </p>
                        </div>
                    </div>
                </div>

                {suggestions.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                Nenhuma sugestão encontrada
                            </h3>
                            <p className="text-sm text-muted-foreground text-center max-w-md">
                                Você ainda não criou nenhuma sugestão. Comece criando uma sugestão de produtos para suas receitas!
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-4">
                        {suggestions.map((suggestion, index) => (
                            <div className="grid grid-cols-[auto_1fr] gap-4" key={suggestion.id}>
                                {/* Timeline */}
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-end min-w-[120px]">
                                        <span className="text-foreground font-medium text-sm">
                                            {moment(suggestion.createdAt).format('DD/MM/YYYY')}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {moment(suggestion.createdAt).format('HH:mm')}
                                        </span>
                                    </div>
                                    <div className="flex flex-col flex-1 items-center relative">
                                        <span
                                            className={`h-4 w-[2px] bg-primary absolute -top-4 ${index === 0 ? "hidden" : ""}`}
                                        />
                                        <span className="min-h-4 min-w-4 border-2 border-primary bg-background rounded-full" />
                                        <span
                                            className={`h-full w-[2px] bg-primary absolute -bottom-4 ${index === suggestions.length - 1 ? "hidden" : ""}`}
                                        />
                                    </div>
                                </div>

                                {/* Suggestion Card */}
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold text-foreground mb-2">
                                                    {suggestion.task}
                                                </CardTitle>
                                                <div className="flex flex-wrap gap-2">
                                                    <Badge variant="default" className="gap-1">
                                                        <Package className="h-3 w-3" />
                                                        {suggestion.data.items.filter(item => item.type === "essential").length} essenciais
                                                    </Badge>
                                                    <Badge variant="secondary" className="gap-1">
                                                        <ShoppingBag className="h-3 w-3" />
                                                        {suggestion.data.items.length} produtos
                                                    </Badge>
                                                    <Badge variant="outline" className="gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {moment(suggestion.createdAt).fromNow()}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {/* Produtos Essenciais Preview */}
                                            {(() => {
                                                const essentialProducts = suggestion.data.items.filter(item => item.type === "essential");
                                                return essentialProducts.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                                            Produtos Essenciais:
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {essentialProducts.slice(0, 5).map((product, idx) => (
                                                                <Badge key={idx} variant="outline" className="text-xs">
                                                                    {product.name}
                                                                </Badge>
                                                            ))}
                                                            {essentialProducts.length > 5 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{essentialProducts.length - 5} mais
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Utensílios Preview */}
                                            {(() => {
                                                const utensils = suggestion.data.items.filter(item => item.type === "utensil");
                                                return utensils.length > 0 && (
                                                    <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                                            Utensílios:
                                                        </p>
                                                        <div className="flex flex-wrap gap-1">
                                                            {utensils.slice(0, 3).map((utensil, idx) => (
                                                                <Badge key={idx} variant="secondary" className="text-xs">
                                                                    {utensil.name}
                                                                </Badge>
                                                            ))}
                                                            {utensils.length > 3 && (
                                                                <Badge variant="secondary" className="text-xs">
                                                                    +{utensils.length - 3} mais
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })()}

                                            {/* Botão para ver sugestão completa */}
                                            <div className="flex flex-1 items-center gap-2 pt-2">
                                                <Link href={`/my/suggestion/${suggestion.id}`}>
                                                    <Button variant="link">
                                                        <span>Ver Sugestão Completa</span>
                                                        <SquareArrowOutUpRight size={16} />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                )}

                {/* Paginação */}
                {meta.totalPages > 1 && (
                    <Card className="border-border">
                        <CardContent className="flex items-center justify-between py-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Mostrando {((meta.page - 1) * meta.size) + 1} a {Math.min(meta.page * meta.size, meta.totalItems)} de {meta.totalItems}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link href={`/my/history?page=${Math.max(1, meta.page - 1)}&size=${pageSize}`}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={meta.page === 1}
                                        className="gap-1"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Anterior
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (meta.totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (meta.page <= 3) {
                                            pageNum = i + 1;
                                        } else if (meta.page >= meta.totalPages - 2) {
                                            pageNum = meta.totalPages - 4 + i;
                                        } else {
                                            pageNum = meta.page - 2 + i;
                                        }

                                        return (
                                            <Link key={pageNum} href={`/my/history?page=${pageNum}&size=${pageSize}`}>
                                                <Button
                                                    variant={pageNum === meta.page ? "default" : "outline"}
                                                    size="sm"
                                                    className="min-w-[40px]"
                                                >
                                                    {pageNum}
                                                </Button>
                                            </Link>
                                        );
                                    })}
                                </div>
                                <Link href={`/my/history?page=${Math.min(meta.totalPages, meta.page + 1)}&size=${pageSize}`}>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={meta.page === meta.totalPages}
                                        className="gap-1"
                                    >
                                        Próxima
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </ScrollArea>
    );
}   