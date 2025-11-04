"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import AuthChoiceModal from "./AuthChoiceModal";

export default function AuthButtons() {
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setLoginModalOpen(true)}>
                Entrar
                <LogIn size={16} className="ml-2" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setRegisterModalOpen(true)}>
                Cadastrar
                <UserPlus size={16} className="ml-2" />
            </Button>
            
            <AuthChoiceModal
                open={loginModalOpen}
                onOpenChange={setLoginModalOpen}
                type="login"
            />
            <AuthChoiceModal
                open={registerModalOpen}
                onOpenChange={setRegisterModalOpen}
                type="register"
            />
        </>
    );
}

