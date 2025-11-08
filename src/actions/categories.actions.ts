"use server";

import { CategoryPaginatedResponse } from "@/app/domain/categoryDomain";
import { baseUrl } from "@/config/server";
import { buildSearchParams } from "@/lib/misc";

interface GetCategoriesFilters {
    page?: number;
    size?: number;
    name?: string;
}

export const getCategories = async (filters?: GetCategoriesFilters): Promise<CategoryPaginatedResponse> => {
    try {
        const params = buildSearchParams({
            page: filters?.page ?? 1,
            size: filters?.size ?? 50,
            name: filters?.name,
        });

        const response = await fetch(`${baseUrl}/api/v1/categories?${params.toString()}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Categorias não encontradas");
            }
            if (response.status >= 500) {
                throw new Error("Erro no servidor ao buscar categorias");
            }
            try {
                const error = await response.json();
                throw new Error(error.message || "Erro ao buscar categorias");
            } catch {
                throw new Error(`Erro ao buscar categorias (status: ${response.status})`);
            }
        }

        const data = await response.json() as CategoryPaginatedResponse;
        return data;
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        throw error;
    }
};

