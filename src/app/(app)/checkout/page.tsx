'use client';

import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import CouponInput from "./components/CouponInput";
import DeliveryForm, { DeliveryFormData } from "./components/DeliveryForm";
import OrderSummary from "./components/OrderSummary";

export default function CheckoutPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();
    const [discount, setDiscount] = useState(0);

    const mockItems = [
        { id: "1", name: "Arroz Branco 5kg", price: 25.90, quantity: 2 },
        { id: "2", name: "Feijão Preto 1kg", price: 8.50, quantity: 1 },
        { id: "3", name: "Café Pilão 500g", price: 15.90, quantity: 3 },
        { id: "4", name: "Açúcar Refinado 1kg", price: 4.20, quantity: 2 },
    ];

    const handleCouponApply = (code: string) => {
        console.log("Aplicando cupom:", code);
    };

    const handleSubmitOrder = (data: DeliveryFormData) => {
        setIsLoading(true);
        
        const fullAddress = `${data.street}, ${data.number}${data.complement ? ` - ${data.complement}` : ""}, ${data.neighborhood}, ${data.city}/${data.state}, CEP: ${data.zipCode}`;
        
        console.log("Endereço de entrega:", fullAddress);
        console.log("Dados do formulário:", data);

        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="flex flex-col flex-1">
            <ScrollArea className="flex flex-col flex-grow h-0">
                <div className="flex flex-1 flex-col gap-6 container mx-auto my-4 pb-8">
                    <RouterBack />
                    <h1 className="text-2xl font-bold text-foreground">Finalizar Pedido</h1>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <CouponInput 
                                onApply={handleCouponApply}
                                isLoading={isLoading}
                            />
                            
                            <DeliveryForm 
                                onSubmit={handleSubmitOrder}
                                isLoading={isLoading}
                            />
                        </div>
                        
                        <div className="lg:col-span-1">
                            <OrderSummary 
                                items={mockItems}
                                discount={discount}
                                couponCode={appliedCoupon}
                            />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}


