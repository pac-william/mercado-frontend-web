import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut } from "lucide-react";

export default function LogoutSection() {
    return (
        <Card className="border border-destructive/50 bg-destructive/5">
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
    );
}

