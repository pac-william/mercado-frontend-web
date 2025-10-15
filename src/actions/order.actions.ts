"use server"

import { OrderPaginatedResponse } from "@/app/domain/orderDomain";
import { baseUrl } from "@/config/server";
import { OrderCreateDTO, OrderResponseDTO, OrderUpdateDTO, AssignDelivererDTO } from "@/dtos/orderDTO";
import { buildSearchParams } from "@/lib/misc";

interface GetOrdersFilters {
    page?: number;
    size?: number;
    status?: string;
    userId?: string;
}

export const createOrder = async (data: OrderCreateDTO) => {
    const response = await fetch(`${baseUrl}/api/v1/orders`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    if (!response.ok) {
        throw new Error('Erro ao criar pedido');
    }
    
    const order = await response.json() as OrderResponseDTO;
    return order;
}

export const getOrders = async (filters?: GetOrdersFilters) => {
    const params = buildSearchParams({
        page: filters?.page,
        size: filters?.size,
        status: filters?.status,
        userId: filters?.userId,
    });

    const response = await fetch(`${baseUrl}/api/v1/orders?${params.toString()}`);
    
    if (!response.ok) {
        throw new Error('Erro ao buscar pedidos');
    }
    
    const data = await response.json() as OrderPaginatedResponse;
    return data;
}

export const getOrderById = async (id: string) => {
    const response = await fetch(`${baseUrl}/api/v1/orders/${id}`);
    
    if (!response.ok) {
        throw new Error('Erro ao buscar pedido');
    }
    
    const order = await response.json() as OrderResponseDTO;
    return order;
}

export const updateOrderStatus = async (id: string, data: OrderUpdateDTO) => {
    const response = await fetch(`${baseUrl}/api/v1/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    if (!response.ok) {
        throw new Error('Erro ao atualizar pedido');
    }
    
    const order = await response.json() as OrderResponseDTO;
    return order;
}

export const assignDeliverer = async (orderId: string, data: AssignDelivererDTO) => {
    const response = await fetch(`${baseUrl}/api/v1/orders/${orderId}/assign-deliverer`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
    
    if (!response.ok) {
        throw new Error('Erro ao atribuir entregador');
    }
    
    const order = await response.json() as OrderResponseDTO;
    return order;
}

