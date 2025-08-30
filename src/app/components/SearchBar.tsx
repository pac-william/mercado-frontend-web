import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mic, SearchIcon, Sparkles } from "lucide-react";
import Link from "next/link";

export default function SearchBar() {
    return (
        <Card className="flex flex-row items-center w-[500px] shadow-md">
            <Button variant="ghost" size="icon_lg" className="rounded-none">
                <Sparkles size={24} />
            </Button>
            <Input type="text" placeholder="O que gostaria de fazer hoje?" className="h-12 rounded-none border border-y-0" />
            <Button variant="ghost" size="icon_lg" className="rounded-none">
                <Mic size={24} />
            </Button>
            <Separator orientation="vertical" />
            <Button variant="ghost" size="icon_lg" className="rounded-none" asChild>
                <Link href={`/suggestion/${1}`}>
                    <SearchIcon size={24} />
                </Link>
            </Button>
        </Card>
    )
}