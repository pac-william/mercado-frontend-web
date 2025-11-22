import { getMarkets } from "@/actions/market.actions";
import Footer from "@/app/components/Footer";
import Pagination from "@/app/components/Pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { BadgeCheck, Dot, Star } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import MarketFilters from "./components/MarketFilters";

interface MarketListSearchParams {
    page?: string;
    size?: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 12;

const parseNumberParam = (value: string | undefined, fallback: number) => {
    if (!value) return fallback;
    const parsed = Number(value);
    return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const getInitials = (value?: string) => {
    if (!value) return "MK";
    const parts = value.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "MK";
    const initials = parts
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
    return initials || "MK";
};

export const metadata: Metadata = {
    title: "Mercados | Smart Market",
    description: "Encontre mercados próximos e confira os produtos disponíveis.",
};

export default async function MarketsPage({
    searchParams,
}: {
    searchParams: Promise<MarketListSearchParams>;
}) {
    const resolvedSearchParams = await searchParams;
    const pageNumber = parseNumberParam(resolvedSearchParams?.page, DEFAULT_PAGE);
    const pageSize = parseNumberParam(resolvedSearchParams?.size, DEFAULT_SIZE);

    const { markets, meta } = await getMarkets({ page: pageNumber, size: pageSize });

    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="container mx-auto py-6 flex flex-col gap-6">
                <header className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold text-foreground">Mercados</h1>
                    <p className="text-muted-foreground">
                        Explore os mercados disponíveis e escolha o melhor para fazer suas compras.
                    </p>
                </header>

                <Suspense fallback={<div className="h-9" />}>
                    <MarketFilters />
                </Suspense>

                <Separator />

                {markets.length === 0 ? (
                    <Card className="border-border bg-card">
                        <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                            <CardTitle className="text-xl text-card-foreground">Nenhum mercado encontrado</CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Verifique novamente mais tarde ou altere os filtros de busca.
                            </CardDescription>
                        </CardContent>
                    </Card>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {markets.map((market) => (
                                <Link
                                    key={market.id}
                                    href={`/market/${market.id}`}
                                    className="transition-transform hover:-translate-y-1"
                                >
                                    <Card className="h-full border-border bg-card">
                                        <CardHeader className="flex flex-row items-start gap-4">
                                            <Avatar className="h-20 w-20 border">
                                                {market.profilePicture ? (
                                                    <AvatarImage src={market.profilePicture} alt={market.name} />
                                                ) : null}
                                                <AvatarFallback className="text-base font-semibold">
                                                    {getInitials(market.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-1 flex-col gap-1">
                                                <CardTitle className="flex items-center gap-2 text-lg text-card-foreground">
                                                    <span className="line-clamp-1">{market.name}</span>
                                                    <Tooltip>
                                                        <TooltipTrigger>
                                                            <BadgeCheck size={16} className="text-sky-500" />
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Verificado</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </CardTitle>
                                                <span className="flex items-center">
                                                    <div className="flex items-center gap-1">
                                                        <Star size={16} fill="currentColor" className="text-amber-300" />
                                                        <span className="text-sm font-bold text-amber-300">4.5</span>
                                                    </div>
                                                    <Dot scale={16} />
                                                    <span className="text-sm text-muted-foreground">R$ 7,50</span>
                                                </span>
                                                <CardDescription className="text-xs uppercase tracking-wide text-muted-foreground">
                                                    {market.address}
                                                </CardDescription>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                </Link>
                            ))}
                        </div>

                        {meta ? (
                            <Card className="border-border bg-card p-4">
                                <Pagination meta={meta} />
                            </Card>
                        ) : null}
                    </>
                )}
            </div>
            <Footer />
        </ScrollArea>
    );
}
