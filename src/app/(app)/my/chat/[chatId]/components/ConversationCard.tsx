"use client";

import { cn } from "@/lib/utils";
import moment from "moment";
import { useRouter } from "next/navigation";

interface ConversationCardProps {
    conversation: {
        chatId: string;
        marketId: string;
        storeOwnerUsername: string;
        lastMessage: {
            message: string;
            timestamp: Date | string;
        } | null;
    };
    isActive: boolean;
    preview: string;
}

export default function ConversationCard({ conversation, isActive, preview }: ConversationCardProps) {
    const router = useRouter();

    const handleSelectConversation = () => {
        // Navigate to the chat page - the Chat component will handle socket connection
        router.push(`/my/chat/${conversation.marketId}`);
    };

    return (
        <button
            type="button"
            onClick={handleSelectConversation}
            className={cn(
                "w-full rounded-lg border p-4 text-left transition hover:bg-muted cursor-pointer",
                isActive
                    ? "border-primary bg-muted/60"
                    : "border-transparent bg-card"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="font-semibold text-sm">{conversation.storeOwnerUsername}</div>
                <span className="text-xs text-muted-foreground">
                    {conversation.lastMessage
                        ? moment(conversation.lastMessage.timestamp).format("DD/MM/YYYY HH:mm")
                        : ""}
                </span>
            </div>
            {preview && (
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {preview}
                </p>
            )}
        </button>
    );
}