import { getCustomerConversations } from "@/actions/chat.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import Chat from "./components/Chat";
import ConversationCard from "./components/ConversationCard";

interface ChatPageProps {
    params: Promise<{ chatId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
    const { chatId } = await params;
    const conversations = await getCustomerConversations();

    return (
        <div className="flex flex-1 container mx-auto py-6 gap-6">
            <Card className="w-[320px]">
                <CardHeader>
                    <CardTitle>Minhas Conversas</CardTitle>
                    <CardDescription>Conversas com os lojistas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {conversations.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground">
                            Nenhuma conversa ainda. Envie uma mensagem para iniciar uma conversa!
                        </p>
                    ) : (
                        conversations.map((conversation) => {
                            const preview = conversation.lastMessage?.message.slice(0, 70) ?? "";
                            const isActive = conversation.marketId === chatId;

                            return (
                                <ConversationCard
                                    key={conversation.chatId}
                                    conversation={conversation}
                                    isActive={isActive}
                                    preview={preview}
                                />
                            );
                        })
                    )}
                </CardContent>
            </Card>
            {chatId === "inbox" ? (
                <div className="flex flex-col flex-1 justify-center items-center rounded-lg border-2 border-dashed p-6">
                    <MessageCircle className="h-12 w-12 text-primary" />
                    <p className="text-2xl font-bold">Suas mensagens</p>
                    <p className="text-sm text-muted-foreground">Envie mensagens privadas para os lojistas</p>
                </div>
            ) : <Chat chatId={chatId} />}
        </div>
    );
}