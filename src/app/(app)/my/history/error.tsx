"use client";

import RouterBack from "@/components/RouterBack";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, ChefHat, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Erro ao carregar histórico de sugestões:', error);
    }, [error]);

    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="flex flex-col gap-6 container mx-auto my-4">
                <div className="flex items-center gap-4">
                    <RouterBack />
                    <div className="flex items-center gap-3">
                        <ChefHat className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Histórico de Sugestões</h1>
                        </div>
                    </div>
                </div>

                <Card className="border-destructive">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            Erro ao carregar histórico
                        </h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                            Não foi possível carregar o histórico de sugestões. Por favor, tente novamente.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="default"
                                onClick={() => reset()}
                                className="gap-2"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Tentar Novamente
                            </Button>
                            <Button
                                variant="outline"
                                asChild
                            >
                                <Link href="/">Voltar ao Início</Link>
                            </Button>
                        </div>
                        {error.message && (
                            <details className="mt-4 p-4 bg-muted rounded-lg max-w-md">
                                <summary className="text-xs font-medium cursor-pointer text-muted-foreground">
                                    Detalhes do erro
                                </summary>
                                <p className="text-xs text-destructive mt-2 font-mono">
                                    {error.message}
                                </p>
                            </details>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    );
}

