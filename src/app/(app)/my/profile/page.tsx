import { getUserByAuth0Id, updateUser } from "@/actions/user.actions";
import RouterBack from "@/components/RouterBack";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { auth0 } from "@/lib/auth0";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";
import AddressList from "./components/AddressList";
import SubmitButton from "./components/SubmitButton";
import ToastOnMount from "./components/ToastOnMount";

export default async function Profile({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const session = await auth0.getSession();

    const user = session?.user;
    let name = user?.name || 'Usuário';
    let email = user?.email || '';
    const picture = user?.picture || '';
    const auth0Id = user?.sub || '';
    const role = user?.role || 'Cliente';

    // Buscar usuário no backend para obter o id interno
    let internalUserId = '';
    try {
        if (auth0Id) {
            const backendUser = await getUserByAuth0Id(auth0Id);
            internalUserId = backendUser.id;
            // Preferir dados do backend para refletir alterações
            name = backendUser.name || name;
            email = backendUser.email || email;
        }
    } catch {
        internalUserId = '';
    }

    async function saveProfile(formData: FormData) {
        "use server";
        const id = String(formData.get("id"));
        const newName = String(formData.get("name") || "");
        const newEmail = String(formData.get("email") || "");

        try {
            await updateUser(id, { name: newName, email: newEmail });
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Erro ao atualizar perfil";
            return redirect(`/my/profile?error=${encodeURIComponent(message)}`);
        }
        return redirect("/my/profile?success=Perfil atualizado com sucesso");
    }

    // Obter iniciais do nome para o avatar
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const params = await searchParams;
    const successMsg = typeof params?.success === 'string' ? params.success : undefined;
    const errorMsg = typeof params?.error === 'string' ? params.error : undefined;

    return (
        <ScrollArea className="flex flex-col flex-grow h-0">
            <div className="flex flex-col gap-4 container mx-auto my-4">
                <ToastOnMount success={successMsg} error={errorMsg} />
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
                                <AvatarImage src={picture} alt="Foto de perfil" />
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

                        <form action={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="hidden" name="id" value={internalUserId} />
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-card-foreground">Nome completo</label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Digite seu nome completo"
                                    defaultValue={name}
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-card-foreground">E-mail</label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    defaultValue={email}
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="role" className="text-sm font-medium text-card-foreground">Tipo de conta</label>
                                <Input
                                    id="role"
                                    value={role}
                                    readOnly
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="id" className="text-sm font-medium text-card-foreground">ID interno do usuário</label>
                                <Input
                                    id="id"
                                value={internalUserId || '—'}
                                    readOnly
                                    className="bg-background border-border text-foreground font-mono text-xs"
                                />
                            </div>
                            <div className="md:col-span-2 flex justify-end">
                                <SubmitButton />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Endereços */}
                <Card className="bg-card border-border">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Endereços</CardTitle>
                        <CardDescription className="text-muted-foreground">Gerencie seus endereços de entrega</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <AddressList />
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
                            <Button disabled className="bg-[#2E7D32] text-white">Alterar senha em breve</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Sair da conta */}
                <Card className="bg-card border border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-card-foreground">Sair da conta</CardTitle>
                        <CardDescription className="text-muted-foreground">Encerre sua sessão atual</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action="/api/auth/logout" method="post">
                            <Button
                                type="submit"
                                variant="destructive"
                                className="w-full"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sair da conta
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ScrollArea>
    )
}   