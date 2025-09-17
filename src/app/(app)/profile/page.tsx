import RouterBack from "@/components/RouterBack";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Smart Market - Perfil',
    description: 'Gerencie suas informações de perfil',
}

export default function Profile() {
    return (
        <ProtectedRoute>
            <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="flex flex-col gap-4 container mx-auto my-4">
                <RouterBack />
                <h1 className="text-2xl font-bold">Perfil</h1>

                {/* Informações Pessoais */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informações Pessoais</CardTitle>
                        <CardDescription>Gerencie suas informações básicas</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src="/placeholder-avatar.jpg" alt="Foto de perfil" />
                                <AvatarFallback>FP</AvatarFallback>
                            </Avatar>
                            <div className="space-y-2">
                                <Button variant="outline">Alterar foto</Button>
                                <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
                            </div>
                        </div>

                        <Separator />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">Nome completo</label>
                                <Input id="name" placeholder="Digite seu nome completo" defaultValue="João Silva" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">E-mail</label>
                                <Input id="email" type="email" placeholder="seu@email.com" defaultValue="joao.silva@email.com" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-medium">Telefone</label>
                                <Input id="phone" placeholder="(11) 99999-9999" defaultValue="(11) 99999-9999" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="cpf" className="text-sm font-medium">CPF</label>
                                <Input id="cpf" placeholder="000.000.000-00" defaultValue="123.456.789-00" />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button>Salvar alterações</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Endereços */}
                <Card>
                    <CardHeader>
                        <CardTitle>Endereços</CardTitle>
                        <CardDescription>Gerencie seus endereços de entrega</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Casa</p>
                                        <p className="text-sm text-muted-foreground">Rua das Flores, 123 - Apto 45</p>
                                        <p className="text-sm text-muted-foreground">Vila Madalena - São Paulo, SP</p>
                                        <p className="text-sm text-muted-foreground">CEP: 01234-567</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Editar</Button>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Excluir</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Trabalho</p>
                                        <p className="text-sm text-muted-foreground">Av. Paulista, 1000 - Sala 101</p>
                                        <p className="text-sm text-muted-foreground">Bela Vista - São Paulo, SP</p>
                                        <p className="text-sm text-muted-foreground">CEP: 01310-100</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm">Editar</Button>
                                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">Excluir</Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full">+ Adicionar novo endereço</Button>
                    </CardContent>
                </Card>

                {/* Preferências */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preferências</CardTitle>
                        <CardDescription>Configure suas preferências de compra</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="market" className="text-sm font-medium">Mercado preferido</label>
                                <Input id="market" placeholder="Digite o nome do mercado" defaultValue="Mercado Central" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="payment" className="text-sm font-medium">Forma de pagamento preferida</label>
                                <Input id="payment" placeholder="Ex: Cartão de crédito" defaultValue="Cartão de crédito" />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button>Salvar preferências</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Segurança */}
                <Card>
                    <CardHeader>
                        <CardTitle>Segurança</CardTitle>
                        <CardDescription>Gerencie sua senha e configurações de segurança</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="current-password" className="text-sm font-medium">Senha atual</label>
                                <Input id="current-password" type="password" placeholder="Digite sua senha atual" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="new-password" className="text-sm font-medium">Nova senha</label>
                                <Input id="new-password" type="password" placeholder="Digite a nova senha" />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button>Alterar senha</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
        </ProtectedRoute>
    )
}   