import { z } from "zod";

export const CouponValidateDTO = z.object({
    code: z.string().min(1, { message: "Código do cupom é obrigatório" }),
    orderTotal: z.number().min(0, { message: "Total do pedido deve ser informado" }),
});

export type CouponValidateDTO = z.infer<typeof CouponValidateDTO>;

export interface CouponValidateResponseDTO {
    isValid: boolean;
    message?: string;
    discount?: number;
    coupon?: {
        id: string;
        code: string;
        type: string;
        value: number;
        minOrderValue?: number;
        maxDiscount?: number;
    };
}

export const CouponCreateDTO = z.object({
    code: z.string().min(3, { message: "Código deve ter pelo menos 3 caracteres" }),
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    description: z.string().optional(),
    type: z.enum(["PERCENTAGE", "FIXED"], { message: "Tipo deve ser PERCENTAGE ou FIXED" }),
    value: z.number().min(0, { message: "Valor deve ser maior que zero" }),
    minOrderValue: z.number().min(0).optional(),
    maxDiscount: z.number().min(0).optional(),
    usageLimit: z.number().int().min(1).optional(),
    validFrom: z.string(),
    validUntil: z.string(),
});

export type CouponCreateDTO = z.infer<typeof CouponCreateDTO>;

export const CouponUpdateDTO = CouponCreateDTO.partial();
export type CouponUpdateDTO = z.infer<typeof CouponUpdateDTO>;

export interface CouponResponseDTO {
    id: string;
    code: string;
    name: string;
    description?: string;
    type: string;
    value: number;
    minOrderValue?: number;
    maxDiscount?: number;
    usageLimit?: number;
    usedCount: number;
    isActive: boolean;
    validFrom: Date;
    validUntil: Date;
    createdAt: Date;
    updatedAt: Date;
}

