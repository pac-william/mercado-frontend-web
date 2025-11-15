import LoadingSpinner from "@/components/LoadingSpinner";
import RouterBack from "@/components/RouterBack";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col flex-1 container mx-auto my-4">
            <div className="flex flex-1 gap-4">
                {/* CategoryMenu Skeleton */}
                <Card className="flex flex-col w-[320px]">
                    <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 gap-4">
                        <ScrollArea className="flex flex-col flex-grow h-0 overflow-y-auto">
                            <div className="flex flex-col gap-4">
                                {[1, 2, 3].map((categoryIndex) => (
                                    <div key={categoryIndex} className="flex flex-col">
                                        <Skeleton className="h-5 w-full mb-2" />
                                        <div className="flex flex-col gap-1 ml-4">
                                            {[1, 2].map((itemIndex) => (
                                                <Skeleton key={itemIndex} className="h-4 w-3/4" />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Main Content Skeleton */}
                <div className="flex flex-col flex-1 pr-2">
                    <ScrollArea className="flex flex-col flex-grow h-0">
                        <RouterBack />
                        <div className="flex flex-col gap-4 p-4 mb-32">
                            {/* Header Skeleton */}
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Skeleton className="h-9 w-2/3 mb-4" />
                                    <div className="flex items-center gap-4 mt-2">
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-6 w-24" />
                                        <Skeleton className="h-6 w-24" />
                                    </div>
                                </div>
                            </div>

                            {/* Description Skeleton */}
                            <Skeleton className="h-5 w-full" />

                            {/* Essential Items Skeleton */}
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 3, 4].map((index) => (
                                        <Skeleton key={index} className="h-6 w-20" />
                                    ))}
                                </div>
                            </div>

                            {/* Category Cards Skeleton */}
                            {[1, 2, 3].map((categoryIndex) => (
                                <Card key={categoryIndex} className="bg-card border-border">
                                    <CardHeader>
                                        <Skeleton className="h-6 w-1/3" />
                                    </CardHeader>
                                    <CardContent className="flex flex-col gap-6">
                                        {[1, 2].map((itemIndex) => (
                                            <div key={itemIndex} className="flex flex-col gap-2">
                                                <Skeleton className="h-6 w-1/2" />
                                                {/* Product Grid Skeleton */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                                                    {[1, 2, 3, 4].map((productIndex) => (
                                                        <Card key={productIndex}>
                                                            <CardContent className="p-4">
                                                                <Skeleton className="h-32 w-full mb-2" />
                                                                <Skeleton className="h-4 w-full mb-1" />
                                                                <Skeleton className="h-4 w-2/3 mb-2" />
                                                                <Skeleton className="h-6 w-1/2" />
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            ))}

                            {/* Loading Indicator */}
                            <div className="flex items-center justify-center py-8">
                                <LoadingSpinner size="lg" />
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}

