"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchFieldProps {
    /** Nome do parâmetro na URL (ex: 'search', 'query', 'filter') */
    paramName?: string;
    /** Placeholder do input */
    placeholder?: string;
    /** Largura do input */
    width?: string;
    /** Tempo de debounce em milissegundos */
    debounceMs?: number;
    /** Parâmetros que devem ser removidos quando uma nova busca é feita */
    clearParamsOnSearch?: string[];
    /** Classe CSS adicional para o container */
    className?: string;
}

export default function SearchField({
    paramName = "search",
    placeholder = "Pesquisar produto",
    width = "w-[300px]",
    debounceMs = 500,
    clearParamsOnSearch = ["page"],
    className = ""
}: SearchFieldProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchValue, setSearchValue] = useState(searchParams.get(paramName) || "");
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastSearchValueRef = useRef<string>("");

    const updateUrl = useCallback(() => {
        const params = new URLSearchParams(searchParams);
        
        if (searchValue.trim()) {
            params.set(paramName, searchValue.trim());
        } else {
            params.delete(paramName);
        }
        
        // Remove specified params when searching
        clearParamsOnSearch.forEach(param => {
            params.delete(param);
        });
        
        const queryString = params.toString();
        const newUrl = queryString ? `?${queryString}` : window.location.pathname;
        
        // Only push if the URL actually changed
        const currentUrl = window.location.pathname + window.location.search;
        if (newUrl !== currentUrl) {
            router.push(newUrl);
        }
    }, [searchValue, searchParams, paramName, clearParamsOnSearch, router]);

    useEffect(() => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Only update if the search value actually changed
        if (searchValue !== lastSearchValueRef.current) {
            lastSearchValueRef.current = searchValue;
            
            timeoutRef.current = setTimeout(() => {
                updateUrl();
            }, debounceMs);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchValue, updateUrl, debounceMs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    return (
        <div className={`flex flex-row ${className}`}>
            <Button variant="outline" size="icon" className="rounded-r-none border-r-0">
                <SearchIcon size={24} />
            </Button>
            <Input 
                className={`${width} bg-background rounded-l-none`}
                placeholder={placeholder}
                value={searchValue}
                onChange={handleInputChange}
            />
        </div>
    )
}