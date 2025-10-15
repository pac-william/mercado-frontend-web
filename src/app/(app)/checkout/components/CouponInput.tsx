'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface CouponInputProps {
    onApply?: (code: string) => void;
    isLoading?: boolean;
}

export default function CouponInput({ onApply, isLoading }: CouponInputProps) {
    const [couponCode, setCouponCode] = useState("");

    const handleApply = () => {
        if (couponCode.trim() && onApply) {
            onApply(couponCode.trim().toUpperCase());
        }
    };

    return (
        <Card className="bg-card border-border">
            <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-card-foreground">
                        Cupom de Desconto
                    </span>
                    <div className="flex gap-2">
                        <Input
                            placeholder="Digite o código"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            disabled={isLoading}
                            className="flex-1"
                        />
                        <Button 
                            onClick={handleApply} 
                            disabled={!couponCode.trim() || isLoading}
                            variant="outline"
                        >
                            Aplicar
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}


