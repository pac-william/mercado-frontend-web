"use server"

import { Product } from "@/app/domain/product";
import { baseUrl } from "@/config/server";
import { ProductDTO } from "@/dtos/productDTO";

export const getProducts = async () => {
    const response = await fetch(`${baseUrl}/api/v1/products`)
    const data = await response.json() as Product[]
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