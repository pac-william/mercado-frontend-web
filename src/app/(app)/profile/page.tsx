'use client';

import LoadingSpinner from "@/components/LoadingSpinner";
import ProtectedRoute from "@/components/ProtectedRoute";
import RouterBack from "@/components/RouterBack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/providers/auth-provider";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Profile() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setLoggingOut(true);
            await logout();
            toast.success("Logout realizado com sucesso!");
            router.push("/login");
        } catch {
            toast.error("Erro ao fazer logout");
        } finally {
            setLoggingOut(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const initials = user.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U';

    return (
        <ProtectedRoute>
            <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="flex flex-col gap-4 container mx-auto my-4">
                <RouterBack />
                <h1 className="text-2xl font-bold text-foreground">Perfil</h1>

                {/* Informações Pessoais */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Informações Pessoais</CardTitle>
                        <CardDescription className="text-muted-foreground">Gerencie suas informações básicas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="Foto de perfil" />
                                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <Button variant="outline" disabled>Alterar foto</Button>
                                <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-card-foreground">Nome completo</label>
                                <Input 
                                    id="name" 
                                    placeholder="Digite seu nome completo" 
                                    value={user.name || ''} 
                                    readOnly
                                    className="bg-background border-border text-foreground" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-card-foreground">E-mail</label>
                                <Input 
                                    id="email" 
                                    type="email" 
                                    placeholder="seu@email.com" 
                                    value={user.email || ''} 
                                    readOnly
                                    className="bg-background border-border text-foreground" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium text-card-foreground">Tipo de conta</label>
                                <Input 
                                    id="role" 
                                    value={user.role === 'CUSTOMER' ? 'Cliente' : user.role === 'MARKET_ADMIN' ? 'Administrador' : user.role || ''} 
                                    readOnly
                                    className="bg-background border-border text-foreground" 
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="id" className="text-sm font-medium text-card-foreground">ID do usuário</label>
                                <Input 
                                    id="id" 
                                    value={user.id || ''} 
                                    readOnly
                                    className="bg-background border-border text-foreground font-mono text-xs" 
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button disabled>Edição em breve</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Endereços */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Endereços</CardTitle>
                        <CardDescription className="text-muted-foreground">Gerencie seus endereços de entrega</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="text-center py-8 text-muted-foreground">
                            <p>Funcionalidade em desenvolvimento</p>
                            <p className="text-sm mt-2">Em breve você poderá gerenciar seus endereços</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Segurança */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Segurança</CardTitle>
                        <CardDescription className="text-muted-foreground">Gerencie sua senha e configurações de segurança</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="current-password" className="text-sm font-medium text-card-foreground">Senha atual</label>
                                <Input id="current-password" type="password" placeholder="Digite sua senha atual" className="bg-background border-border text-foreground" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="new-password" className="text-sm font-medium text-card-foreground">Nova senha</label>
                                <Input id="new-password" type="password" placeholder="Digite a nova senha" className="bg-background border-border text-foreground" />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button disabled>Alterar senha em breve</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Sair da conta */}
                <Card className="bg-card border-border border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Sair da conta</CardTitle>
                        <CardDescription className="text-muted-foreground">Encerre sua sessão atual</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            variant="destructive" 
                            className="w-full"
                            onClick={handleLogout}
                            disabled={loggingOut}
                        >
                            <LogOut className="w-4 h-4 mr-2" />
                            {loggingOut ? "Saindo..." : "Sair da conta"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
        </ProtectedRoute>
    )
}   