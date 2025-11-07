"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
    LayoutDashboard, 
    Package, 
    Truck, 
    Users, 
    FileText,
    ShoppingCart,
    LogOut
} from "lucide-react";

const menuItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Produtos",
        href: "/admin/products",
        icon: Package,
    },
    {
        title: "Entrega",
        href: "/admin/deliveries",
        icon: ShoppingCart,
    },
    {
        title: "Entregadores",
        href: "/admin/deliverers",
        icon: Truck,
    },
    {
        title: "Usuários",
        href: "/admin/users",
        icon: Users,
    },
    {
        title: "Relatórios",
        href: "/admin/reports",
        icon: FileText,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-border bg-background flex flex-col">
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            <span>{item.title}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-border">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
                    asChild
                >
                    {/* TODONAO TA FUNFANDO */}
                    <a href="/auth/logout" className="flex items-center gap-3 w-full">
                        <LogOut className="h-5 w-5" />
                        <span>Sair</span>
                    </a>
                </Button>
            </div>
        </aside>
    );
}

