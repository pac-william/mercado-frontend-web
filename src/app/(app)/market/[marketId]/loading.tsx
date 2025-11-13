"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const PRODUCT_PLACEHOLDERS = 8;

export default function MarketDetailsLoading() {
    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="container mx-auto flex flex-col gap-6 py-6">
                <Card className="overflow-hidden border-border bg-card">
                    <div className="relative h-32 w-full sm:h-48">
                        <Skeleton className="h-full w-full" />
                    </div>
                    <CardHeader className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-6 w-40" />
                                <Skeleton className="h-4 w-64" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <Skeleton className="h-10 w-full max-w-sm" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: PRODUCT_PLACEHOLDERS }).map((_, index) => (
                            <Card key={index} className="border-border bg-card">
                                <Skeleton className="h-40 w-full rounded-t-md" />
                                <CardContent className="flex flex-col gap-3 py-4">
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-9 w-full rounded-md" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </ScrollArea>
    );
}


