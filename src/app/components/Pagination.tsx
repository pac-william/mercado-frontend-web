"use client"
import { Meta } from "@/app/domain/metaDomain"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Ellipsis } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useTransition } from "react"

interface PaginationProps {
    meta: Meta
}

export default function Pagination({ meta }: PaginationProps) {
    const searchParams = useSearchParams();
    const currentPage = parseInt(searchParams.get("page") || "1");
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (currentPage > meta?.totalPages) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("page", "1");

            startTransition(() => {
                router.push(`?${newParams.toString()}`);
            });
        }
    }, [currentPage, meta?.totalPages, router, searchParams]);

    if (!meta || typeof meta?.totalPages === 'undefined') {
        return null;
    }

    const isValidPage = (page: number) => {
        return page >= 1 && page <= meta.totalPages;
    };

    const handlePageChange = (page: number) => {
        startTransition(() => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("page", page.toString());
            router.push(`?${newParams.toString()}`);
        });
    };

    return (
        <div className="flex flex-1 justify-center">
            <div className="grid grid-cols-3 gap-2">
                <div className="flex justify-end">
                    {currentPage > 1 && (
                        <div className="flex">
                            <Button
                                variant="link"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={isPending}
                                className="text-foreground hover:text-primary"
                            >
                                <ChevronLeft size={16} />Anterior
                            </Button>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {[...Array(3)].map((_, index) => {
                        const pageIndex = currentPage + index - 1;
                        if (!isValidPage(pageIndex)) {
                            return <Button size="icon" variant="ghost" key={index} className="text-muted-foreground"><Ellipsis  /></Button>;
                        }
                        return (
                            <Button
                                size="icon"
                                variant={pageIndex === currentPage ? "default" : "ghost"}
                                key={index}
                                onClick={() => handlePageChange(pageIndex)}
                                disabled={isPending}
                                className={pageIndex === currentPage ? "bg-primary text-primary-foreground" : "text-foreground hover:text-primary"}
                            >
                                {pageIndex}
                            </Button>
                        );
                    })}
                </div>
                {currentPage < meta.totalPages && (
                    <div className="flex justify-start">
                        <Button
                            variant="link"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={isPending}
                            className="text-foreground hover:text-primary"
                        >
                            Próximo<ChevronRight size={16} />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
