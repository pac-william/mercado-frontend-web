import RouterBack from "@/components/RouterBack";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <div className="flex flex-1 flex-row gap-4 container mx-auto">
            <Card className="flex flex-col w-[460px] rounded-none border-y-0">
                <CardHeader>
                    <Skeleton className="h-6 w-5/6" />
                </CardHeader>
                <Separator />
                <CardHeader className="flex flex-row py-2 gap-2">
                    <Skeleton className="h-8 w-28" />
                    <Skeleton className="h-8 w-36" />
                </CardHeader>
                <Separator />
                <CardContent className="flex flex-col flex-1 gap-4">
                    <ScrollArea className="flex flex-col flex-grow h-0 overflow-y-auto">
                        <div className="flex flex-col gap-4">
                            {[
                                { categoryWidth: "w-2/5", items: ["w-1/3", "w-2/5", "w-1/4"] },
                                { categoryWidth: "w-1/2", items: ["w-1/3", "w-1/3", "w-2/5"] },
                                { categoryWidth: "w-2/5", items: ["w-1/4", "w-1/3", "w-1/3"] },
                                { categoryWidth: "w-2/5", items: ["w-2/5", "w-1/4"] },
                                { categoryWidth: "w-1/2", items: ["w-1/3", "w-1/3"] },
                            ].map((category, categoryIndex) => (
                                <div key={categoryIndex} className="flex flex-col">
                                    <Skeleton className={`h-5 ${category.categoryWidth} mb-4`} />
                                    <div className="flex flex-col gap-1 ml-4">
                                        {category.items.map((itemWidth, itemIndex) => (
                                            <Skeleton key={itemIndex} className={`h-4 ${itemWidth}`} />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="flex flex-col flex-1 my-4">
                <div className="flex flex-1 gap-4">
                    <div className="flex flex-col flex-1 pr-2">
                        <ScrollArea className="flex flex-col flex-grow h-0">
                            <RouterBack />

                            <div className="flex flex-col gap-4 p-4">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <Skeleton className="h-9 w-48 mb-2" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((marketIndex) => (
                                        <Card key={marketIndex} className="flex flex-col gap-0 w-full">
                                            <CardHeader className="flex flex-row gap-4">
                                                <Avatar>
                                                    <AvatarFallback className="bg-muted">
                                                        <Skeleton className="w-10 h-10 rounded-full" />
                                                    </AvatarFallback>
                                                </Avatar>
                                                <CardTitle>
                                                    <Skeleton className="h-5 w-24" />
                                                </CardTitle>
                                            </CardHeader>
                                            <Separator />
                                            <CardContent className="flex flex-col gap-2">
                                                <Skeleton className="h-6 w-20" />
                                                <Skeleton className="h-4 w-32" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 p-4 mb-32">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <Skeleton className="h-9 w-64 mb-2" />
                                        <Skeleton className="h-4 w-48 mt-1" />
                                    </div>
                                </div>

                                {[1, 2, 3].map((categoryIndex) => (
                                    <Card key={categoryIndex} className="bg-card border-border">
                                        <CardHeader>
                                            <Skeleton className="h-6 w-32" />
                                        </CardHeader>
                                        <CardContent className="flex flex-col gap-6">
                                            {[1, 2].map((itemIndex) => (
                                                <div key={itemIndex} className="flex flex-col gap-2">
                                                    <Skeleton className="h-6 w-40" />
                                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                                                        {[1, 2, 3, 4].map((productIndex) => (
                                                            <Card key={productIndex}>
                                                                <CardContent className="p-4">
                                                                    <Skeleton className="h-32 w-full mb-2 rounded-md" />
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
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </div>
    );
}

