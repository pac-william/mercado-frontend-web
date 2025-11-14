"use client"

import { createChat, createMessage, getChatByChatId, getCustomerConversations } from "@/actions/chat.actions";
import { getUserMe } from "@/actions/user.actions";
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

const MESSAGING_SERVER_URL = process.env.NEXT_PUBLIC_MESSAGING_SERVER_URL;

interface ChatMessage {
    id: string;
    chat: string;
    username: string;
    message: string;
    timestamp: Date | string;
}

interface Conversation {
    chatId: string;
    marketId: string;
    storeOwnerUsername: string;
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
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [isJoiningRoom, setIsJoiningRoom] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [storeOwnerUsername, setStoreOwnerUsername] = useState<string | null>(null);
    const [backendUserId, setBackendUserId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentRoomIdRef = useRef<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const backendUserIdRef = useRef<string | null>(null);
    const chatIdRef = useRef<string | null>(null);

    // Auto-scroll to last message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Connect to Socket.IO and setup events
    useEffect(() => {
        if (userLoading || !user?.name) return;

        const newSocket = io(MESSAGING_SERVER_URL, {
            transports: ["websocket", "polling"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        // Connection established event
        newSocket.on("connect", () => {
            console.log("Connected:", newSocket.id);
            setIsConnected(true);
            // Register as client
            newSocket.emit("cliente:join", { username: user.name || "User" });
        });

        socketRef.current = newSocket;

        // Client registered event
        newSocket.on("cliente:joined", async () => {
            // Fetch conversations from backend
            try {
                const backendConversations = await getCustomerConversations();
                // Convert to component expected format
                const formattedConversations: Conversation[] = backendConversations.map(conv => ({
                    chatId: conv.chatId, // chatId is {userId}-{marketId}
                    marketId: conv.marketId,
                    storeOwnerUsername: conv.storeOwnerUsername,
                    isActive: conv.isActive,
                    lastMessage: conv.lastMessage ? {
                        message: conv.lastMessage.message,
                        timestamp: typeof conv.lastMessage.timestamp === 'string' 
                            ? new Date(conv.lastMessage.timestamp) 
                            : conv.lastMessage.timestamp
                    } : null
                }));
                setConversations(formattedConversations);
            } catch (error) {
                console.error("Error fetching conversations from backend:", error);
            }
        });

        // Chat joined event (confirmation of entering chat)
        newSocket.on("chat:joined", (data: { chatId: string; marketId: string; lojistaUsername: string }) => {
            console.log("Joined chat:", data);
            setStoreOwnerUsername(data.lojistaUsername);
            currentRoomIdRef.current = data.chatId;
        });

        // Message history event when entering chat
        newSocket.on("chat:messages", async (receivedMessages: ChatMessage[]) => {
            // Fetch persisted messages from backend if roomId exists
            if (currentRoomIdRef.current) {
                try {
                    const chatWithMessages = await getChatByChatId(currentRoomIdRef.current);
                    if (chatWithMessages && chatWithMessages.messages.length > 0) {
                        // Convert backend messages to expected format
                        // Incluir userId nas mensagens para comparação correta
                        const formattedMessages: ChatMessage[] = chatWithMessages.messages.map(msg => ({
                            id: msg.id,
                            chat: msg.chatId,
                            username: msg.username,
                            message: msg.message,
                            timestamp: typeof msg.createdAt === 'string' ? new Date(msg.createdAt) : msg.createdAt,
                            userId: msg.userId // Incluir userId para comparação
                        } as ChatMessage & { userId?: string }));
                        setMessages(formattedMessages);
                    } else {
                        // Chat doesn't exist yet or has no messages, use socket messages
                        setMessages(receivedMessages.map(msg => ({
                            ...msg,
                            timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
                        })));
                    }
                } catch (error) {
                    console.error("Error fetching messages from backend:", error);
                    // Fallback to socket messages
                    setMessages(receivedMessages.map(msg => ({
                        ...msg,
                        timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
                    })));
                }
            } else {
                // Fallback to socket messages
                setMessages(receivedMessages.map(msg => ({
                    ...msg,
                    timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
                })));
            }
            setIsJoiningRoom(false);
        });

        // New message received event
        newSocket.on("chat:message-received", (message: ChatMessage) => {
            // Usar refs para acessar valores atuais (evita problemas de closure)
            const currentBackendUserId = backendUserIdRef.current;
            const currentChatId = chatIdRef.current;
            const currentUser = user;
            
            console.log("[CLIENTE] Message received from socket:", message);
            console.log("[CLIENTE] Current chatId from URL:", currentChatId);
            console.log("[CLIENTE] Backend userId:", currentBackendUserId);
            
            // Check if message is from current chat
            const expectedChatId = currentBackendUserId && currentChatId 
                ? `${currentBackendUserId}-${currentChatId}` 
                : currentRoomIdRef.current;
            
            console.log("[CLIENTE] Expected chatId:", expectedChatId);
            console.log("[CLIENTE] Message chatId:", message.chat);
            console.log("[CLIENTE] Match:", expectedChatId === message.chat);
            
            if (expectedChatId && message.chat === expectedChatId) {
                // Check for duplicates
                setMessages(prev => {
                    // 1. Verificar se a mensagem já existe pelo ID
                    const existsById = prev.some(msg => msg.id === message.id);
                    if (existsById) {
                        console.log("[CLIENTE] Duplicate message detected by ID, skipping");
                        return prev;
                    }
                    
                    // 2. Verificar se é uma mensagem própria (do próprio usuário)
                    // Mensagens próprias são persistidas ANTES de enviar via socket
                    // Então quando chegam via socket, já devem existir no estado (persistidas com userId)
                    const isOwnMessage = message.username === (currentUser?.name || "User");
                    if (isOwnMessage && currentBackendUserId) {
                        console.log("[CLIENTE] É mensagem própria, verificando duplicação...");
                        
                        // Verificar se já existe uma mensagem persistida com o mesmo conteúdo e nosso userId
                        const hasPersistedMessage = prev.some(msg => {
                            const msgUserId = (msg as ChatMessage & { userId?: string }).userId;
                            const sameContent = msg.message === message.message && 
                                               msg.username === message.username;
                            
                            // Se a mensagem tem userId e é igual ao nosso backendUserId, é uma mensagem persistida nossa
                            if (msgUserId === currentBackendUserId && sameContent) {
                                console.log("[CLIENTE] Encontrada mensagem persistida com mesmo conteúdo e userId");
                                return true;
                            }
                            return false;
                        });
                        
                        if (hasPersistedMessage) {
                            console.log("[CLIENTE] Mensagem própria já persistida detectada, ignorando mensagem do socket");
                            return prev; // Não adicionar mensagem do socket se já temos a persistida
                        }
                        
                        // Verificar por conteúdo e timestamp próximo (caso a mensagem persistida ainda não tenha sido adicionada)
                        const messageTime = typeof message.timestamp === 'string' 
                            ? new Date(message.timestamp).getTime() 
                            : message.timestamp.getTime();
                        
                        const duplicateByContent = prev.some(msg => {
                            const msgTime = typeof msg.timestamp === 'string' 
                                ? new Date(msg.timestamp).getTime() 
                                : msg.timestamp.getTime();
                            
                            const timeDiff = Math.abs(messageTime - msgTime);
                            const sameContent = msg.message === message.message && 
                                               msg.username === message.username;
                            
                            // Se conteúdo é igual, username é igual e timestamp é muito próximo (< 10 segundos)
                            // Provavelmente é a mesma mensagem
                            if (sameContent && timeDiff < 10000) {
                                console.log("[CLIENTE] Encontrada mensagem duplicada por conteúdo/timestamp (diff:", timeDiff, "ms)");
                                return true;
                            }
                            return false;
                        });
                        
                        if (duplicateByContent) {
                            console.log("[CLIENTE] Mensagem própria duplicada por conteúdo/timestamp, ignorando socket");
                            return prev;
                        }
                        
                        console.log("[CLIENTE] Mensagem própria não é duplicada, mas não deveria chegar via socket");
                        // Mesmo que não seja detectada como duplicada, se é nossa mensagem e não tem userId,
                        // provavelmente já foi persistida e não devemos adicionar
                        // Verificar se existe alguma mensagem recente (últimos 10 segundos) com o mesmo conteúdo
                        const recentMessage = prev.some(msg => {
                            const msgTime = typeof msg.timestamp === 'string' 
                                ? new Date(msg.timestamp).getTime() 
                                : msg.timestamp.getTime();
                            const timeDiff = Math.abs(messageTime - msgTime);
                            return msg.message === message.message && timeDiff < 10000;
                        });
                        
                        if (recentMessage) {
                            console.log("[CLIENTE] Mensagem própria recente encontrada, ignorando socket");
                            return prev;
                        }
                    }
                    
                    // 3. Mensagem não é duplicada (é do lojista ou não é duplicata), adicionar ao estado
                    console.log("[CLIENTE] Adding message to state (not duplicate)");
                    return [...prev, {
                        ...message,
                        timestamp: typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp
                    }];
                });
            } else {
                console.log("[CLIENTE] Message chatId doesn't match current chat, ignoring");
            }
            
            // Update last message in conversations
            setConversations(prev => prev.map(conv => 
                conv.chatId === message.chat
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

        // User left chat event
        newSocket.on("chat:user-left", (data: { username: string; chatId: string }) => {
            console.log(`${data.username} left chat`);
        });

        // User disconnected event
        newSocket.on("chat:user-disconnected", (data: { username: string; chatId: string }) => {
            console.log(`${data.username} disconnected`);
        });

        // Error event
        newSocket.on("error", (error: { message: string }) => {
            console.error("Error:", error.message);
        });

        // Disconnect event
        newSocket.on("disconnect", () => {
            console.log("Disconnected from server");
            setIsConnected(false);
        });

        setSocket(newSocket);

        // Cleanup on unmount
        return () => {
            if (newSocket) {
                newSocket.emit("chat:leave");
                newSocket.disconnect();
            }
        };
    }, [user, userLoading]);

    // Fetch backend userId when user loads
    useEffect(() => {
        if (user && !backendUserId) {
            getUserMe().then(userData => {
                setBackendUserId(userData.id);
                backendUserIdRef.current = userData.id;
            }).catch(error => {
                console.error("Error fetching backend userId:", error);
            });
        }
    }, [user, backendUserId]);
    
    // Atualizar refs quando chatId ou backendUserId mudarem
    useEffect(() => {
        chatIdRef.current = chatId;
        backendUserIdRef.current = backendUserId;
    }, [chatId, backendUserId]);

    // Join chat when connected and when chatId changes
    useEffect(() => {
        const socket = socketRef.current;
        if (!socket?.connected || !chatId || !backendUserId) return;

        const enterChat = async () => {
            // Calculate chatId: {userId}-{marketId}
            const calculatedChatId = `${backendUserId}-${chatId}`;
            
            // Leave previous chat if different
            if (currentRoomIdRef.current && currentRoomIdRef.current !== calculatedChatId) {
                socket.emit("chat:leave");
            }

            // Create or ensure chat exists in backend
            try {
                await createChat(calculatedChatId, backendUserId, chatId);
                currentRoomIdRef.current = calculatedChatId;
            } catch (error) {
                console.error("Error creating chat in backend:", error);
            }

            // Load persisted messages from backend
            try {
                const chatWithMessages = await getChatByChatId(calculatedChatId);
                if (chatWithMessages && chatWithMessages.messages.length > 0) {
                    // Incluir userId nas mensagens para comparação correta
                    const formattedMessages: ChatMessage[] = chatWithMessages.messages.map(msg => ({
                        id: msg.id,
                        chat: msg.chatId,
                        username: msg.username,
                        message: msg.message,
                        timestamp: typeof msg.createdAt === 'string' ? new Date(msg.createdAt) : msg.createdAt,
                        userId: msg.userId // Incluir userId para comparação
                    } as ChatMessage & { userId?: string }));
                    setMessages(formattedMessages);
                    setIsJoiningRoom(false);
                } else {
                    setIsJoiningRoom(false);
                }
            } catch (error) {
                console.error("Error loading messages from backend:", error);
                setIsJoiningRoom(false);
            }

            // Join the chat with backendUserId to ensure correct chatId
            setIsJoiningRoom(true);
            socket.emit("chat:join-market", { 
                marketId: chatId,
                userId: backendUserId // Pass backendUserId to ensure correct chatId format
            });
        };

        enterChat();
    }, [chatId, isConnected, backendUserId]);

    // Cleanup on page exit
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

    // Select conversation
    const handleSelectConversation = (marketId: string) => {
        if (!socketRef.current?.connected) return;
        
        // Update URL
        router.push(`/chat/${marketId}`);
        
        // Calculate roomId for new conversation
        if (backendUserId) {
            const newRoomId = `${backendUserId}-${marketId}`;
            
            // Leave previous room if different
            if (currentRoomIdRef.current && currentRoomIdRef.current !== newRoomId) {
                socketRef.current.emit("chat:leave");
            }
            
            // Update current roomId
            currentRoomIdRef.current = newRoomId;
        }
        
        // Join new room with backendUserId to ensure correct chatId
        setIsJoiningRoom(true);
        setMessages([]);
        socketRef.current.emit("chat:join-market", { 
            marketId,
            userId: backendUserId // Pass backendUserId to ensure correct chatId format
        });
    };

    // Send message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!socketRef.current || !messageInput.trim() || isSending || !chatId || !backendUserId) return;

        const messageText = messageInput.trim();
        setMessageInput("");
        setIsSending(true);

        // Calculate chatId correctly: {userId}-{marketId}
        const calculatedChatId = `${backendUserId}-${chatId}`;
        
        // Update currentRoomIdRef if necessary
        if (currentRoomIdRef.current !== calculatedChatId) {
            currentRoomIdRef.current = calculatedChatId;
        }

        // Persistir no backend PRIMEIRO (antes de enviar via socket)
        // Isso garante que temos o ID correto e evitamos duplicação
        try {
            const persistedMessage = await createMessage(calculatedChatId, messageText);
            console.log("[CLIENTE] Mensagem persistida:", persistedMessage.id);
            
            // Adicionar mensagem persistida ao estado
            setMessages(prev => {
                // Verificar se já existe (pode ter chegado via socket antes da persistência)
                const alreadyExists = prev.some(msg => 
                    msg.id === persistedMessage.id ||
                    ((msg as ChatMessage & { userId?: string }).userId === persistedMessage.userId &&
                     msg.message === persistedMessage.message &&
                     msg.username === persistedMessage.username)
                );
                
                if (alreadyExists) {
                    console.log("[CLIENTE] Mensagem persistida já existe no estado, atualizando");
                    // Atualizar mensagem existente com dados persistidos (garantir ID correto)
                    return prev.map(msg => {
                        if (msg.id === persistedMessage.id || 
                            ((msg as ChatMessage & { userId?: string }).userId === persistedMessage.userId &&
                             msg.message === persistedMessage.message &&
                             msg.username === persistedMessage.username)) {
                            return {
                                ...msg,
                                id: persistedMessage.id, // Garantir ID correto do banco
                                userId: persistedMessage.userId
                            } as ChatMessage & { userId?: string };
                        }
                        return msg;
                    });
                }
                
                // Adicionar mensagem persistida
                console.log("[CLIENTE] Adicionando mensagem persistida ao estado");
                return [...prev, {
                    id: persistedMessage.id,
                    chat: persistedMessage.chatId,
                    username: persistedMessage.username,
                    message: persistedMessage.message,
                    timestamp: typeof persistedMessage.createdAt === 'string' 
                        ? new Date(persistedMessage.createdAt) 
                        : persistedMessage.createdAt,
                    userId: persistedMessage.userId
                } as ChatMessage & { userId?: string }];
            });
            
            // Enviar via Socket.IO DEPOIS de persistir
            // Quando chegar via socket, a verificação de duplicação vai ignorar porque já temos a persistida
            socketRef.current.emit("chat:send-message", {
                message: messageText,
            });
        } catch (error) {
            console.error("Error persisting message in backend:", error);
            // Se falhar a persistência, ainda enviar via socket (mensagem temporária)
            socketRef.current.emit("chat:send-message", {
                message: messageText,
            });
        } finally {
            setIsSending(false);
        }
    };

    // Format timestamp
    const formatTimestamp = (timestamp: Date | string) => {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return "Now";
        if (minutes < 60) return `${minutes}min ago`;
        if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;

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
                    <p className="text-muted-foreground">Please login to use chat</p>
                </CardContent>
            </Card>
        );
    }

    const currentUsername = user.name || "User";

    return (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] h-full">
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>My Chats</CardTitle>
                    <CardDescription>Conversations with store owners</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    {conversations.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground">
                            No conversations yet. Send a message to get started!
                        </p>
                    ) : (
                        conversations.map((conversation) => {
                            const preview = conversation.lastMessage?.message.slice(0, 70) ?? "";
                            const isActive = conversation.marketId === chatId;

                            return (
                                <button
                                    key={conversation.chatId}
                                    type="button"
                                    onClick={() => handleSelectConversation(conversation.marketId)}
                                    className={cn(
                                        "w-full rounded-lg border p-4 text-left transition hover:bg-muted",
                                        isActive
                                            ? "border-primary bg-muted/60"
                                            : "border-transparent bg-card"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold text-sm">{conversation.storeOwnerUsername}</div>
                                        <span className="text-xs text-muted-foreground">
                                            {conversation.lastMessage
                                                ? formatTimeShort(conversation.lastMessage.timestamp)
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
                            <h2 className="text-lg font-semibold">Chat - {chatId}</h2>
                            {storeOwnerUsername && (
                                <p className="text-sm text-muted-foreground">
                                    Chatting with {storeOwnerUsername}
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
                                {isConnected ? "Connected" : "Disconnected"}
                            </span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                {isJoiningRoom ? (
                    <div className="flex items-center justify-center flex-1">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2 text-sm text-muted-foreground">
                            Joining room...
                        </span>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-8">
                                        <p>No messages yet.</p>
                                        <p className="text-sm mt-2">Be the first to send a message!</p>
                                    </div>
                                ) : (
                                    messages.map((message) => {
                                        // Comparar por userId se disponível, caso contrário usar username
                                        const messageUserId = (message as ChatMessage & { userId?: string }).userId;
                                        const isOwnMessage = messageUserId 
                                            ? messageUserId === backendUserId 
                                            : message.username === currentUsername;
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
                                placeholder="Type your message..."
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
