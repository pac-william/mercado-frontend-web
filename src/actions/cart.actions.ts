"use server"

import { baseUrl } from "@/config/server";
import { AddMultipleItemsDTO, CartResponse, CreateCartItemDTO, UpdateCartItemDTO } from "@/dtos/cartDTO";
import { auth0 } from "@/lib/auth0";

export const getCart = async (): Promise<CartResponse[]> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/cart`, {
            method: "GET",
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
            if (response.status === 404) {
                throw new Error('Carrinho não encontrado');
            }
            if (response.status === 403) {
                throw new Error('Acesso negado');
            }
            if (response.status >= 500) {
                throw new Error('Erro no servidor ao buscar carrinho');
            }
            try {
                const error = await response.json();
                throw new Error(error.message || 'Erro ao buscar carrinho');
            } catch {
                throw new Error(`Erro ao buscar carrinho (status: ${response.status})`);
            }
        }

        const data = await response.json();
        if (Array.isArray(data)) {
            return data as CartResponse[];
        }
        return [data as CartResponse];
    } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        throw error;
    }
};

export const clearCart = async (): Promise<boolean> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/cart`, {
            method: "DELETE",
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
            if (response.status === 404) {
                throw new Error('Carrinho não encontrado');
            }
            throw new Error('Erro ao limpar carrinho');
        }

        return true;
    } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
        throw error;
    }
};

export const addItemToCart = async (data: CreateCartItemDTO): Promise<CartResponse> => {
    try {
        const session = await auth0.getSession();

        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/cart/items`, {
            method: "POST",
            body: JSON.stringify(data),
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
            if (response.status === 404) {
                throw new Error('Produto não encontrado');
            }
            if (response.status === 400) {
                const error = await response.json();
                throw new Error(error.message || 'Erro de validação');
            }
            throw new Error('Erro ao adicionar item ao carrinho');
        }

        const cart = await response.json() as CartResponse;
        return cart;
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        throw error;
    }
};

export const addMultipleItemsToCart = async (data: AddMultipleItemsDTO): Promise<CartResponse[]> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/cart/items/multiple`, {
            method: "POST",
            body: JSON.stringify(data),
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
            if (response.status === 404) {
                const error = await response.json();
                throw new Error(error.message || 'Produto não encontrado');
            }
            if (response.status === 400) {
                const error = await response.json();
                throw new Error(error.message || 'Erro de validação');
            }
            throw new Error('Erro ao adicionar itens ao carrinho');
        }

        const cart = await response.json() as CartResponse[];
        return cart;
    } catch (error) {
        console.error('Erro ao adicionar itens ao carrinho:', error);
        throw error;
    }
};

export const updateCartItemQuantity = async (
    cartItemId: string,
    data: UpdateCartItemDTO
): Promise<CartResponse> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/cart/items/${cartItemId}`, {
            method: "PUT",
            body: JSON.stringify(data),
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
            if (response.status === 404) {
                throw new Error('Item não encontrado no carrinho');
            }
            if (response.status === 400) {
                const error = await response.json();
                throw new Error(error.message || 'Erro de validação');
            }
            throw new Error('Erro ao atualizar quantidade do item');
        }

        const cart = await response.json() as CartResponse;
        return cart;
    } catch (error) {
        console.error('Erro ao atualizar quantidade do item:', error);
        throw error;
    }
};

export const removeCartItem = async (cartItemId: string): Promise<boolean> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/cart/items/${cartItemId}`, {
            method: "DELETE",
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
            if (response.status === 404) {
                throw new Error('Item não encontrado no carrinho');
            }
            throw new Error('Erro ao remover item do carrinho');
        }

        return true;
    } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
        throw error;
    }
};

export const deleteCart = async (): Promise<boolean> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/cart/delete`, {
            method: "DELETE",
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
            if (response.status === 404) {
                throw new Error('Carrinho não encontrado');
            }
            throw new Error('Erro ao deletar carrinho');
        }

        return true;
    } catch (error) {
        console.error('Erro ao deletar carrinho:', error);
        throw error;
    }
};
