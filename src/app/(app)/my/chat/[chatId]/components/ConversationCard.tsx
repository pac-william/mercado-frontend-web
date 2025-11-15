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
        unreadCount: number;
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
                "w-full rounded-lg border p-4 text-left transition hover:bg-muted cursor-pointer relative",
                isActive
                    ? "border-primary bg-muted/60"
                    : "border-transparent bg-card"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="font-semibold text-sm flex items-center gap-2">
                    {conversation.storeOwnerUsername}
                    {conversation.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                            {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
                        </span>
                    )}
                </div>
                <span className="text-xs text-muted-foreground">
                    {conversation.lastMessage
                        ? moment(conversation.lastMessage.timestamp).format("DD/MM/YYYY HH:mm")
                        : ""}
                </span>
            </div>
            {preview && (
                <p className={cn(
                    "mt-2 text-xs line-clamp-2",
                    conversation.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"
                )}>
                    {preview}
                </p>
            )}
        </button>
    );
}