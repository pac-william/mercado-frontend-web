"use server";

interface LoadingState {
  text: string;
}

// 10 mensagens estáticas para loading states
const STATIC_LOADING_MESSAGES = [
  "Iniciando busca...",
  "Analisando sua solicitação...",
  "Buscando receitas ideais...",
  "Procurando ingredientes frescos...",
  "Selecionando os melhores produtos...",
  "Verificando disponibilidade...",
  "Comparando preços...",
  "Organizando as sugestões...",
  "Finalizando sua lista...",
  "Preparando as sugestões..."
];

export async function generateLoadingStates(): Promise<LoadingState[]> {
  // Retornar as 3 primeiras mensagens estáticas
  return [
    { text: STATIC_LOADING_MESSAGES[0] },
    { text: STATIC_LOADING_MESSAGES[1] },
    { text: STATIC_LOADING_MESSAGES[2] }
  ];
}

// Função para obter todas as mensagens (caso precise no futuro)
export async function getAllLoadingMessages(): Promise<LoadingState[]> {
  return STATIC_LOADING_MESSAGES.map(text => ({ text }));
}
