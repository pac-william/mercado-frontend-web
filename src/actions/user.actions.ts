"use server"

import { baseUrl } from "@/config/server";
import { UserResponseDTO, UserUpdateDTO } from "@/dtos/userDTO";
import { auth0 } from "@/lib/auth0";

export const getUserByAuth0Id = async (auth0Id: string): Promise<UserResponseDTO> => {
    const session = await auth0.getSession();
    if (!session) {
        throw new Error("Usuário não autenticado");
    }

    const response = await fetch(`${baseUrl}/api/v1/users/auth0/${encodeURIComponent(auth0Id)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.tokenSet.idToken}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Usuário não encontrado");
        }
        if (response.status === 401) {
            throw new Error("Usuário não autenticado");
        }
        throw new Error("Erro ao buscar usuário");
    }

    const user = await response.json() as UserResponseDTO;
    return user;
};

export const updateUser = async (id: string, data: UserUpdateDTO): Promise<UserResponseDTO> => {
    const session = await auth0.getSession();
    if (!session) {
        throw new Error("Usuário não autenticado");
    }

    const response = await fetch(`${baseUrl}/api/v1/users/${encodeURIComponent(id)}`, {
        method: "PATCH",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.tokenSet.idToken}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        if (response.status === 401) {
            throw new Error("Usuário não autenticado");
        }
        if (response.status === 404) {
            throw new Error("Usuário não encontrado");
        }
        if (response.status === 409) {
            const err = (await response.json().catch(() => ({} as { message?: string }))) as {
                message?: string;
            };
            throw new Error(err?.message || "Email já está em uso");
        }
        if (response.status === 400) {
            const err = (await response.json().catch(() => ({} as { message?: string }))) as {
                message?: string;
            };
            throw new Error(err?.message || "Erro de validação");
        }
        throw new Error("Erro ao atualizar usuário");
    }

    const user = await response.json() as UserResponseDTO;
    return user;
};
