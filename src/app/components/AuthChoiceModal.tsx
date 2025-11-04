"use client"

import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Store, User } from "lucide-react";

interface AuthChoiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: "login" | "register";
}

export default function AuthChoiceModal({ open, onOpenChange, type }: AuthChoiceModalProps) {
    const router = useRouter();

    const handleChoice = (isMarket: boolean) => {
        if (type === "login") {
            if (isMarket) {
                router.push("/auth/login?market=true");
            } else {
                router.push("/auth/login");
            }
        } else {
            if (isMarket) {
                router.push("/auth/register-market");
            } else {
                router.push("/auth/login");
            }
        }
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {type === "login" ? "Como deseja entrar?" : "Como deseja se cadastrar?"}
                    </DialogTitle>
                    <DialogDescription>
                        {type === "login" 
                            ? "Escolha se você é um cliente ou administrador de mercado"
                            : "Escolha se você deseja criar uma conta de cliente ou de mercado"}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 gap-2 hover:bg-accent"
                        onClick={() => handleChoice(false)}
                    >
                        <User className="h-8 w-8" />
                        <span className="font-semibold">Cliente</span>
                        <span className="text-xs text-muted-foreground">
                            {type === "login" ? "Entrar como cliente" : "Criar conta de cliente"}
                        </span>
                    </Button>
                    <Button
                        variant="outline"
                        className="flex flex-col items-center justify-center h-24 gap-2 hover:bg-accent"
                        onClick={() => handleChoice(true)}
                    >
                        <Store className="h-8 w-8" />
                        <span className="font-semibold">Mercado</span>
                        <span className="text-xs text-muted-foreground">
                            {type === "login" ? "Entrar como mercado" : "Criar conta de mercado"}
                        </span>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

