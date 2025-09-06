
/**
 * Constrói URLSearchParams de forma robusta, ignorando valores undefined, null ou vazios
 * @param params - Objeto com os parâmetros a serem adicionados
 * @returns URLSearchParams com apenas os parâmetros válidos
 */
export function buildSearchParams(params: Record<string, unknown>): URLSearchParams {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        // Ignora valores undefined, null, string vazia ou array vazio
        if (value !== undefined && value !== null && value !== '') {
            if (Array.isArray(value)) {
                // Para arrays, só adiciona se não estiver vazio
                if (value.length > 0) {
                    searchParams.set(key, value.toString());
                }
            } else {
                searchParams.set(key, value.toString());
            }
        }
    });

    return searchParams;
}