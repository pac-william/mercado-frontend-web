"use client"

import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RouterBack() {
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    return (
        <Button
            variant="link"
            className="w-fit p-0!"
            onClick={handleGoBack}
        >
            <ChevronLeft size={24} />
            <span>Voltar</span>
        </Button>
    )
}