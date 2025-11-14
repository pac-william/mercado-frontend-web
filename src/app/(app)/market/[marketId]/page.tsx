import { getMarketById } from "@/actions/market.actions";
import { getProductsByMarket } from "@/actions/products.actions";
import SearchField from "@/app/(app)/components/SeachField";
import Footer from "@/app/components/Footer";
import Pagination from "@/app/components/Pagination";
import ProductCard from "@/app/components/ProductCard";
import { Product } from "@/app/domain/productDomain";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Star } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarketActions } from "./MarketActions";

interface MarketPageParams {
    marketId: string;
}

interface MarketPageSearchParams {
    page?: string;
    size?: string;
    name?: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 30;
const FALLBACK_MARKET_BANNER = "https://placehold.co/1200x320/png?text=Smart+Market";
const DEFAULT_MARKET_RATING = 4.8;

const parseNumberParam = (value: string | undefined, fallback: number) => {
    if (!value) return fallback;
    const parsed = Number(value);
    return Number.isNaN(parsed) || parsed <= 0 ? fallback : parsed;
};

const getInitials = (value?: string) => {
    if (!value) return "MK";
    const parts = value.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "MK";
    const initials = parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("");
    return initials || "MK";
};

export async function generateMetadata({ params }: { params: Promise<MarketPageParams> }): Promise<Metadata> {
    const { marketId } = await params;
    try {
        const market = await getMarketById(marketId);
        return {
            title: `${market.name}`,
            description: `Confira os produtos disponíveis no ${market.name}.`,
        };
    } catch {
        return {
            title: "Mercado",
            description: "Confira os produtos disponíveis neste mercado.",
        };
    }
}

interface MarketPageProps {
    params: Promise<MarketPageParams>;
    searchParams: Promise<MarketPageSearchParams>;
}

export default async function MarketPage({ params, searchParams }: MarketPageProps) {
    const { marketId } = await params;
    const { page, size, name } = await searchParams;

    const pageNumber = parseNumberParam(page, DEFAULT_PAGE);
    const pageSize = parseNumberParam(size, DEFAULT_SIZE);

    const market = await getMarketById(marketId).catch((error) => {
        if (error instanceof Error && error.message === "Mercado não encontrado") {
            notFound();
        }
        throw error;
    });

    const { products, meta } = await getProductsByMarket(marketId, {
        page: pageNumber,
        size: pageSize,
        name,
    });

    const bannerImage = market.bannerImage || FALLBACK_MARKET_BANNER;
    const ratingValue = typeof market.rating === "number" ? market.rating : DEFAULT_MARKET_RATING;
    const ratingLabel = ratingValue.toFixed(1).replace(".", ",");

    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="container mx-auto py-6 flex flex-col gap-6">
                <Card className="bg-card border-border overflow-hidden">
                    <div className="relative h-32 sm:h-48 w-full">
                        <Image
                            src={bannerImage}
                            alt={`Banner do mercado ${market.name}`}
                            fill
                            priority
                            className="object-cover"
                            sizes="(min-width: 768px) 768px, 100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-transparent" />
                    </div>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border">
                                {market.profilePicture ? (
                                    <AvatarImage src={market.profilePicture} alt={market.name} />
                                ) : null}
                                <AvatarFallback className="text-lg font-semibold">
                                    {getInitials(market.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <CardTitle className="text-3xl text-card-foreground">{market.name}</CardTitle>
                                <CardDescription className="text-muted-foreground">
                                    {market.address}
                                </CardDescription>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Star className="size-4 text-amber-300" fill="currentColor" />
                                    <span className="font-medium text-amber-300">{ratingLabel}</span>
                                    {typeof market.ratingCount === "number" ? (
                                        <span>({market.ratingCount} avaliações)</span>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <Link href={`/my/chat/${marketId}`}>
                                <Button variant="outline" size="icon" className="rounded-full">
                                    <MessageCircle className="size-4" />
                                    <span className="sr-only">Chat</span>
                                </Button>
                            </Link>
                            <MarketActions marketName={market.name} />
                        </div>
                    </CardHeader>
                    <Separator />
                    <CardContent className="flex flex-col gap-4">
                        <CardDescription className="text-muted-foreground">
                            Explore os produtos disponíveis neste mercado e adicione seus favoritos ao carrinho.
                        </CardDescription>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    <div className="flex justify-center">
                        <SearchField
                            paramName="name"
                            width="w-full sm:w-[320px]"
                            placeholder="Buscar produtos deste mercado"
                        />
                    </div>

                    {products?.length ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
                                {products.map((product: Product) => (
                                    <ProductCard variant="owner" key={product.id} product={product} />
                                ))}
                            </div>
                            {meta ? (
                                <Card className="p-4 bg-card border-border">
                                    <Pagination meta={meta} />
                                </Card>
                            ) : null}
                        </>
                    ) : (
                        <Card className="bg-card border-border">
                            <CardContent className="flex flex-col items-center justify-center py-16 gap-2">
                                <CardTitle className="text-lg text-card-foreground">Nenhum produto encontrado</CardTitle>
                                <CardDescription className="text-muted-foreground text-center">
                                    Tente ajustar sua busca ou volte mais tarde para conferir novos produtos.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
            <Footer />
        </ScrollArea>
    );
}

