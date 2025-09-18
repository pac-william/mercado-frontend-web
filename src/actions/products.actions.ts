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
    // Usando dados mock diretamente (como estava antes)
    const { products } = await import('@/lib/mock-data');
    
    // Aplicar filtros básicos
    let filteredProducts = products;
    
    if (filters?.name) {
        const searchTerm = filters.name.toLowerCase();
        filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm)
        );
    }
    
    // Paginação
    const page = filters?.page || 1;
    const size = filters?.size || 100;
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    return {
        products: paginatedProducts,
        meta: {
            page,
            size,
            total: filteredProducts.length,
            totalPages: Math.ceil(filteredProducts.length / size),
            totalItems: filteredProducts.length
        }
    } as any; // Usar any temporariamente para evitar problemas de tipo
}

export const getProductsById = async (id: string) => {
    // Usando dados mock diretamente (como estava antes)
    const { products } = await import('@/lib/mock-data');
    const product = products.find(p => p.id === id);
    
    if (!product) {
        throw new Error('Produto não encontrado');
    }
    
    return product as any; // Usar any temporariamente para evitar problemas de tipo
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