"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
    const pathname = usePathname();

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="flex items-center gap-4 text-sm font-medium text-muted-foreground md:gap-6">
            <Link href="/" className={cn("transition-colors hover:text-primary", isActive("/") && "text-primary")}>
                Início
            </Link>
            <Link href="/market" className={cn("transition-colors hover:text-primary", isActive("/market") && "text-primary")}>
                Mercados
            </Link>
        </nav >
    );
}