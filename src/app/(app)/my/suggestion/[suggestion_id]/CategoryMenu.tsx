"use client";

import { ChefHat, ClipboardList, Clock, Users } from "lucide-react";
import { MouseEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Receipt } from "@/types/suggestion";

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
    receipt?: Receipt;
};

export default function CategoryMenu({ title, categories, receipt }: CategoryMenuProps) {
    const [activeTab, setActiveTab] = useState<"ingredients" | "preparation-methods">("ingredients");

    const hasReceipt = receipt !== undefined;

    return (
        <Card className="flex flex-col w-[460px] rounded-none border-y-0">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-primary">
                    {title}
                </CardTitle>
            </CardHeader>
            <Separator />
            {hasReceipt && (
                <>
                    <CardHeader className="flex flex-row py-2">
                        <Button
                        variant={activeTab === "ingredients" ? "outline" : "ghost"}
                            onClick={() => setActiveTab("ingredients")}
                            size="sm"
                            className={cn(
                                "transition-colors border border-transparent"
                            )}
                        >
                            Ingredientes
                        </Button>
                        <Button
                            variant={activeTab === "preparation-methods" ? "outline" : "ghost"}
                            onClick={() => setActiveTab("preparation-methods")}
                            size="sm"
                            className={cn(
                                "transition-colors border border-transparent"
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
                    {activeTab === "preparation-methods" && hasReceipt && (
                        <ReceiptView receipt={receipt} />
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

const ReceiptView = ({ receipt }: { receipt: Receipt }) => {
    return (
        <div className="flex flex-col gap-4">
            {/* Cabeçalho da Receita */}
            <div className="flex flex-col gap-2 pb-2 border-b">
                <h3 className="text-lg font-semibold text-primary">
                    {receipt.name}
                </h3>
                {receipt.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {receipt.description}
                    </p>
                )}
                <div className="flex flex-wrap gap-2 mt-1">
                    {receipt.prepTime > 0 && (
                        <Badge variant="secondary" className="text-xs font-medium flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {receipt.prepTime} min
                        </Badge>
                    )}
                    {receipt.servings > 0 && (
                        <Badge variant="secondary" className="text-xs font-medium flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {receipt.servings} {receipt.servings === 1 ? 'porção' : 'porções'}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Ingredientes */}
            {receipt.ingredients && receipt.ingredients.length > 0 && (
                <div className="flex flex-col gap-2">
                    <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <ClipboardList className="w-4 h-4" />
                        Ingredientes
                    </h4>
                    <ul className="flex flex-col gap-2 text-sm">
                        {receipt.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start gap-2">
                                <span className="text-primary font-medium min-w-[80px] text-xs">
                                    {ingredient.quantity}
                                </span>
                                <span className="text-foreground flex-1">
                                    {ingredient.name}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Instruções */}
            {receipt.instructions && receipt.instructions.length > 0 && (
                <div className="flex flex-col gap-2">
                    <h4 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <ChefHat className="w-4 h-4" />
                        Modo de Preparo
                    </h4>
                    <ol className="flex flex-col gap-3">
                        {receipt.instructions.map((instruction, index) => (
                            <li 
                                key={index} 
                                id={`receita-passo-${index + 1}`}
                                className="flex gap-3 group"
                            >
                                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                                    {index + 1}
                                </div>
                                <p className="flex-1 text-foreground text-sm leading-relaxed pt-0.5">
                                    {instruction}
                                </p>
                            </li>
                        ))}
                    </ol>
                </div>
            )}
        </div>
    );
}