'use client';

import { createOrder } from "@/actions/order.actions";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OrderItemDTO } from "@/dtos/orderDTO";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import CouponInput from "./components/CouponInput";
import DeliveryForm, { DeliveryFormData } from "./components/DeliveryForm";
import OrderSummary from "./components/OrderSummary";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    marketId: string;
}

export default function CheckoutPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();
    const [discount, setDiscount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleCouponApply = (code: string, discountValue: number) => {
        setAppliedCoupon(code);
        setDiscount(discountValue);
    };

    const handleCouponRemove = () => {
        setAppliedCoupon(undefined);
        setDiscount(0);
    };

    const handleSubmitOrder = async (data: DeliveryFormData) => {
        if (cartItems.length === 0) {
            toast.error("Carrinho vazio");
            return;
        }

        setIsLoading(true);

        try {
            const fullAddress = `${data.street}, ${data.number}${data.complement ? ` - ${data.complement}` : ""}, ${data.neighborhood}, ${data.city}/${data.state}, CEP: ${data.zipCode}`;

            const items: OrderItemDTO[] = cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            await createOrder({
                deliveryAddress: fullAddress,
                items,
                couponCode: appliedCoupon
            });

            toast.success("Pedido realizado com sucesso!");
            localStorage.removeItem("cart");
            
            router.push("/my-orders");
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            toast.error("Erro ao finalizar pedido. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col flex-1 items-center justify-center gap-4 p-8">
                <h1 className="text-2xl font-bold text-foreground">Carrinho vazio</h1>
                <p className="text-muted-foreground">Adicione produtos ao carrinho para continuar</p>
            </div>
        );
    }

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
                                onRemove={handleCouponRemove}
                                orderTotal={subtotal}
                                appliedCode={appliedCoupon}
                                isLoading={isLoading}
                            />
                            
                            <DeliveryForm 
                                onSubmit={handleSubmitOrder}
                                isLoading={isLoading}
                            />
                        </div>
                        
                        <div className="lg:col-span-1">
                            <OrderSummary 
                                items={cartItems}
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


