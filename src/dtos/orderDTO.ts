import { z } from "zod";

export const OrderItemDTO = z.object({
    productId: z.string({ message: "ID do produto é obrigatório" }),
    quantity: z.number().int().min(1, { message: "Quantidade deve ser maior que zero" }),
    price: z.number().min(0, { message: "Preço deve ser maior ou igual a zero" }),
});

export type OrderItemDTO = z.infer<typeof OrderItemDTO>;

export const OrderCreateDTO = z.object({
    marketId: z.string({ message: "ID do mercado é obrigatório" }),
    addressId: z.string({ message: "ID do endereço é obrigatório" }),
    paymentMethod: z.enum(["CREDIT_CARD", "DEBIT_CARD", "PIX", "CASH"], {
        message: "Método de pagamento inválido",
    }),
    items: z.array(OrderItemDTO).min(1, { message: "Pedido deve ter pelo menos um item" }),
    couponCode: z.string().optional(),
});

export type OrderCreateDTO = z.infer<typeof OrderCreateDTO>;

export interface OrderResponseDTO {
    id: string;
    userId: string;
    marketId: string;
    addressId: string;
    delivererId?: string | null;
    couponId?: string | null;
    status: string;
    total: number;
    discount?: number | null;
    paymentMethod: "CREDIT_CARD" | "DEBIT_CARD" | "PIX" | "CASH";
    deliveryAddress: string;
    items: Array<{
        id: string;
        productId: string;
        quantity: number;
        price: number;
    }>;
    createdAt?: Date;
    updatedAt?: Date;
}

export const OrderUpdateDTO = z.object({
    status: z.enum(["PENDING", "CONFIRMED", "PREPARING", "READY_FOR_DELIVERY", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"]).optional(),
    delivererId: z.string().optional(),
});

export type OrderUpdateDTO = z.infer<typeof OrderUpdateDTO>;

export const AssignDelivererDTO = z.object({
    delivererId: z.string({ message: "ID do entregador é obrigatório" }),
});

export type AssignDelivererDTO = z.infer<typeof AssignDelivererDTO>;

