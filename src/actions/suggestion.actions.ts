"use server";

interface SuggestionResult {
  id: number;
  title: string;
  description: string;
  products: Array<{
    id: number;
    name: string;
    price: number;
    market: string;
  }>;
}

export async function searchSuggestions(query: string): Promise<SuggestionResult> {
  // Simular delay de 5 segundos
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Dados mockados baseados na query
  const mockSuggestions: Record<string, SuggestionResult> = {
    "pudim": {
      id: 1,
      title: "Receita de Pudim Caseiro",
      description: "Pudim cremoso e delicioso com calda de caramelo",
      products: [
        { id: 1, name: "Leite Condensado", price: 8.50, market: "Carrefour" },
        { id: 2, name: "Ovos", price: 12.90, market: "BH Supermercados" },
        { id: 3, name: "Açúcar", price: 4.20, market: "Rede Uai" },
        { id: 4, name: "Leite", price: 5.80, market: "Carrefour" }
      ]
    },
    "bolo": {
      id: 2,
      title: "Bolo de Chocolate",
      description: "Bolo fofinho de chocolate para qualquer ocasião",
      products: [
        { id: 5, name: "Farinha de Trigo", price: 6.50, market: "BH Supermercados" },
        { id: 6, name: "Açúcar", price: 4.20, market: "Rede Uai" },
        { id: 7, name: "Chocolate em Pó", price: 8.90, market: "Carrefour" },
        { id: 8, name: "Ovos", price: 12.90, market: "BH Supermercados" },
        { id: 9, name: "Manteiga", price: 15.50, market: "Rede Uai" }
      ]
    },
    "macarrão": {
      id: 3,
      title: "Macarrão ao Molho de Tomate",
      description: "Macarrão simples e saboroso com molho caseiro",
      products: [
        { id: 10, name: "Macarrão Espaguete", price: 3.50, market: "Rede Uai" },
        { id: 11, name: "Tomate", price: 7.90, market: "BH Supermercados" },
        { id: 12, name: "Cebola", price: 2.50, market: "Carrefour" },
        { id: 13, name: "Alho", price: 1.80, market: "Rede Uai" },
        { id: 14, name: "Azeite", price: 12.90, market: "BH Supermercados" }
      ]
    }
  };

  // Buscar sugestão baseada na query (case insensitive)
  const normalizedQuery = query.toLowerCase();
  const suggestion = Object.keys(mockSuggestions).find(key => 
    normalizedQuery.includes(key)
  );

  if (suggestion) {
    return mockSuggestions[suggestion];
  }

  // Sugestão padrão se não encontrar match
  return {
    id: Math.floor(Math.random() * 1000) + 1,
    title: `Sugestão para: ${query}`,
    description: "Encontramos algumas opções interessantes para você",
    products: [
      { id: 15, name: "Produto 1", price: 10.00, market: "Mercado A" },
      { id: 16, name: "Produto 2", price: 15.00, market: "Mercado B" },
      { id: 17, name: "Produto 3", price: 20.00, market: "Mercado C" }
    ]
  };
}
