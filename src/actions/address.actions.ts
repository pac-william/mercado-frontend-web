"use server"

import { AddressDomain, AddressPaginatedResponse } from "@/app/domain/addressDomain";
import { baseUrl } from "@/config/server";
import { AddressDTO, AddressUpdateDTO } from "@/dtos/addressDTO";
import { auth0 } from "@/lib/auth0";
import { buildSearchParams } from "@/lib/misc";

interface GetAddressesFilters {
    page?: number;
    size?: number;
}

export const getAddresses = async (filters?: GetAddressesFilters): Promise<AddressPaginatedResponse> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const params = buildSearchParams({
            page: filters?.page,
            size: filters?.size,
        });

        const response = await fetch(`${baseUrl}/api/v1/addresses?${params.toString()}`, {
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
            throw new Error('Erro ao buscar endereços');
        }

        const data = await response.json() as AddressPaginatedResponse;
        return data;
    } catch (error) {
        console.error('Erro ao buscar endereços:', error);
        throw error;
    }
}

export const getAddressById = async (id: string): Promise<AddressDomain> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/addresses/${id}`, {
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
                throw new Error('Endereço não encontrado');
            }
            throw new Error('Erro ao buscar endereço');
        }

        const address = await response.json() as AddressDomain;
        return address;
    } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        throw error;
    }
}

export const getFavoriteAddress = async (): Promise<AddressDomain | null> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/addresses/favorite`, {
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
                return null;
            }
            throw new Error('Erro ao buscar endereço favorito');
        }

        const address = await response.json() as AddressDomain;
        return address;
    } catch (error) {
        console.error('Erro ao buscar endereço favorito:', error);
        throw error;
    }
}

export const getActiveAddresses = async (): Promise<AddressDomain[]> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/addresses/active`, {
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
            throw new Error('Erro ao buscar endereços ativos');
        }

        const addresses = await response.json() as AddressDomain[];
        return addresses;
    } catch (error) {
        console.error('Erro ao buscar endereços ativos:', error);
        throw error;
    }
}

export const createAddress = async (data: AddressDTO): Promise<AddressDomain> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/addresses`, {
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
            if (response.status === 400) {
                const error = await response.json();
                throw new Error(error.message || 'Erro de validação');
            }
            throw new Error('Erro ao criar endereço');
        }

        const address = await response.json() as AddressDomain;
        return address;
    } catch (error) {
        console.error('Erro ao criar endereço:', error);
        throw error;
    }
}

export const updateAddress = async (id: string, data: AddressUpdateDTO): Promise<AddressDomain> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/addresses/${id}`, {
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
            if (response.status === 404) {
                throw new Error('Endereço não encontrado');
            }
            if (response.status === 400) {
                const error = await response.json();
                throw new Error(error.message || 'Erro de validação');
            }
            throw new Error('Erro ao atualizar endereço');
        }

        const address = await response.json() as AddressDomain;
        return address;
    } catch (error) {
        console.error('Erro ao atualizar endereço:', error);
        throw error;
    }
}

export const patchAddress = async (id: string, data: Partial<AddressDTO>): Promise<AddressDomain> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/addresses/${id}`, {
            method: "PATCH",
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
                throw new Error('Endereço não encontrado');
            }
            throw new Error('Erro ao atualizar endereço');
        }

        const address = await response.json() as AddressDomain;
        return address;
    } catch (error) {
        console.error('Erro ao atualizar endereço:', error);
        throw error;
    }
};

export const deleteAddress = async (id: string): Promise<AddressDomain> => {
    try {
        const session = await auth0.getSession();
        if (!session) {
            throw new Error('Usuário não autenticado');
        }

        const response = await fetch(`${baseUrl}/api/v1/addresses/${id}`, {
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
                throw new Error('Endereço não encontrado');
            }
            throw new Error('Erro ao excluir endereço');
        }

        const address = await response.json() as AddressDomain;
        return address;
    } catch (error) {
        console.error('Erro ao excluir endereço:', error);
        throw error;
    }
}