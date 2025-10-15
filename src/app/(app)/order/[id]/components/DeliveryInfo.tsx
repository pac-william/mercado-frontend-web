import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MapPin, User } from "lucide-react";

interface DeliveryInfoProps {
    address: string;
    delivererId?: string | null;
}

export default function DeliveryInfo({ address, delivererId }: DeliveryInfoProps) {
    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <MapPin className="w-5 h-5" />
                    Informações de Entrega
                </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6 space-y-4">
                <div>
                    <label className="text-sm font-medium text-muted-foreground">
                        Endereço de Entrega
                    </label>
                    <p className="mt-1 text-card-foreground">
                        {address}
                    </p>
                </div>

                {delivererId && (
                    <>
                        <Separator />
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-muted rounded-full">
                                <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">
                                    Entregador
                                </label>
                                <p className="text-card-foreground">
                                    ID: {delivererId}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {!delivererId && (
                    <>
                        <Separator />
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                Entregador ainda não foi atribuído a este pedido
                            </p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}


