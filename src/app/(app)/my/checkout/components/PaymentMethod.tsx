'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, HandCoins, Smartphone, Wallet } from "lucide-react";

export type PaymentMethod = "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "CASH";

interface PaymentMethodProps {
    selectedMethod: PaymentMethod;
    onSelect: (method: PaymentMethod) => void;
    isLoading?: boolean;
}

export default function PaymentMethod({ selectedMethod, onSelect, isLoading }: PaymentMethodProps) {
    const paymentMethods = [
        {
            id: "CREDIT_CARD" as PaymentMethod,
            name: "Cartão de Crédito",
            icon: CreditCard,
            description: "Parcelamento em até 12x",
        },
        {
            id: "DEBIT_CARD" as PaymentMethod,
            name: "Cartão de Débito",
            icon: Wallet,
            description: "Débito em conta",
        },
        {
            id: "PIX" as PaymentMethod,
            name: "PIX",
            icon: Smartphone,
            description: "Aprovação instantânea e 5% de desconto",
        },
        {
            id: "CASH" as PaymentMethod,
            name: "Dinheiro",
            icon: HandCoins,
            description: "Pagamento na entrega",
        },
    ];

    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-card-foreground">Método de Pagamento</CardTitle>
                <CardDescription className="text-muted-foreground">
                    Escolha a forma de pagamento
                </CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                    {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const isSelected = selectedMethod === method.id;

                        return (
                            <button
                                key={method.id}
                                type="button"
                                onClick={() => onSelect(method.id)}
                                disabled={isLoading}
                                className={`flex items-center gap-4 p-4 rounded-lg border-2 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                                    isSelected
                                        ? "border-primary bg-primary/5 dark:bg-primary/10"
                                        : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"
                                } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
                            >
                                <div
                                    className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                                        isSelected ? "bg-primary/10" : "bg-muted"
                                    }`}
                                >
                                    <Icon
                                        className={`w-6 h-6 ${
                                            isSelected ? "text-primary" : "text-muted-foreground"
                                        }`}
                                    />
                                </div>
                                <div className="flex-1">
                                    <h3
                                        className={`font-medium ${
                                            isSelected ? "text-primary" : "text-card-foreground"
                                        }`}
                                    >
                                        {method.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">{method.description}</p>
                                </div>
                                <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                        isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                                    }`}
                                >
                                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {selectedMethod === "PIX" && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                        <p className="text-sm text-green-700 dark:text-green-400">
                            💰 <strong>Desconto PIX:</strong> Ganhe 5% de desconto ao pagar com PIX!
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
