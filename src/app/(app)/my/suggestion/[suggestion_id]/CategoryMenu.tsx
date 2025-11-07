"use client";

import { MouseEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

type CategoryMenuProps = {
    title: string;
    categories: Array<{
        id: string;
        name: string;
        items: Array<{
            name: string;
            anchorId: string;
        }>;
    }>;
};

export default function CategoryMenu({ title, categories }: CategoryMenuProps) {
    const handleScroll = (event: MouseEvent<HTMLButtonElement>, id: string) => {
        event.preventDefault();
        const section = document.getElementById(id);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <Card className="flex flex-col w-[320px]">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary">
                    {title}
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col flex-1 gap-4 text-sm">
                <ScrollArea className="flex flex-col flex-grow h-0 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        {categories.map((category) => (
                            <div key={category.id} className="flex flex-col">
                                <Button
                                    variant="link"
                                    onClick={(event) => handleScroll(event, category.id)}
                                    className="text-left text-lg justify-start p-0 line-clamp-1 text-ellipsis whitespace-nowrap overflow-hidden w-full"
                                >
                                    {category.name}
                                </Button>
                                <div className="flex flex-col gap-1 text-foreground/80 ml-4">
                                    {category.items.map((item) => (
                                        <Button
                                            key={item.anchorId}
                                            variant="link"
                                            size="sm"
                                            onClick={(event) => handleScroll(event, item.anchorId)}
                                            className="text-left justify-start p-0 line-clamp-1 text-ellipsis whitespace-nowrap overflow-hidden w-full text-muted-foreground hover:text-foreground"
                                        >
                                            {item.name}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>

    );
}

