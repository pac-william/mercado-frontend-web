import LoadingSpinner from "@/components/LoadingSpinner";
import RouterBack from "@/components/RouterBack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { ChefHat } from "lucide-react";

export default function Loading() {
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
                                Carregando sugestões...
                            </p>
                        </div>
                    </div>
                </div>

                {/* Skeleton Loaders */}
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((index) => (
                        <div className="grid grid-cols-[auto_1fr] gap-4" key={index}>
                            {/* Timeline */}
                            <div className="flex gap-4">
                                <div className="flex flex-col items-end min-w-[120px]">
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-4 w-16 mt-1" />
                                </div>
                                <div className="flex flex-col flex-1 items-center relative">
                                    <span
                                        className={`h-4 w-[2px] bg-primary ${index === 1 ? "hidden" : ""}`}
                                    />
                                    <span className="min-h-4 min-w-4 border-2 border-primary bg-background rounded-full" />
                                    <span
                                        className={`h-full w-[2px] bg-primary ${index === 3 ? "hidden" : ""}`}
                                    />
                                </div>
                            </div>

                            {/* Suggestion Card Skeleton */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 space-y-3">
                                            <Skeleton className="h-6 w-3/4" />
                                            <div className="flex flex-wrap gap-2">
                                                <Skeleton className="h-6 w-24" />
                                                <Skeleton className="h-6 w-28" />
                                                <Skeleton className="h-6 w-32" />
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <div className="flex flex-wrap gap-1">
                                                <Skeleton className="h-6 w-20" />
                                                <Skeleton className="h-6 w-24" />
                                                <Skeleton className="h-6 w-18" />
                                                <Skeleton className="h-6 w-22" />
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <Skeleton className="h-10 w-40" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>

                {/* Loading Indicator */}
                <div className="flex items-center justify-center py-8">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        </ScrollArea>
    );
}

