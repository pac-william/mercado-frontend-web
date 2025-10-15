"use server"

import { baseUrl } from "@/config/server";
import { CouponCreateDTO, CouponResponseDTO, CouponUpdateDTO, CouponValidateDTO, CouponValidateResponseDTO } from "@/dtos/couponDTO";
import { buildSearchParams } from "@/lib/misc";

interface GetCouponsFilters {
    page?: number;
    size?: number;
    isActive?: boolean;
}

export const validateCoupon = async (data: CouponValidateDTO) => {
    const response = await fetch(`${baseUrl}/api/v1/coupons/validate`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro ao validar cupom');
    }
    
    const result = await response.json() as CouponValidateResponseDTO;
    return result;
}

export const createCoupon = async (data: CouponCreateDTO) => {
    const response = await fetch(`${baseUrl}/api/v1/coupons`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    if (!response.ok) {
        throw new Error('Erro ao criar cupom');
    }
    
    const coupon = await response.json() as CouponResponseDTO;
    return coupon;
}

export const getCoupons = async (filters?: GetCouponsFilters) => {
    const params = buildSearchParams({
        page: filters?.page,
        size: filters?.size,
        isActive: filters?.isActive,
    });

    const response = await fetch(`${baseUrl}/api/v1/coupons?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error('Erro ao buscar cupons');
    }
    
    const data = await response.json();
    return data;
}

export const getCouponById = async (id: string) => {
    const response = await fetch(`${baseUrl}/api/v1/coupons/${id}`);
    
    if (!response.ok) {
        throw new Error('Erro ao buscar cupom');
    }
    
    const coupon = await response.json() as CouponResponseDTO;
    return coupon;
}

export const updateCoupon = async (id: string, data: CouponUpdateDTO) => {
    const response = await fetch(`${baseUrl}/api/v1/coupons/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    if (!response.ok) {
        throw new Error('Erro ao atualizar cupom');
    }
    
    const coupon = await response.json() as CouponResponseDTO;
    return coupon;
}

export const deleteCoupon = async (id: string) => {
    const response = await fetch(`${baseUrl}/api/v1/coupons/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    if (!response.ok) {
        throw new Error('Erro ao deletar cupom');
    }
    
    return true;
}

