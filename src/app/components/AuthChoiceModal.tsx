"use client"

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Store, User } from "lucide-react";
import Link from "next/link";

interface AuthChoiceModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    type: "login" | "register";
}

export default function AuthChoiceModal({ open, onOpenChange, type }: AuthChoiceModalProps) {
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
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4 py-4">
                        <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 hover:bg-accent" asChild>
                            <Link href="/auth/login">
                                <User size={16} />
                                <span className="font-semibold">Cliente</span>
                                <span className="text-xs text-muted-foreground">
                                    {type === "login" ? "Entrar como cliente" : "Criar conta de cliente"}
                                </span>
                            </Link>
                        </Button>
                        <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 hover:bg-accent" asChild>
                            <Link href="https://manage.romulogdonadoni.com.br/auth/login">
                                <Store size={16} />
                                <span className="font-semibold">Mercado</span>
                                <span className="text-xs text-muted-foreground">
                                    {type === "login" ? "Entrar como mercado" : "Criar conta de mercado"}
                                </span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

