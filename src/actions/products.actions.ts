"use server"

import { Product, ProductPaginatedResponse } from "@/app/domain/productDomain";
import { baseUrl } from "@/config/server";
import { ProductDTO } from "@/dtos/productDTO";
import { auth0 } from "@/lib/auth0";
import { buildSearchParams } from "@/lib/misc";

interface GetProductsFilters {
    page?: number;
    size?: number;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    marketId?: string;
    categoryId?: string;
}

export const getProducts = async (filters?: GetProductsFilters): Promise<ProductPaginatedResponse> => {
    try {
        const params = buildSearchParams({
            page: filters?.page ?? 1,
            size: filters?.size ?? 10,
            name: filters?.name,
            minPrice: filters?.minPrice,
            maxPrice: filters?.maxPrice,
            marketId: filters?.marketId,
            categoryId: filters?.categoryId,
        });

        const response = await fetch(`${baseUrl}/api/v1/products?${params.toString()}`, {
            method: "GET",
            cache: 'no-store',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Produtos não encontrados');
            }
            if (response.status >= 500) {
                throw new Error('Erro no servidor ao buscar produtos');
            }
            try {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao buscar produtos');
            } catch {
                throw new Error(`Erro ao buscar produtos (status: ${response.status})`);
            }
        }

        const data = await response.json() as ProductPaginatedResponse;
        return data;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw error;
    }
}

export const getProductsById = async (id: string) => {
    try {
        const response = await fetch(`${baseUrl}/api/v1/products/${id}`, {
            cache: 'no-store',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Produto não encontrado');
            }
            throw new Error('Erro ao buscar produto');
        }

        const data = await response.json() as Product;
        return data;
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        throw error;
    }
}

export const createProduct = async (product: ProductDTO) => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/products`, {
            method: "POST",
            body: JSON.stringify(product),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.tokenSet.idToken}`,
            },
            cache: 'no-store',
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Usuário não autenticado');
            }
            if (response.status === 403) {
                throw new Error('Acesso negado');
            }
            if (response.status === 400) {
                const error = await response.json();
                throw new Error(error.message || 'Erro de validação');
            }
            throw new Error('Erro ao criar produto');
        }

        const data = await response.json() as Product;
        return data;
    } catch (error) {
        console.error('Erro ao criar produto:', error);
        throw error;
    }
}