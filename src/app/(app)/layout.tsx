import { getSuggestionById, getUserSuggestions } from "@/actions/suggestion.actions";
import { auth0 } from "@/lib/auth0";
import { Suggestion } from "@/types/suggestion";
import Header from "../components/Header";
import HistorySideMenu from "../components/HistorySideMenu";
import { SuggestionListItem } from "../domain/suggestionDomain";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth0.getSession();

    let suggestionData: Suggestion[] = [];

    if (session) {
        try {
            const { suggestions } = await getUserSuggestions(1, 100);

            const fetchedSuggestionData = await Promise.all(suggestions.map((suggestion: SuggestionListItem) =>
                getSuggestionById(suggestion.id).catch(() => null)
            ));

            suggestionData = fetchedSuggestionData.filter((s): s is Suggestion => s !== null);
        } catch (error) {
            console.error('Erro ao buscar histórico de sugestões:', error);
        }
    }

    return (
        <div className="flex flex-1 flex-row h-screen bg-background text-foreground">
            {session && <HistorySideMenu suggestions={suggestionData} />}
            <div className="flex flex-1 flex-col">
                <Header />
                {children}
            </div>
        </div >
    )
}