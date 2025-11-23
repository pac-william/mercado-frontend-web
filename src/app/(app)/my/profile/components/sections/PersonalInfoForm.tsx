"use client"

import { updateUserProfile } from "@/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface PersonalInfoFormProps {
    name: string;
    email: string;
}

export function PersonalInfoForm({ name, email }: PersonalInfoFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            try {
                const result = await updateUserProfile(formData);
                if (result.success) {
                    toast.success("Perfil atualizado com sucesso");
                    router.refresh();
                } else {
                    toast.error(result.message || "Erro ao atualizar perfil");
                }
            } catch (error) {
                const message = error instanceof Error ? error.message : "Erro ao atualizar perfil";
                toast.error(message);
            }
        });
    }

    return (
        <form action={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-card-foreground">Nome completo</label>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Digite seu nome completo"
                        defaultValue={name}
                        className="bg-background border-border text-foreground"
                        required
                        disabled={isPending}
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
                        required
                        disabled={isPending}
                    />
                </div>
                <div className="md:col-span-2 flex justify-end">
                    <Button 
                        type="submit" 
                        disabled={isPending} 
                        className="bg-[#2E7D32] hover:bg-[#27672A] text-white"
                    >
                        {isPending ? "Salvando..." : "Salvar alterações"}
                    </Button>
                </div>
            </div>
        </form>
    );
}

