'use client';

import { createOrder } from "@/actions/order.actions";
import { OrderItemDTO } from "@/dtos/orderDTO";
import { useAuth } from "@/providers/auth-provider";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    const { user, isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();
    const [discount, setDiscount] = useState(0);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            toast.error("Você precisa estar logado para finalizar a compra");
            router.push("/login?next=/checkout");
            return;
        }

        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
            try {
                const items = JSON.parse(storedCart);
                setCartItems(items);
            } catch {
                setCartItems([]);
            }
        }

        if (!storedCart || JSON.parse(storedCart).length === 0) {
            const mockItems = [
                { id: "1", name: "Arroz Branco 5kg", price: 25.90, quantity: 2, marketId: "1" },
                { id: "2", name: "Feijão Preto 1kg", price: 8.50, quantity: 1, marketId: "1" },
                { id: "3", name: "Café Pilão 500g", price: 15.90, quantity: 3, marketId: "1" },
                { id: "4", name: "Açúcar Refinado 1kg", price: 4.20, quantity: 2, marketId: "1" },
            ];
            setCartItems(mockItems);
        }
    }, [isAuthenticated, router]);

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
        if (!user) {
            toast.error("Usuário não autenticado");
            return;
        }

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

            const marketId = cartItems[0].marketId;

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

    if (!isAuthenticated) {
        return null;
    }

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


