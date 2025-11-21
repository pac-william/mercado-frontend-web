import { z } from 'zod';

// Schema para criar um item no carrinho
export const createCartItemSchema = z.object({
  productId: z.string().min(1, 'ID do produto é obrigatório'),
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1'),
});

// Schema para atualizar um item no carrinho
export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(1, 'Quantidade deve ser pelo menos 1'),
});

// Schema para adicionar múltiplos itens ao carrinho
export const addMultipleItemsSchema = z.object({
  items: z.array(createCartItemSchema).min(1, 'Pelo menos um item deve ser fornecido'),
});

// Schema de resposta para CartItem
export const cartItemResponseSchema = z.object({
  id: z.string(),
  productId: z.string(),
  quantity: z.number(),
  product: z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    unit: z.string(),
    image: z.string().nullable(),
    marketId: z.string(),
  }),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Schema de resposta para Cart
export const cartResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  marketId: z.string(),
  items: z.array(cartItemResponseSchema),
  totalItems: z.number(),
  totalValue: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Tipos TypeScript
export type CreateCartItemDTO = z.infer<typeof createCartItemSchema>;
export type UpdateCartItemDTO = z.infer<typeof updateCartItemSchema>;
export type AddMultipleItemsDTO = z.infer<typeof addMultipleItemsSchema>;
export type CartItemResponseDTO = z.infer<typeof cartItemResponseSchema>;
export type CartResponseDTO = z.infer<typeof cartResponseSchema>;

// Aliases para compatibilidade com código existente (schemas)
export const CreateCartItemDTOSchema = createCartItemSchema;
export const UpdateCartItemQuantityDTOSchema = updateCartItemSchema;
export const AddMultipleItemsDTOSchema = addMultipleItemsSchema;

// Aliases de tipos para compatibilidade
export type CartResponse = CartResponseDTO;
