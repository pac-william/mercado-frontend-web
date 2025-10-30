"use client"

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="bg-[#2E7D32] hover:bg-[#27672A] text-white">
            {pending ? "Salvando..." : "Salvar alterações"}
        </Button>
    );
}


