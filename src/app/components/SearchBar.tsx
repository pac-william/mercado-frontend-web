import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SearchIcon, Sparkles } from "lucide-react";

export default function SearchBar() {
    return (
        <Card className="flex flex-row items-center w-[500px] shadow-md">
            <Button variant="ghost" size="icon_lg" className="rounded-r-none">
                <Sparkles size={24} />
            </Button>
            <Input type="text" placeholder="O que gostaria de fazer hoje?" className="h-12 rounded-none border border-y-0" />
            <Button variant="ghost" size="icon_lg" className="rounded-l-none">
                <SearchIcon size={24} />
            </Button>
        </Card>
    )
}