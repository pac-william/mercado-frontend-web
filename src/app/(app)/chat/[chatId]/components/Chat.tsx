"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Loader2, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const MESSAGING_SERVER_URL = "http://localhost:4000";

interface Message {
    id: string;
    room: string;
    username: string;
    message: string;
    timestamp: Date | string;
}

interface Conversa {
    roomId: string;
    marketId: string;
    lojistaUsername: string;
    isActive: boolean;
    lastMessage: {
        message: string;
        timestamp: Date | string;
    } | null;
}

export default function Chat({ chatId }: { chatId: string }) {
    const { user, isLoading: userLoading } = useUser();
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [conversas, setConversas] = useState<Conversa[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [lojistaUsername, setLojistaUsername] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentRoomIdRef = useRef<string | null>(null);
    const socketRef = useRef<Socket | null>(null);

    // Scroll automático para a última mensagem
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Conectar ao Socket.IO e configurar eventos
    useEffect(() => {
        if (userLoading || !user?.name) return;

        const newSocket = io(MESSAGING_SERVER_URL, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Evento: Conexão estabelecida
        newSocket.on("connect", () => {
            console.log("Conectado:", newSocket.id);
            setIsConnected(true);
            // Registrar como cliente
            newSocket.emit("cliente:join", { username: user.name || "Usuário" });
        });

        socketRef.current = newSocket;

        // Evento: Cliente registrado
        newSocket.on("cliente:joined", () => {
            // Listar conversas do cliente
            newSocket.emit("cliente:conversas");
        });

        // Evento: Receber lista de conversas
        newSocket.on("cliente:conversas", (conversas: Conversa[]) => {
            console.log("Conversas recebidas:", conversas);
            setConversas(conversas);
        });

        // Evento: Chat conectado (confirmação de entrada no chat)
        newSocket.on("chat:joined", (data: { roomId: string; marketId: string; lojistaUsername: string }) => {
            console.log("Entrou no chat:", data);
            setLojistaUsername(data.lojistaUsername);
            currentRoomIdRef.current = data.roomId;
        });

        // Evento: Histórico de mensagens ao entrar no chat
        newSocket.on("chat:messages", (receivedMessages: Message[]) => {
            setMessages(receivedMessages.map(msg => ({
                ...msg,
                timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
            })));
            setIsJoiningRoom(false);
        });

        // Evento: Nova mensagem recebida
        newSocket.on("chat:message-received", (message: Message) => {
            // Verificar se a mensagem é do chat atual
            if (currentRoomIdRef.current === message.room) {
                // Verificar duplicação
                setMessages(prev => {
                    const exists = prev.some(msg => msg.id === message.id);
                    if (exists) return prev;
                    return [...prev, {
                        ...message,
                        timestamp: typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp
                    }];
                });
            }
            
            // Atualizar última mensagem nas conversas
            setConversas(prev => prev.map(conv => 
                conv.roomId === message.room
                    ? {
                        ...conv,
                        lastMessage: {
                            message: message.message,
                            timestamp: message.timestamp
                        }
                    }
                    : conv
            ));
        });

        // Evento: Usuário saiu do chat
        newSocket.on("chat:user-left", (data: { username: string; roomId: string }) => {
            console.log(`${data.username} saiu do chat`);
        });

        // Evento: Usuário desconectou
        newSocket.on("chat:user-disconnected", (data: { username: string; roomId: string }) => {
            console.log(`${data.username} desconectou`);
        });

        // Evento: Erro
        newSocket.on("error", (error: { message: string }) => {
            console.error("Erro:", error.message);
        });

        // Evento: Desconexão
        newSocket.on("disconnect", () => {
            console.log("Desconectado do servidor");
            setIsConnected(false);
        });

        setSocket(newSocket);

        // Limpeza ao desmontar
        return () => {
            if (newSocket) {
                newSocket.emit("chat:leave");
                newSocket.disconnect();
            }
        };
    }, [user, userLoading]);

    // Entrar no chat quando conectar e quando o chatId mudar
    useEffect(() => {
        if (!socketRef.current?.connected || !chatId) return;

        // Sair da sala anterior
        if (currentRoomIdRef.current && currentRoomIdRef.current !== `${socketRef.current.id}-${chatId}`) {
            socketRef.current.emit("chat:leave");
        }

        // Entrar na nova sala
        setIsJoiningRoom(true);
        setMessages([]);
        socketRef.current.emit("chat:join-market", { marketId: chatId });
    }, [chatId, isConnected]);

    // Limpeza ao sair da página
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (socket) {
                socket.emit("chat:leave");
                socket.disconnect();
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [socket]);

    // Selecionar conversa
    const handleSelectConversa = (marketId: string) => {
        if (!socketRef.current?.connected) return;
        
        // Atualizar URL
        router.push(`/chat/${marketId}`);
        
        // Sair da sala anterior
        if (currentRoomIdRef.current) {
            socketRef.current.emit("chat:leave");
        }
        
        // Entrar na nova sala
        setIsJoiningRoom(true);
        setMessages([]);
        socketRef.current.emit("chat:join-market", { marketId });
    };

    // Enviar mensagem
    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!socketRef.current || !messageInput.trim() || isSending) return;

        setIsSending(true);

        socketRef.current.emit("chat:send-message", {
            message: messageInput.trim(),
        });

        setMessageInput("");
        setIsSending(false);
    };

    // Formatação de data/hora
    const formatTimestamp = (timestamp: Date | string) => {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "Agora";
        if (minutes < 60) return `${minutes}min atrás`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h atrás`;

        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTimeShort = (timestamp: Date | string) => {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        return date.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (userLoading) {
        return (
            <Card className="flex flex-col h-full">
                <CardContent className="flex items-center justify-center flex-1">
                    <Loader2 className="h-6 w-6 animate-spin" />
                </CardContent>
            </Card>
        );
    }

    if (!user) {
        return (
            <Card className="flex flex-col h-full">
                <CardContent className="flex items-center justify-center flex-1">
                    <p className="text-muted-foreground">Faça login para usar o chat</p>
                </CardContent>
            </Card>
        );
    }

    const currentUsername = user.name || "Usuário";

    return (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Meus Chats</CardTitle>
                    <CardDescription>Conversas com lojistas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {conversas.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground">
                            Nenhuma conversa ainda. Envie uma mensagem para começar!
                        </p>
                    ) : (
                        conversas.map((conversa) => {
                            const preview = conversa.lastMessage?.message.slice(0, 70) ?? "";
                            const isActive = conversa.marketId === chatId;

                            return (
                                <button
                                    key={conversa.roomId}
                                    type="button"
                                    onClick={() => handleSelectConversa(conversa.marketId)}
                                    className={cn(
                                        "w-full rounded-lg border p-4 text-left transition hover:bg-muted",
                                        isActive
                                            ? "border-primary bg-muted/60"
                                            : "border-transparent bg-card"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold text-sm">{conversa.lojistaUsername}</div>
                                        <span className="text-xs text-muted-foreground">
                                            {conversa.lastMessage
                                                ? formatTimeShort(conversa.lastMessage.timestamp)
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
                        })
                    )}
                </CardContent>
            </Card>

            <Card className="flex flex-col h-full max-h-[calc(100vh-200px)]">
                <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <h2 className="text-lg font-semibold">Chat - Market {chatId}</h2>
                            {lojistaUsername && (
                                <p className="text-sm text-muted-foreground">
                                    Conversando com {lojistaUsername}
                                </p>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div
                                className={cn(
                                    "h-2 w-2 rounded-full",
                                    isConnected ? "bg-green-500" : "bg-red-500"
                                )}
                            />
                            <span className="text-sm text-muted-foreground">
                                {isConnected ? "Conectado" : "Desconectado"}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {isJoiningRoom ? (
                    <div className="flex items-center justify-center flex-1">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2 text-sm text-muted-foreground">
                            Entrando na sala...
                        </span>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        <p>Nenhuma mensagem ainda.</p>
                                        <p className="text-sm mt-2">Seja o primeiro a enviar uma mensagem!</p>
                                    </div>
                                ) : (
                                    messages.map((message) => {
                                        const isOwnMessage = message.username === currentUsername;
                                        return (
                                            <div
                                                key={message.id}
                                                className={cn(
                                                    "flex flex-col gap-1",
                                                    isOwnMessage ? "items-end" : "items-start"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "rounded-lg px-4 py-2 max-w-[80%]",
                                                        isOwnMessage
                                                            ? "bg-primary text-primary-foreground"
                                                            : "bg-muted"
                                                    )}
                                                >
                                                    {!isOwnMessage && (
                                                        <p className="text-xs font-semibold mb-1 opacity-80">
                                                            {message.username}
                                                        </p>
                                                    )}
                                                    <p className="text-sm">{message.message}</p>
                                                    <p
                                                        className={cn(
                                                            "text-xs mt-1",
                                                            isOwnMessage ? "opacity-70" : "opacity-60"
                                                        )}
                                                    >
                                                        {formatTimestamp(message.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>
                        <form
                            onSubmit={handleSendMessage}
                            className="border-t p-4 flex gap-2"
                        >
                            <Input
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                placeholder="Digite sua mensagem..."
                                disabled={!isConnected || isSending}
                                className="flex-1"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            <Button
                                type="submit"
                                disabled={!isConnected || !messageInput.trim() || isSending}
                                size="icon"
                            >
                                {isSending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Send className="h-4 w-4" />
                                )}
                            </Button>
                        </form>
                    </>
                )}
                </CardContent>
            </Card>
        </div>
    );
}