import { getUserMe } from "@/actions/user.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { auth0 } from "@/lib/auth0";
import SubmitButton from "../SubmitButton";

export async function PersonalInfoSection() {
    const user = await getUserMe();
    const session = await auth0.getSession();
    
    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-card-foreground">Informações Pessoais</CardTitle>
                <CardDescription className="text-muted-foreground">Gerencie suas informações básicas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={user.profilePicture || session?.user?.picture || ''} alt="Foto de perfil" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                        <Button variant="outline" disabled>Alterar foto</Button>
                        <p className="text-sm text-muted-foreground">JPG, PNG ou GIF. Máximo 2MB.</p>
                    </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="hidden" name="id" value={user.id} />
                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-card-foreground">Nome completo</label>
                        <Input
                            id="name"
                            name="name"
                            placeholder="Digite seu nome completo"
                            defaultValue={user.name}
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
                            defaultValue={user.email}
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium text-card-foreground">Tipo de conta</label>
                        <Input
                            id="role"
                            value={user.role}
                            readOnly
                            className="bg-background border-border text-foreground"
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="id" className="text-sm font-medium text-card-foreground">ID interno do usuário</label>
                        <Input
                            id="id"
                            value={user.id || '—'}
                            readOnly
                            className="bg-background border-border text-foreground font-mono text-xs"
                        />
                    </div>
                    <div className="md:col-span-2 flex justify-end">
                        <SubmitButton />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

