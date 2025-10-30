'use client';

import { getCart } from "@/actions/cart.actions";
import { createOrder } from "@/actions/order.actions";
import LoadingSpinner from "@/components/LoadingSpinner";
import RouterBack from "@/components/RouterBack";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartResponse } from "@/dtos/cartDTO";
import { OrderItemDTO } from "@/dtos/orderDTO";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CouponInput from "./components/CouponInput";
import DeliveryForm, { DeliveryFormData } from "./components/DeliveryForm";
import OrderSummary from "./components/OrderSummary";
import PaymentMethod, { PaymentMethod as PaymentMethodType } from "./components/PaymentMethod";

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
    const [loadingCart, setLoadingCart] = useState(true);
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [appliedCoupon, setAppliedCoupon] = useState<string | undefined>();
    const [discount, setDiscount] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType | undefined>();

    const deliveryFee = 10;

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const cartData = await getCart();
            setCart(cartData);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            toast.error("Erro ao carregar carrinho");
        } finally {
            setLoadingCart(false);
        }
    };

    const cartItems: CartItem[] = cart?.items.map(item => ({
        id: item.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        marketId: item.product.marketId,
    })) || [];

    // Get marketId from first item (assuming all items are from same market)
    const marketId = cartItems.length > 0 ? cartItems[0].marketId : "";
    const userId = cart?.userId || "";

    const subtotal = cart?.totalValue || 0;

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

        if (!userId) {
            toast.error("Usuário não autenticado");
            return;
        }

        if (!marketId) {
            toast.error("Mercado não identificado");
            return;
        }

        if (!selectedPaymentMethod) {
            toast.error("Selecione um método de pagamento");
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
                userId,
                marketId,
                deliveryAddress: fullAddress,
                items,
                couponCode: appliedCoupon
            });

            toast.success("Pedido realizado com sucesso!");
            
            router.push("/my/orders");
        } catch (error) {
            console.error("Erro ao criar pedido:", error);
            toast.error("Erro ao finalizar pedido. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    if (loadingCart) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
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
                            
                            <PaymentMethod
                                onSelectMethod={setSelectedPaymentMethod}
                                selectedMethod={selectedPaymentMethod}
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


