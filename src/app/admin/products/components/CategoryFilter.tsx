"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Category } from "@/app/domain/categoryDomain";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
    categories: Category[];
    paramName?: string;
    className?: string;
}

export default function CategoryFilter({
    categories,
    paramName = "categoryId",
    className,
}: CategoryFilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentCategory = searchParams.get(paramName) ?? "all";

    const options = useMemo(() => {
        return categories.map((category) => ({
            value: category.id,
            label: category.name,
        }));
    }, [categories]);

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value === "all") {
            params.delete(paramName);
        } else {
            params.set(paramName, value);
        }

        // Resetar paginação ao trocar filtro
        params.delete("page");

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
    };

    return (
        <Select value={currentCategory} onValueChange={handleChange}>
            <SelectTrigger className={cn("w-[220px]", className)}>
                <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Todas as categorias</SelectItem>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

