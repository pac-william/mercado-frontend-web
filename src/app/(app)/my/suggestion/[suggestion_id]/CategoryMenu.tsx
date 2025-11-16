"use client";

import { MouseEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

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
    preparationMethods?: Array<{
        id: string;
        name: string;
        items: Array<{
            name: string;
            anchorId: string;
        }>;
    }>;
};

export default function CategoryMenu({ title, categories, preparationMethods }: CategoryMenuProps) {
    const [activeTab, setActiveTab] = useState<"ingredients" | "preparation-methods">("ingredients");

    const hasPreparationMethods = preparationMethods && preparationMethods.length > 0;

    return (
        <Card className="flex flex-col w-[320px]">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary">
                    {title}
                </CardTitle>
            </CardHeader>
            <Separator />
            {hasPreparationMethods && (
                <>
                    <CardHeader className="flex flex-row py-2">
                        <Button
                        variant={activeTab === "ingredients" ? "outline" : "ghost"}
                            onClick={() => setActiveTab("ingredients")}
                            size="sm"
                            className={cn(
                                "transition-colors"
                            )}
                        >
                            Ingredientes
                        </Button>
                        <Button
                            variant={activeTab === "preparation-methods" ? "outline" : "ghost"}
                            onClick={() => setActiveTab("preparation-methods")}
                            size="sm"
                            className={cn(
                                "transition-colors"
                            )}
                        >
                            Modo de Preparo
                        </Button>
                    </CardHeader>
                    <Separator />
                </>
            )}
            <CardContent className="flex flex-col flex-1 gap-4 text-sm">
                <ScrollArea className="flex flex-col flex-grow h-0 overflow-y-auto">
                    {activeTab === "ingredients" && <IngredientsList ingredients={categories} />}
                    {activeTab === "preparation-methods" && hasPreparationMethods && (
                        <PreparationMethodsList preparationMethods={preparationMethods} />
                    )}
                </ScrollArea>
            </CardContent>
        </Card>
    );
}

const IngredientsList = ({ ingredients }: {
    ingredients: Array<{
        id: string;
        name: string;
        items: Array<{
            name: string;
            anchorId: string;
        }>;
    }>
}) => {
    const handleScroll = (event: MouseEvent<HTMLButtonElement>, id: string) => {
        event.preventDefault();
        const section = document.getElementById(id);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return (
        <div className="flex flex-col gap-4">
            {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex flex-col">
                    <Button
                        variant="link"
                        onClick={(event) => handleScroll(event, ingredient.id)}
                        className="text-left text-lg justify-start p-0 line-clamp-1 text-ellipsis whitespace-nowrap overflow-hidden w-full"
                    >
                        {ingredient.name}
                    </Button>
                    <div className="flex flex-col gap-1 text-foreground/80 ml-4">
                        {ingredient.items.map((item) => (
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
    );
}

const PreparationMethodsList = ({ preparationMethods }: {
    preparationMethods: Array<{
        id: string;
        name: string;
        items: Array<{
            name: string;
            anchorId: string;
        }>;
    }>
}) => {
    const handleScroll = (event: MouseEvent<HTMLButtonElement>, id: string) => {
        event.preventDefault();
        const section = document.getElementById(id);
        section?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return (
        <div className="flex flex-col gap-4">
            {preparationMethods.map((preparationMethod) => (
                <div key={preparationMethod.id} className="flex flex-col">
                    <Button variant="link" onClick={(event) => handleScroll(event, preparationMethod.id)} className="text-left text-lg justify-start p-0 line-clamp-1 text-ellipsis whitespace-nowrap overflow-hidden w-full">
                        {preparationMethod.name}
                    </Button>
                    <div className="flex flex-col gap-1 text-foreground/80 ml-4">
                        {preparationMethod.items.map((item) => (
                            <Button key={item.anchorId} variant="link" size="sm" onClick={(event) => handleScroll(event, item.anchorId)} className="text-left justify-start p-0 line-clamp-1 text-ellipsis whitespace-nowrap overflow-hidden w-full text-muted-foreground hover:text-foreground">
                                {item.name}
                            </Button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}