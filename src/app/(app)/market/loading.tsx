"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const PLACEHOLDER_COUNT = 6;

export default function MarketsLoading() {
    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="container mx-auto flex flex-col gap-6 py-6">
                <header className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </header>

                <Separator />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
                        <Card key={index} className="h-full border-border bg-card">
                            <CardHeader className="flex flex-row items-start gap-4">
                                <Skeleton className="h-14 w-14 rounded-full" />
                                <div className="flex flex-1 flex-col gap-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-44" />
                                </div>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-3">
                                <Skeleton className="h-3 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                                <Skeleton className="h-8 w-24 rounded-md" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </ScrollArea>
    );
}

