import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { History, ShoppingCart, User } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="flex w-full justify-between items-center p-4 bg-white border-b border-gray-200">
            <h1 className="text-2xl font-bold text-black container mx-auto">
                <Link href="/">
                    Smart Market
                </Link>
            </h1>
            <div className="ml-auto flex flex-row gap-2">
                <Button variant="outline" size="icon_lg" asChild className="relative">
                    <Link href="/cart">
                        <ShoppingCart size={24} />
                        <Badge className="absolute -top-2 -right-2 rounded-full bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center">19</Badge>
                    </Link>
                </Button>
                <Button variant="outline" size="icon_lg" asChild>
                    <Link href="/history">
                        <History size={24} />
                    </Link>
                </Button>
                <Button variant="outline" size="icon_lg" asChild>
                    <Link href="/profile">
                        <User size={24} />
                    </Link>
                </Button>
            </div>
        </header>
    )
}