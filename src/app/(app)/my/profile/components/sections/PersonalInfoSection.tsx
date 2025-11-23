import { getUserMe } from "@/actions/user.actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth0 } from "@/lib/auth0";
import { PersonalInfoForm } from "./PersonalInfoForm";

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

                <PersonalInfoForm name={user.name} email={user.email} />
            </CardContent>
        </Card>
    );
}

