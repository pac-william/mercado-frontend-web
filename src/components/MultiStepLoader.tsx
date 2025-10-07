"use client";
import { generateLoadingStates } from "@/actions/loadingState.actions";
import { searchSuggestions } from "@/actions/suggestion.actions";
import { SearchIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
import { MultiStepLoader as Loader } from "./ui/multi-step-loader";

interface LoadingState {
  text: string;
}

interface MultiStepLoaderSearchProps {
  inputValue: string;
}

export function MultiStepLoaderSearch({ inputValue }: MultiStepLoaderSearchProps) {
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
        // Obter loadingStates estáticos
        const staticStates = await generateLoadingStates();

        // Atualizar os estados progressivamente
        for (let i = 0; i < staticStates.length; i++) {
          setLoadingStates(prev => {
            const newStates = [...prev];
            newStates[i] = staticStates[i];
            return newStates;
          });

          // Pequeno delay entre atualizações para mostrar progresso
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        // Executar busca de sugestões (que demora 5 segundos)
        const suggestionResult = await searchSuggestions(inputValue);

        // Redirecionar para a página de sugestão com o ID retornado
        router.push(`/suggestion/${suggestionResult.id}`);

      } catch (error) {
        console.error('Erro ao buscar sugestões:', error);
        // Em caso de erro, redirecionar para uma sugestão padrão
        router.push(`/suggestion/1`);
      }
    }
  }

  return (
    <>
      {/* Core Loader Modal */}
      <Loader loadingStates={loadingStates} loading={loading} duration={2000} loop={false} />

      {/* The buttons are for demo only, remove it in your actual code ⬇️ */}
      <Button
        onClick={() => handleSubmitSearch(true)}
        variant="ghost"
        size="icon_lg"
        className="rounded-none hover:bg-accent hover:text-accent-foreground"
      >
        <SearchIcon size={24} className="text-muted-foreground" />
      </Button>

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
}
