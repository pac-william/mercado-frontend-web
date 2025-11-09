import { getUserSuggestions } from "@/actions/suggestion.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeftIcon } from "lucide-react";
import { SuggestionListItem } from "../domain/suggestionDomain";

export default async function HistorySideMenu() {

    const { suggestions, meta } = await getUserSuggestions(1, 10);

    return (
        <Card className="min-w-64 rounded-none border-y-0 border-l-0 border-r border-border">
            <CardHeader>
                <CardTitle>History Side Menu</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="flex flex-col flex-grow h-0 overflow-y-auto">
                    <div className="flex flex-col gap-4">
                        <h1>History Side Menu</h1>
                        {suggestions.map((suggestion: SuggestionListItem) => (
                            <div key={suggestion.id}>
                                <h2>{suggestion.id}</h2>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <Button>
                    <ArrowLeftIcon />
                    <span>Back</span>
                </Button>
            </CardFooter>
        </Card>
    )
}