"use client";
import { getUnreadMessagesCount } from "@/actions/chat.actions";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ChatButton() {
    const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

    useEffect(() => {
        const fetchUnreadMessagesCount = async () => {
            try {
                const count = await getUnreadMessagesCount();
                setUnreadMessagesCount(count);
            } catch (error) {
                console.error("Erro ao buscar contagem de mensagens não lidas:", error);
                setUnreadMessagesCount(0);
            }
        }
        fetchUnreadMessagesCount();
        
        // Atualizar a cada 10 segundos
        const interval = setInterval(fetchUnreadMessagesCount, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Button variant="outline" size="icon" className="rounded-full relative" asChild aria-label="Chat">
            <Link href="/my/chat/inbox">
                {unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 border border-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
                        {unreadMessagesCount > 99 ? "99+" : unreadMessagesCount}
                    </span>
                )}
                <MessageCircle />
            </Link>
        </Button>
    )
}