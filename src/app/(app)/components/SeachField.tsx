"use client";

import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

interface SearchFieldProps {
    paramName?: string;
    placeholder?: string;
    width?: string;
    debounceMs?: number;
    clearParamsOnSearch?: string[];
    className?: string;
}

export default function SearchField({
    paramName = "search",
    placeholder = "Buscar produto",
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
        <div className={`flex flex-row items-center gap-2 ${className}`}>
            <div className="relative flex items-center">
                <SearchIcon size={16} className="absolute left-3 text-muted-foreground pointer-events-none" />
                <Input 
                    className={`${width} h-9 rounded-full bg-muted/50 hover:bg-muted text-foreground border-border placeholder:text-muted-foreground focus:border-primary focus:ring-primary pl-9`}
                    placeholder={placeholder}
                    value={searchValue}
                    onChange={handleInputChange}
                />
            </div>
        </div>
    )
}