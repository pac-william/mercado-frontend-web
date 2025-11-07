"use client"

import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useState } from "react";
import AuthChoiceModal from "./AuthChoiceModal";

export default function AuthButtons() {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <Button variant="outline" onClick={() => setOpenModal(true)}>
                Entrar
                <LogIn size={16} />
            </Button>

            <AuthChoiceModal
                open={openModal}
                onOpenChange={setOpenModal}
                type="login"
            />
        </>
    );
}

