"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SuggestionListItem } from "../domain/suggestionDomain";

export default function HistorySideMenu({ suggestions }: { suggestions: SuggestionListItem[] }) {
    const pathname = usePathname();

    const [open, setOpen] = useState(true);

    if(pathname !== '/') {
        return null;
    }

    return (
        <Card className={cn("min-w-16 rounded-none border-y-0 border-l-0 border-r border-border transition-all duration-300", open ? "w-64" : "w-0")}>
            <CardHeader className="flex flex-row items-center justify-between">
                {open && <CardTitle className="line-clamp-1">Histórico de Sugestões</CardTitle>}
                <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setOpen(!open)}>
                    {open ? <PanelLeftCloseIcon /> : <PanelLeftOpenIcon />}
                </Button>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
                <ScrollArea className={cn("flex flex-col flex-grow h-0 overflow-y-auto transition-all duration-300", open ? "opacity-100" : "opacity-0 pointer-events-none")}>
                    <div className="flex flex-col gap-4">
                        {suggestions.map((suggestion: SuggestionListItem) => (
                            <Link href={`/my/suggestion/${suggestion.id}`} key={suggestion.id}>
                                <p className="text-sm font-medium text-foreground line-clamp-1">{suggestion.task}</p>
                            </Link>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}