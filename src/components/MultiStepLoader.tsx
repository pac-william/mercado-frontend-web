"use client";
import { getAllLoadingMessages } from "@/actions/loadingState.actions";
import { createSuggestion } from "@/actions/suggestion.actions";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Button } from "./ui/button";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";

interface LoadingState {
  text: string;
}

interface MultiStepLoaderSearchProps {
  inputValue: string;
}

export interface MultiStepLoaderSearchRef {
  triggerSearch: () => void;
  cancelSearch: () => void;
}

export const MultiStepLoaderSearch = forwardRef<MultiStepLoaderSearchRef, MultiStepLoaderSearchProps>(
  ({ inputValue }, ref) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState<LoadingState[]>([
    { text: "Iniciando busca..." },
    { text: "Processando..." },
    { text: "Finalizando..." }
  ]);

  const handleSubmitSearch = async (state: boolean) => {
    if (inputValue.trim() === "") {
      return;
    }

    // Definir loading imediatamente
    setLoading(state);

    if (state && inputValue.trim()) {
      // Definir estado inicial imediatamente
      setLoadingStates([
        { text: "Iniciando busca..." },
        { text: "Analisando sua solicitação..." },
        { text: "Buscando receitas ideais..." },
        { text: "Procurando ingredientes frescos..." },
        { text: "Selecionando os melhores produtos..." },
        { text: "Verificando disponibilidade..." },
        { text: "Comparando preços..." },
        { text: "Organizando as sugestões..." },
        { text: "Finalizando sua lista..." },
        { text: "Preparando as sugestões..." }
      ]);

      try {
        // Obter todos os loadingStates estáticos
        const allStates = await getAllLoadingMessages();

        // Atualizar os estados progressivamente
        for (let i = 0; i < allStates.length; i++) {
          setLoadingStates(prev => {
            const newStates = [...prev];
            // Garantir que o array tenha o tamanho suficiente
            while (newStates.length <= i) {
              newStates.push({ text: "" });
            }
            newStates[i] = allStates[i];
            return newStates;
          });

          // Pequeno delay entre atualizações para mostrar progresso
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Criar sugestão via POST
        const suggestionResult = await createSuggestion(inputValue);

        // Redirecionar para a página de sugestão com o ID retornado
        router.push(`/my/suggestion/${suggestionResult.id}`);

      } catch (error) {
        console.error('Erro ao criar sugestão:', error);
        // Em caso de erro, não redirecionar, apenas parar o loading
        setLoading(false);
      }
    }
  }

  // Expor métodos para o componente pai
  useImperativeHandle(ref, () => ({
    triggerSearch: () => handleSubmitSearch(true),
    cancelSearch: () => handleSubmitSearch(false),
  }));

  return (
    <>
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} loop={false} />

      {loading && (
        <Button
          variant="ghost"
          size="icon_lg"
          className="fixed top-4 right-4 text-black dark:text-white z-[120]" type="button" onClick={() => handleSubmitSearch(false)}>
          <X size={24} className="text-muted-foreground" />
        </Button>
      )}
    </>
  );
});

MultiStepLoaderSearch.displayName = "MultiStepLoaderSearch";
