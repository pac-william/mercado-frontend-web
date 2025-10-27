import { z } from "zod";

// Schema para criar um item do carrinho
export const CreateCartItemDTO = z.object({
    productId: z.string({ message: "ID do produto é obrigatório" }),
    quantity: z.number().min(1, { message: "Quantidade deve ser maior que zero" }),
});

export type CreateCartItemDTO = z.infer<typeof CreateCartItemDTO>;

// Schema para adicionar múltiplos itens
export const AddMultipleItemsDTO = z.object({
    items: z.array(CreateCartItemDTO).min(1, { message: "Deve adicionar pelo menos um item" }),
});

export type AddMultipleItemsDTO = z.infer<typeof AddMultipleItemsDTO>;

// Schema para atualizar quantidade de um item
export const UpdateCartItemQuantityDTO = z.object({
    quantity: z.number().min(1, { message: "Quantidade deve ser maior que zero" }),
});

export type UpdateCartItemQuantityDTO = z.infer<typeof UpdateCartItemQuantityDTO>;

// Interfaces de resposta
export interface CartProduct {
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    marketId: string;
}

export interface CartItemResponse {
    id: string;
    productId: string;
    quantity: number;
    product: CartProduct;
    createdAt: string;
    updatedAt: string;
}

export interface CartResponse {
    id: string;
    userId: string;
    items: CartItemResponse[];
    totalItems: number;
    totalValue: number;
    createdAt: string;
    updatedAt: string;
}

