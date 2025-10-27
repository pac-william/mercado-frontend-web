import { z } from "zod";

export const AddressCreateSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    street: z.string().min(3, "Rua deve ter pelo menos 3 caracteres"),
    number: z.string().min(1, "Número é obrigatório"),
    complement: z.string().optional(),
    neighborhood: z.string().min(2, "Bairro deve ter pelo menos 2 caracteres"),
    city: z.string().min(2, "Cidade deve ter pelo menos 2 caracteres"),
    state: z.string().min(2, "Estado deve ter pelo menos 2 caracteres"),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/, "CEP inválido (ex: 12345-678)"),
    isFavorite: z.boolean().optional().default(false),
});

export type AddressCreateDTO = z.infer<typeof AddressCreateSchema>;

export const AddressUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    street: z.string().min(3).optional(),
    number: z.string().min(1).optional(),
    complement: z.string().optional(),
    neighborhood: z.string().min(2).optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    zipCode: z.string().regex(/^\d{5}-?\d{3}$/).optional(),
    isFavorite: z.boolean().optional(),
    isActive: z.boolean().optional(),
});

export type AddressUpdateDTO = z.infer<typeof AddressUpdateSchema>;

export const AddressFavoriteSchema = z.object({
    isFavorite: z.boolean(),
});

export type AddressFavoriteDTO = z.infer<typeof AddressFavoriteSchema>;

export interface AddressResponseDTO {
    id: string;
    userId: string;
    name: string;
    street: string;
    number: string;
    complement?: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isFavorite: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AddressListResponseDTO {
    addresses: AddressResponseDTO[];
    total: number;
    favorites: number;
    active: number;
}
