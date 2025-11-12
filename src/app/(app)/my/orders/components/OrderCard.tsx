import { formatPrice } from "@/app/utils/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, MapPin, Package, Store } from "lucide-react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";

interface OrderCardProps {
    id: string;
    status: string;
    total: number;
    deliveryAddress?: string | null;
    createdAt?: Date;
    marketId?: string;
}

export default function OrderCard({ id, status, total, deliveryAddress, createdAt, marketId }: OrderCardProps) {
    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
        : "Data não disponível";

    const shortAddress = deliveryAddress && deliveryAddress.length > 60 ? deliveryAddress.substring(0, 60) + "..." : deliveryAddress ?? "Endereço não disponível";

    return (
        <Card className="bg-card border-border hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <Package className="w-4 h-4 text-muted-foreground" />
                                <span className="font-mono text-sm text-muted-foreground">
                                    #{id.substring(0, 8)}
                                </span>
                            </div>
                            <StatusBadge status={status} />
                        </div>

                        <div className="text-right">
                            <p className="text-2xl font-bold text-card-foreground">
                                {formatPrice(total)}
                            </p>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex flex-col gap-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <CalendarDays className="w-4 h-4" />
                            <span>{formattedDate}</span>
                        </div>

                        <div className="flex items-start gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{shortAddress}</span>
                        </div>

                        {marketId && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Store className="w-4 h-4" />
                                <span>Mercado ID: {marketId}</span>
                            </div>
                        )}
                    </div>

                    <Separator />

                    <Button asChild className="w-full">
                        <Link href={`orders/${id}`}>
                            Ver Detalhes
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

