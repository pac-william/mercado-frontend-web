"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mic, SearchIcon, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function SearchAiBar() {

    const router = useRouter();

    const handleSubmitSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.push(`/suggestion/${1}`);
    }

    return (
        <form onSubmit={handleSubmitSearch}>
            <Card className="flex flex-row items-center w-[500px] shadow-md">
                <Button variant="ghost" size="icon_lg" className="rounded-none" type="button">
                    <Sparkles size={24} />
                </Button>
                <Input type="text" placeholder="O que gostaria de fazer hoje?" className="h-12 rounded-none border border-y-0" />
                <Button variant="ghost" size="icon_lg" className="rounded-none" type="button">
                    <Mic size={24} />
                </Button>
                <Separator orientation="vertical" />
                <Button variant="ghost" size="icon_lg" className="rounded-none" type="submit">
                    <SearchIcon size={24} />
                </Button>
            </Card>
        </form>
    )
}