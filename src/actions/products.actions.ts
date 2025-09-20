"use server"

import { Product, ProductPaginatedResponse } from "@/app/domain/productDomain";
import { baseUrl } from "@/config/server";
import { ProductDTO } from "@/dtos/productDTO";
import { buildSearchParams } from "@/lib/misc";

interface GetPaymentsFilters {
    page?: number;
    size?: number;
    name?: string;
}


export const getProducts = async (filters?: GetPaymentsFilters) => {
    const params = buildSearchParams({
        page: filters?.page,
        size: filters?.size,
        name: filters?.name,
    });

    const response = await fetch(`${baseUrl}/api/v1/products?${params.toString()}`)
    const data = await response.json() as ProductPaginatedResponse
    return data
}

export const getProductsById = async (id: string) => {
    const response = await fetch(`${baseUrl}/api/v1/products/${id}`)
    const data = await response.json() as Product
    return data
}

export const createProduct = async (product: ProductDTO) => {
    const response = await fetch(`${baseUrl}/api/v1/products`, {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const data = await response.json() as Product
    return data
}