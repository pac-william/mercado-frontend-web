"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mic, SearchIcon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function SearchAiBar({ className }: { className?: string }) {

    const router = useRouter();

    const handleSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/suggestion/${1}`);
    }

    return (
        <form onSubmit={handleSubmitSearch} className={className}>
            <Card className="flex flex-row items-center shadow-md bg-card border-border">
                <Button variant="ghost" size="icon_lg" className="rounded-none hover:bg-accent hover:text-accent-foreground" type="button">
                    <Sparkles size={24} className="text-violet-400" />
                </Button>
                <Input type="text" placeholder="O que gostaria de fazer hoje?" className="h-12 rounded-none border border-y-0 bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary" />
                <Button variant="ghost" size="icon_lg" className="rounded-none hover:bg-accent hover:text-accent-foreground" type="button">
                    <Mic size={24} className="text-muted-foreground" />
                </Button>
                <Separator orientation="vertical" className="bg-border" />
                <Button variant="ghost" size="icon_lg" className="rounded-none hover:bg-accent hover:text-accent-foreground" type="submit">
                    <SearchIcon size={24} className="text-muted-foreground" />
                </Button>
            </Card>
        </form>
    )
}