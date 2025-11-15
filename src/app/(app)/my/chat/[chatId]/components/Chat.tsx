"use client"

import { createChat, createMessage, getChatByChatId, getCustomerConversations, markMessagesAsRead } from "@/actions/chat.actions";
import { getMarketById } from "@/actions/market.actions";
import { getUserMe } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useUser } from "@auth0/nextjs-auth0/client";
import { AlertCircle, Check, CheckCheck, Loader, Send } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const MESSAGING_SERVER_URL = process.env.NEXT_PUBLIC_MESSAGING_SERVER_URL;

type MessageStatus = "not_sent" | "sent" | "delivered" | "read";

interface ChatMessage {
    id: string;
    chat: string;
    username: string;
    message: string;
    timestamp: Date | string;
    status?: MessageStatus;
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
    const [socket, setSocket] = useState<Socket | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isJoiningRoom, setIsJoiningRoom] = useState(false); // Used internally for state management
    const [isSending, setIsSending] = useState(false);
    const [storeOwnerUsername, setStoreOwnerUsername] = useState<string | null>(null);
    const [backendUserId, setBackendUserId] = useState<string | null>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [marketName, setMarketName] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const currentRoomIdRef = useRef<string | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const backendUserIdRef = useRef<string | null>(null);
    const chatIdRef = useRef<string | null>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isTypingRef = useRef<boolean>(false);
    const markReadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lastMarkReadRef = useRef<number>(0);
    const isWindowFocusedRef = useRef<boolean>(true);

    // Auto-scroll to last message
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Função para marcar mensagens como lidas com debounce
    const markMessagesAsReadDebounced = useCallback(() => {
        if (!chatId || !backendUserId || !socketRef.current?.connected) return;

        const calculatedChatId = `${backendUserId}-${chatId}`;
        const now = Date.now();

        // Evitar marcar como lido muito frequentemente (mínimo 2 segundos entre chamadas)
        if (now - lastMarkReadRef.current < 2000) {
            return;
        }

        // Limpar timeout anterior
        if (markReadTimeoutRef.current) {
            clearTimeout(markReadTimeoutRef.current);
        }

        // Debounce: aguardar 1 segundo após a última interação
        markReadTimeoutRef.current = setTimeout(async () => {
            // Só marcar como lido se a janela estiver em foco
            if (!isWindowFocusedRef.current) {
                return;
            }

            // Marcar mensagens como lidas (cliente sempre marca, independente de presença)
            markMessagesAsRead(calculatedChatId).then((result) => {
                lastMarkReadRef.current = Date.now();
                console.log("[CLIENTE] Mensagens marcadas como lidas:", result);

                // Notificar o lojista via socket se estiver conectado
                if (socketRef.current?.connected) {
                    socketRef.current.emit("chat:messages-read", {
                        chatId: calculatedChatId,
                    });
                }
            }).catch((error) => {
                console.error("[CLIENTE] Erro ao marcar mensagens como lidas:", error);
            });
        }, 1000);
    }, [chatId, backendUserId]);

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
                        // Mensagens do backend têm status baseado no readAt
                        const formattedMessages: ChatMessage[] = chatWithMessages.messages.map(msg => {
                            const isOwnMessage = msg.userId === (backendUserIdRef.current || backendUserId);
                            let status: MessageStatus | undefined = undefined;
                            
                            if (isOwnMessage) {
                                // Se é mensagem do próprio cliente, verificar se foi lida
                                status = msg.readAt ? "read" as MessageStatus : "delivered" as MessageStatus;
                            }
                            
                            return {
                                id: msg.id,
                                chat: msg.chatId,
                                username: msg.username,
                                message: msg.message,
                                timestamp: typeof msg.createdAt === 'string' ? new Date(msg.createdAt) : msg.createdAt,
                                userId: msg.userId, // Incluir userId para comparação
                                status
                            } as ChatMessage & { userId?: string };
                        });
                        // Ordenar mensagens por timestamp antes de definir
                        const sortedMessages = formattedMessages.sort((a, b) => {
                            const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp.getTime();
                            const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp.getTime();
                            return timeA - timeB;
                        });
                        setMessages(sortedMessages);
                    } else {
                        // Chat doesn't exist yet or has no messages, use socket messages
                        const sortedSocketMessages = receivedMessages.map(msg => ({
                            ...msg,
                            timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
                        })).sort((a, b) => {
                            const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp.getTime();
                            const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp.getTime();
                            return timeA - timeB;
                        });
                        setMessages(sortedSocketMessages);
                    }
                } catch (error) {
                    console.error("Error fetching messages from backend:", error);
                    // Fallback to socket messages
                    const sortedSocketMessages = receivedMessages.map(msg => ({
                        ...msg,
                        timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
                    })).sort((a, b) => {
                        const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp.getTime();
                        const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp.getTime();
                        return timeA - timeB;
                    });
                    setMessages(sortedSocketMessages);
                }
            } else {
                // Fallback to socket messages
                const sortedSocketMessages = receivedMessages.map(msg => ({
                    ...msg,
                    timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
                })).sort((a, b) => {
                    const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp.getTime();
                    const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp.getTime();
                    return timeA - timeB;
                });
                setMessages(sortedSocketMessages);
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

                    // 3. Mensagem não é duplicada (é do lojista ou não é duplicata)
                    // Antes de adicionar, verificar novamente se não há duplicata por ID
                    // (pode ter sido adicionada entre a verificação e agora)
                    const finalCheck = prev.some(msg => msg.id === message.id);
                    if (finalCheck) {
                        console.log("[CLIENTE] Duplicate detected in final check, skipping");
                        return prev;
                    }

                    console.log("[CLIENTE] Adding message to state (not duplicate)");
                    // Adicionar mensagem e deduplicar o array final (por segurança)
                    const newMessages = [...prev, {
                        ...message,
                        timestamp: typeof message.timestamp === 'string' ? new Date(message.timestamp) : message.timestamp,
                        status: (message.status || "delivered") as MessageStatus
                    }];

                    // Deduplicar por ID (manter apenas a primeira ocorrência de cada ID)
                    const deduplicated = newMessages.reduce((acc, msg) => {
                        if (!acc.find(m => m.id === msg.id)) {
                            acc.push(msg);
                        }
                        return acc;
                    }, [] as (ChatMessage & { userId?: string })[]);

                    // Ordenar por timestamp após adicionar (garantir ordem correta)
                    return deduplicated.sort((a, b) => {
                        const timeA = typeof a.timestamp === 'string'
                            ? new Date(a.timestamp).getTime()
                            : a.timestamp.getTime();
                        const timeB = typeof b.timestamp === 'string'
                            ? new Date(b.timestamp).getTime()
                            : b.timestamp.getTime();
                        return timeA - timeB;
                    });
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

        // Mensagens marcadas como lidas (notificação do lojista)
        newSocket.on("chat:messages-read", (data: { chatId: string; readBy: string; readAt: Date }) => {
            const currentChatId = chatIdRef.current;
            const currentBackendUserId = backendUserIdRef.current;

            // Verificar se é do chat atual
            const expectedChatId = currentBackendUserId && currentChatId
                ? `${currentBackendUserId}-${currentChatId}`
                : currentRoomIdRef.current;

            if (expectedChatId && data.chatId === expectedChatId) {
                console.log("[CLIENTE] Mensagens marcadas como lidas pelo lojista");
                
                // Atualizar status de todas as mensagens próprias (do cliente) para "read"
                setMessages(prev => prev.map(msg => {
                    const msgUserId = (msg as ChatMessage & { userId?: string }).userId;
                    // Se é mensagem do próprio cliente, atualizar status para "read"
                    if (msgUserId === currentBackendUserId && msg.status && msg.status !== "read") {
                        return {
                            ...msg,
                            status: "read" as MessageStatus
                        };
                    }
                    return msg;
                }));
            }
        });

        // Receber notificação quando lojista está digitando
        newSocket.on("chat:typing", (data: { chatId: string; username: string; isTyping: boolean }) => {
            const currentChatId = chatIdRef.current;
            const currentBackendUserId = backendUserIdRef.current;

            // Verificar se é do chat atual
            const expectedChatId = currentBackendUserId && currentChatId
                ? `${currentBackendUserId}-${currentChatId}`
                : currentRoomIdRef.current;

            if (expectedChatId && data.chatId === expectedChatId) {
                console.log("[CLIENTE] Lojista está digitando:", data);
                setIsTyping(data.isTyping);
            }
        });

        // Receber notificação quando lojista marca mensagens como lidas
        // (o cliente marca quando visualiza, então receber essa notificação confirma)
        // Este evento também é usado quando o lojista marca mensagens do cliente como lidas

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
            // Parar de digitar ao desmontar
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
            if (isTypingRef.current && newSocket.connected) {
                newSocket.emit("chat:typing-stop");
            }
            
            if (newSocket) {
                newSocket.emit("chat:leave");
                newSocket.disconnect();
            }
        };
        // backendUserId é usado via ref (backendUserIdRef) nos listeners para evitar problemas de closure
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Buscar nome do mercado quando chatId mudar
    useEffect(() => {
        if (!chatId || chatId === "inbox") {
            setMarketName(null);
            return;
        }

        const fetchMarketName = async () => {
            try {
                const market = await getMarketById(chatId);
                setMarketName(market.name);
            } catch (error) {
                console.error("Erro ao buscar nome do mercado:", error);
                setMarketName(null);
            }
        };

        fetchMarketName();
    }, [chatId]);

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
                    // Mensagens do backend têm status baseado no readAt
                    const formattedMessages: ChatMessage[] = chatWithMessages.messages.map(msg => {
                        const isOwnMessage = msg.userId === backendUserId;
                        let status: MessageStatus | undefined = undefined;
                        
                        if (isOwnMessage) {
                            // Se é mensagem do próprio cliente, verificar se foi lida
                            status = msg.readAt ? "read" as MessageStatus : "delivered" as MessageStatus;
                        }
                        
                        return {
                            id: msg.id,
                            chat: msg.chatId,
                            username: msg.username,
                            message: msg.message,
                            timestamp: typeof msg.createdAt === 'string' ? new Date(msg.createdAt) : msg.createdAt,
                            userId: msg.userId, // Incluir userId para comparação
                            status
                        } as ChatMessage & { userId?: string };
                    });
                    // Ordenar mensagens por timestamp antes de definir
                    const sortedMessages = formattedMessages.sort((a, b) => {
                        const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp.getTime();
                        const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp.getTime();
                        return timeA - timeB;
                    });
                    setMessages(sortedMessages);
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

            // Marcar mensagens como lidas quando o cliente entra no chat (chamada inicial)
            // As interações subsequentes serão detectadas automaticamente
            markMessagesAsReadDebounced();
        };

        enterChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId, isConnected, backendUserId]);

    // Detectar interações do usuário para marcar mensagens como lidas
    useEffect(() => {
        if (!chatId || !backendUserId) return;

        // Detectar foco da janela
        const handleFocus = () => {
            isWindowFocusedRef.current = true;
            markMessagesAsReadDebounced();
        };

        const handleBlur = () => {
            isWindowFocusedRef.current = false;
        };

        // Detectar scroll na área de mensagens
        const handleScroll = () => {
            if (isWindowFocusedRef.current) {
                markMessagesAsReadDebounced();
            }
        };

        // Detectar interações (clique, digitação, etc.)
        const handleInteraction = () => {
            if (isWindowFocusedRef.current) {
                markMessagesAsReadDebounced();
            }
        };

        // Adicionar listeners
        window.addEventListener("focus", handleFocus);
        window.addEventListener("blur", handleBlur);
        window.addEventListener("click", handleInteraction);
        window.addEventListener("keydown", handleInteraction);

        // Adicionar listener de scroll no ScrollArea
        const scrollArea = document.querySelector('[data-slot="scroll-area-viewport"]');
        if (scrollArea) {
            scrollArea.addEventListener("scroll", handleScroll);
        }

        return () => {
            window.removeEventListener("focus", handleFocus);
            window.removeEventListener("blur", handleBlur);
            window.removeEventListener("click", handleInteraction);
            window.removeEventListener("keydown", handleInteraction);
            if (scrollArea) {
                scrollArea.removeEventListener("scroll", handleScroll);
            }
            if (markReadTimeoutRef.current) {
                clearTimeout(markReadTimeoutRef.current);
            }
        };
    }, [chatId, backendUserId, markMessagesAsReadDebounced]);

    // Marcar como lido quando novas mensagens chegam e o usuário está visualizando
    useEffect(() => {
        if (messages.length > 0 && isWindowFocusedRef.current) {
            markMessagesAsReadDebounced();
        }
    }, [messages.length, markMessagesAsReadDebounced]);

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


    // Função para gerenciar o indicador de digitação
    const handleTyping = () => {
        if (!socketRef.current?.connected || !currentRoomIdRef.current) return;

        // Se não estava digitando, enviar evento de início
        if (!isTypingRef.current) {
            isTypingRef.current = true;
            socketRef.current.emit("chat:typing-start");
        }

        // Limpar timeout anterior
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Definir timeout para parar de digitar após 3 segundos de inatividade
        typingTimeoutRef.current = setTimeout(() => {
            if (isTypingRef.current && socketRef.current?.connected) {
                isTypingRef.current = false;
                socketRef.current.emit("chat:typing-stop");
            }
        }, 3000);
    };

    // Parar de digitar quando enviar mensagem
    const stopTyping = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        if (isTypingRef.current && socketRef.current?.connected) {
            isTypingRef.current = false;
            socketRef.current.emit("chat:typing-stop");
        }
    };

    // Send message
    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!socketRef.current || !messageInput.trim() || isSending || !chatId || !backendUserId) return;

        // Parar de digitar ao enviar mensagem
        stopTyping();

        const messageText = messageInput.trim();
        setMessageInput("");
        setIsSending(true);

        // Calculate chatId correctly: {userId}-{marketId}
        const calculatedChatId = `${backendUserId}-${chatId}`;

        // Update currentRoomIdRef if necessary
        if (currentRoomIdRef.current !== calculatedChatId) {
            currentRoomIdRef.current = calculatedChatId;
        }

        // Criar ID temporário para a mensagem
        const tempId = `temp-${Date.now()}-${Math.random()}`;

        // Adicionar mensagem ao estado IMEDIATAMENTE com status "not_sent"
        const newMessage: ChatMessage & { userId?: string } = {
            id: tempId,
            chat: calculatedChatId,
            username: user?.name || "User",
            message: messageText,
            timestamp: new Date(),
            status: "not_sent",
            userId: backendUserId
        };

        setMessages(prev => [...prev, newMessage]);

        // Enviar via Socket.IO PRIMEIRO (garantir que sempre envia)
        socketRef.current.emit("chat:send-message", {
            message: messageText,
        });

        // Atualizar status para "sent" após enviar
        // Ordenar por timestamp para garantir ordem correta
        setMessages(prev => {
            const updated = prev.map(msg =>
                msg.id === tempId ? { ...msg, status: "sent" as MessageStatus } : msg
            );
            
            // Ordenar por timestamp após atualizar
            return updated.sort((a, b) => {
                const timeA = typeof a.timestamp === 'string'
                    ? new Date(a.timestamp).getTime()
                    : a.timestamp.getTime();
                const timeB = typeof b.timestamp === 'string'
                    ? new Date(b.timestamp).getTime()
                    : b.timestamp.getTime();
                return timeA - timeB;
            });
        });

        // Tentar persistir no backend DEPOIS de enviar via socket
        try {
            const persistedMessage = await createMessage(calculatedChatId, messageText);
            console.log("[CLIENTE] Mensagem persistida:", persistedMessage.id);

            // Atualizar mensagem temporária com dados persistidos e status "delivered"
            // Manter o timestamp original da mensagem para preservar a ordem
            setMessages(prev => {
                const updated = prev.map(msg => {
                    if (msg.id === tempId || 
                        ((msg as ChatMessage & { userId?: string }).userId === backendUserId &&
                         msg.message === messageText &&
                         msg.status === "sent")) {
                        // Manter o timestamp original da mensagem para preservar a ordem
                        const originalTimestamp = msg.timestamp;
                        return {
                            ...msg,
                            id: persistedMessage.id,
                            chat: persistedMessage.chatId,
                            username: persistedMessage.username,
                            timestamp: originalTimestamp, // Manter timestamp original
                            userId: persistedMessage.userId,
                            status: "delivered" as MessageStatus
                        } as ChatMessage & { userId?: string };
                    }
                    return msg;
                });
                
                // Ordenar por timestamp após atualizar (garantir ordem correta)
                return updated.sort((a, b) => {
                    const timeA = typeof a.timestamp === 'string'
                        ? new Date(a.timestamp).getTime()
                        : a.timestamp.getTime();
                    const timeB = typeof b.timestamp === 'string'
                        ? new Date(b.timestamp).getTime()
                        : b.timestamp.getTime();
                    return timeA - timeB;
                });
            });
        } catch (error) {
            console.error("Error persisting message in backend:", error);
            // Se falhar a persistência, manter status "sent" (mensagem enviada mas não persistida)
            // A mensagem pode ser atualizada quando chegar via socket com dados do servidor
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

    if (userLoading) {
        return (
            <Card className="flex flex-col h-full">
                <CardContent className="flex items-center justify-center flex-1">
                    <Loader className="h-6 w-6 animate-spin" />
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

    // Componente para exibir ícone de status da mensagem
    const MessageStatusIcon = ({ status }: { status: MessageStatus }) => {
        const getStatusConfig = () => {
            switch (status) {
                case "not_sent":
                    return {
                        icon: AlertCircle,
                        label: "Não enviado",
                        className: "text-red-400"
                    };
                case "sent":
                    return {
                        icon: Check,
                        label: "Enviado",
                        className: "text-muted-foreground"
                    };
                case "delivered":
                    return {
                        icon: CheckCheck,
                        label: "Enviado/Recebido",
                        className: "text-muted-foreground"
                    };
                case "read":
                    return {
                        icon: CheckCheck,
                        label: "Lido",
                        className: "text-blue-400"
                    };
                default:
                    return {
                        icon: Check,
                        label: "Enviado",
                        className: "text-muted-foreground"
                    };
            }
        };

        const config = getStatusConfig();
        const Icon = config.icon;

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="inline-flex items-center">
                            <Icon className={cn("h-3 w-3", config.className)} />
                        </span>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{config.label}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    };

    return (
        <Card className="flex flex-col flex-1">
            <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">
                            {marketName ? marketName : `Chat - ${chatId}`}
                        </h2>
                        {storeOwnerUsername && (
                            <p className="text-sm text-muted-foreground">
                                Conversando com {storeOwnerUsername}
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
            <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex flex-col flex-grow h-0 overflow-y-auto p-4">
                    <div className="flex flex-col flex-1 gap-4">
                        {messages.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                <p>No messages yet.</p>
                                <p className="text-sm mt-2">Be the first to send a message!</p>
                            </div>
                        ) : (
                            // Remover duplicatas antes de renderizar usando useMemo equivalente inline
                            (() => {
                                // Criar um Map para deduplicar mensagens por ID
                                const uniqueMessagesMap = new Map<string, ChatMessage & { userId?: string }>();

                                // Primeira passada: adicionar todas as mensagens únicas
                                messages.forEach((message) => {
                                    const msg = message as ChatMessage & { userId?: string };

                                    if (!uniqueMessagesMap.has(msg.id)) {
                                        // Não existe, adicionar
                                        uniqueMessagesMap.set(msg.id, msg);
                                    } else {
                                        // Já existe, verificar qual é melhor (preferir mensagem persistida com userId)
                                        const existing = uniqueMessagesMap.get(msg.id)!;

                                        // Preferir mensagem com userId (persistida)
                                        if (msg.userId && !existing.userId) {
                                            uniqueMessagesMap.set(msg.id, msg);
                                        } else if (msg.userId && existing.userId) {
                                            // Ambas têm userId, usar a mais recente
                                            const existingTime = typeof existing.timestamp === 'string'
                                                ? new Date(existing.timestamp).getTime()
                                                : existing.timestamp.getTime();
                                            const newTime = typeof msg.timestamp === 'string'
                                                ? new Date(msg.timestamp).getTime()
                                                : msg.timestamp.getTime();

                                            if (newTime > existingTime) {
                                                uniqueMessagesMap.set(msg.id, msg);
                                            }
                                        }
                                    }
                                });

                                // Converter para array, ordenar por timestamp e renderizar
                                const uniqueMessages = Array.from(uniqueMessagesMap.values())
                                    .sort((a, b) => {
                                        const timeA = typeof a.timestamp === 'string'
                                            ? new Date(a.timestamp).getTime()
                                            : a.timestamp.getTime();
                                        const timeB = typeof b.timestamp === 'string'
                                            ? new Date(b.timestamp).getTime()
                                            : b.timestamp.getTime();
                                        return timeA - timeB;
                                    });

                                return uniqueMessages.map((message) => {
                                    // Comparar por userId se disponível, caso contrário usar username
                                    const messageUserId = message.userId;
                                    const isOwnMessage = messageUserId
                                        ? messageUserId === backendUserId
                                        : message.username === currentUsername;

                                    // Usar ID como key (já garantimos que são únicos)
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
                                                        ? "bg-lime-200 text-gray-700"
                                                        : "bg-muted"
                                                )}
                                            >
                                                {!isOwnMessage && (
                                                    <p className="text-xs font-semibold mb-1 opacity-80">
                                                        {message.username}
                                                    </p>
                                                )}
                                                <p className="text-sm">{message.message}</p>
                                                <div className="flex items-center justify-between gap-2 mt-1">
                                                    <p
                                                        className={cn(
                                                            "text-xs",
                                                            isOwnMessage ? "opacity-70" : "opacity-60"
                                                        )}
                                                    >
                                                        {formatTimestamp(message.timestamp)}
                                                    </p>
                                                    {isOwnMessage && message.status && (
                                                        <MessageStatusIcon status={message.status} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                });
                            })()
                        )}
                        {isTyping && storeOwnerUsername ? (
                            <div className="flex justify-start">
                                <div className="max-w-[70%] rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        {storeOwnerUsername} está digitando
                                        <span className="flex gap-1">
                                            <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground" />
                                            <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground delay-150" />
                                            <span className="h-1 w-1 animate-pulse rounded-full bg-muted-foreground delay-300" />
                                        </span>
                                    </span>
                                </div>
                            </div>
                        ) : null}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>
                <form
                    onSubmit={handleSendMessage}
                    className="border-t p-4 flex gap-2"
                >
                    <Input
                        value={messageInput}
                        onChange={(e) => {
                            setMessageInput(e.target.value);
                            handleTyping();
                        }}
                        placeholder="Type your message..."
                        disabled={!isConnected || isSending}
                        className="flex-1"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            } else {
                                handleTyping();
                            }
                        }}
                    />
                    <Button
                        type="submit"
                        disabled={!isConnected || !messageInput.trim() || isSending}
                        size="icon"
                    >
                        {isSending ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
