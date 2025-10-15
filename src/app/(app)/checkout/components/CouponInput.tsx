'use client';

import { validateCoupon } from "@/actions/coupon.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CouponInputProps {
    onApply: (code: string, discount: number) => void;
    onRemove: () => void;
    orderTotal: number;
    appliedCode?: string;
    isLoading?: boolean;
}

export default function CouponInput({ onApply, onRemove, orderTotal, appliedCode, isLoading }: CouponInputProps) {
    const [couponCode, setCouponCode] = useState("");
    const [validating, setValidating] = useState(false);

    const handleApply = async () => {
        if (!couponCode.trim()) return;

        setValidating(true);
        try {
            const result = await validateCoupon({
                code: couponCode.trim().toUpperCase(),
                orderTotal
            });

            if (result.isValid && result.discount) {
                onApply(couponCode.trim().toUpperCase(), result.discount);
                toast.success(`Cupom aplicado! Desconto de R$ ${result.discount.toFixed(2)}`);
                setCouponCode("");
            } else {
                toast.error(result.message || "Cupom inválido");
            }
        } catch (error) {
            toast.error("Erro ao validar cupom");
        } finally {
            setValidating(false);
        }
    };

    const handleRemove = () => {
        onRemove();
        toast.info("Cupom removido");
    };

    return (
        <Card className="bg-card border-border">
            <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-card-foreground">
                        Cupom de Desconto
                    </span>
                    
                    {appliedCode ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700 dark:text-green-400">
                                    {appliedCode}
                                </span>
                            </div>
                            <Button
                                onClick={handleRemove}
                                variant="ghost"
                                size="sm"
                                disabled={isLoading}
                                className="h-auto p-1 text-green-700 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                            >
                                <XCircle className="w-4 h-4" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Input
                                placeholder="Digite o código"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                disabled={isLoading || validating}
                                className="flex-1"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleApply();
                                    }
                                }}
                            />
                            <Button 
                                onClick={handleApply} 
                                disabled={!couponCode.trim() || isLoading || validating}
                                variant="outline"
                            >
                                {validating ? "Validando..." : "Aplicar"}
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}


