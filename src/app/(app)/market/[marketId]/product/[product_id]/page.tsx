import { getMarketById } from "@/actions/market.actions";
import { getProductsById } from "@/actions/products.actions";
import Footer from "@/app/components/Footer";
import { formatPrice } from "@/app/utils/formatters";
import RouterBack from "@/components/RouterBack";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    ArrowRight,
    Calendar,
    CheckCircle2,
    CreditCard,
    Info,
    MapPin,
    Package,
    RotateCcw,
    Shield,
    Star,
    Truck
} from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";
import ProductActions from "./ProductActions";
import ProductImage from "./ProductImage";

export default async function ProductPage({ params }: { params: Promise<{ product_id: string; marketId: string }> }) {
    const { product_id, marketId } = await params;

    let product;
    let market;

    try {
        product = await getProductsById(product_id);
    } catch (error) {
        console.error("Erro ao carregar produto:", error);
        notFound();
    }

    // Usa o marketId do produto, com fallback para o parâmetro da URL
    const marketIdToUse = product.marketId || marketId;

    try {
        market = await getMarketById(marketIdToUse);
    } catch (error) {
        console.error("Erro ao carregar mercado:", error);
        // Se não conseguir carregar o mercado, continua sem ele
        market = null;
    }

    const getImageSrc = () => {
        if (product.image && isValidUrl(product.image)) {
            return product.image;
        }
        return "https://ibassets.com.br/ib.item.image.medium/m-20161111154302022002734292c24125421585da814b5db62401.jpg";
    };

    const isValidUrl = (string: string) => {
        try {
            new URL(string);
            return true;
        } catch {
            return false;
        }
    };

    const shouldShowDiscount = (productId: string) => {
        const hash = productId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return Math.abs(hash) % 2 === 0;
    };

    const getDiscountPrice = (price: number, productId: string) => {
        const hash = productId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        const multiplier = 1.1 + (Math.abs(hash) % 50) / 100;
        return price * multiplier;
    };

    const showDiscount = shouldShowDiscount(product.id);
    const discountPrice = showDiscount ? getDiscountPrice(product.price, product.id) : 0;
    const discountPercentage = showDiscount ? Math.round(((discountPrice - product.price) / discountPrice) * 100) : 0;

    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="container mx-auto py-6 flex flex-col gap-6">
                <RouterBack />
                <div className="flex flex-col flex-1 container mx-auto pb-8">
                    <div className="grid grid-cols-5 gap-4">

                        {/* Imagem do produto */}
                        <div className="relative aspect-square bg-muted rounded-lg overflow-hidden col-span-2 shadow-lg border border-muted-foreground/10">
                            <ProductImage
                                imageSrc={getImageSrc()}
                                alt={product.name}
                            />
                        </div>

                        {/* Informações do produto */}
                        <div className="space-y-6 col-span-2">
                            {/* Nome e preço */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary" className="text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
                                        Novo
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                        +100 vendidos
                                    </Badge>
                                </div>
                                <h1 className="text-3xl font-bold text-foreground mb-4">{product.name}</h1>

                                <div className="flex items-center gap-4 mb-4">
                                    {showDiscount ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-foreground">
                                                {formatPrice(product.price)}
                                            </span>
                                            <span className="text-lg text-muted-foreground line-through">
                                                {formatPrice(discountPrice)}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-3xl font-bold text-foreground">
                                            {formatPrice(product.price)}
                                        </span>
                                    )}
                                </div>

                                {showDiscount && (
                                    <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-4">
                                        Economize {formatPrice(discountPrice - product.price)} ({discountPercentage}% de desconto)
                                    </p>
                                )}

                                {/* Informações de pagamento */}
                                <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <CreditCard size={16} className="text-blue-600 dark:text-blue-400" />
                                            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                Ver meios de pagamento e promoções
                                            </span>
                                            <ArrowRight size={14} className="text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            Parcele em até 12x sem juros no cartão
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Informações de frete */}
                                <Card className="bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 mt-4">
                                    <CardContent className="pt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Truck size={16} className="text-green-600 dark:text-green-400" />
                                            <span className="text-sm font-semibold text-green-900 dark:text-green-100">
                                                FRETE GRÁTIS ACIMA DE R$ 19
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-green-800 dark:text-green-200">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-green-600 dark:text-green-400" />
                                                <span>Chegará no seu dia de entregas</span>
                                            </div>
                                            <p className="text-xs text-green-700 dark:text-green-300">
                                                Chegará grátis entre terça-feira e quinta-feira
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Informações de estoque */}
                                <div className="flex items-center gap-2 mt-4 text-sm">
                                    <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                                    <span className="text-green-700 dark:text-green-300 font-medium">Estoque disponível</span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground">+50 disponíveis</span>
                                </div>
                            </div>

                            {/* Especificações do produto */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Especificações</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        {product.sku && (
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">SKU:</span>
                                                <span className="font-medium">{product.sku}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Unidade:</span>
                                            <span className="font-medium">{product.unit}</span>
                                        </div>
                                        {product.category && (
                                            <div className="flex justify-between col-span-2">
                                                <span className="text-muted-foreground">Categoria:</span>
                                                <span className="font-medium">{product.category.name}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Garantias e devoluções */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Shield size={18} />
                                        Garantias
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <RotateCcw size={16} className="text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Devolução grátis</p>
                                            <p className="text-xs text-muted-foreground">
                                                Você tem 30 dias a partir da data de recebimento.
                                            </p>
                                        </div>
                                    </div>
                                    <Separator />
                                    <div className="flex items-start gap-2">
                                        <Shield size={16} className="text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">Compra Garantida</p>
                                            <p className="text-xs text-muted-foreground">
                                                Receba o produto que está esperando ou devolvemos o dinheiro.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="flex flex-col gap-4 col-span-1">
                            {/* Informações do mercado */}
                            {market && (
                                <Card>
                                    <CardHeader className="pb-3">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    unoptimized
                                                    src={market.profilePicture || "/placeholder-market.png"}
                                                    alt={market.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-full border shadow-sm object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-foreground">{market.name}</h3>
                                                    {market.rating && (
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    size={14}
                                                                    className={i < Math.floor(market.rating || 0) ? "text-amber-400 dark:text-amber-500 fill-amber-400 dark:fill-amber-500" : "text-muted-foreground"}
                                                                />
                                                            ))}
                                                            <span className="text-xs text-muted-foreground ml-1">
                                                                {market.rating.toFixed(1)}
                                                            </span>
                                                            {market.ratingCount && (
                                                                <span className="text-xs text-muted-foreground">
                                                                    ({market.ratingCount})
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            {market.address && (
                                                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                                                    <MapPin size={14} className="mt-0.5" />
                                                    <span className="line-clamp-2">{market.address}</span>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-xs">
                                                    MercadoLíder
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">+1000 vendas</span>
                                            </div>
                                            <Separator />
                                            <div className="grid grid-cols-1 gap-2 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <Package size={14} className="text-muted-foreground" />
                                                    <span>Armazenado e enviado pelo {market.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Controles de quantidade e ações */}
                            <ProductActions productId={product.id} />

                            {/* Informações adicionais de entrega */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                        <Info size={16} />
                                        Informações de Entrega
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-2 text-xs text-muted-foreground">
                                    <p>• Entrega em todo o Brasil</p>
                                    <p>• Rastreamento disponível</p>
                                    <p>• Entrega rápida e segura</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Descrição do produto */}
                    <div className="mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Descrição do Produto</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none">
                                    <p className="text-muted-foreground">
                                        {product.category ? (
                                            <>
                                                Este produto da categoria <strong>{product.category.name}</strong> oferece
                                                excelente qualidade e valor. Ideal para suas necessidades diárias,
                                                proporcionando praticidade e satisfação.
                                            </>
                                        ) : (
                                            <>
                                                Produto de alta qualidade com excelente custo-benefício.
                                                Ideal para o seu dia a dia, oferecendo praticidade e sabor.
                                            </>
                                        )}
                                    </p>
                                    <div className="mt-4 space-y-2">
                                        <h4 className="font-semibold text-sm">Características principais:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                            <li>Qualidade garantida</li>
                                            <li>Embalagem segura</li>
                                            <li>Produto original</li>
                                            <li>Atende aos padrões de qualidade</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div >
            <Footer />
        </ScrollArea>
    );
}