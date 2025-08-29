import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, Sparkle, Sparkles } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="flex items-center">
            <Button variant="outline" size="icon_lg">
                <Sparkles size={24} />
            </Button>
            <Input type="text" placeholder="Pesquisar" className="h-12" />
            <Button variant="outline" size="icon_lg">
                <SearchIcon size={24} />
            </Button>
        </div>
    )
}