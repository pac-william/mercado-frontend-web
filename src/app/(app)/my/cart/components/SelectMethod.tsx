"use client"

import { Card } from "@/components/ui/card"
import { Check, Pin, Truck } from "lucide-react"
import { useState } from "react"

export default function SelectMethod() {
    const [method, setMethod] = useState<"pickup" | "delivery">("pickup")

    const handleSelectMethod = (method: "pickup" | "delivery") => {
        setMethod(method)
    }

    return (
        <Card className="flex flex-col p-4 gap-2 bg-card border-border">
            <div
                className={`flex flex-1 flex-row px-4 py-3 cursor-pointer transition-all duration-200 items-center rounded-lg border-2 ${
                    method === "pickup"
                        ? "border-primary bg-primary/10 dark:bg-primary/20 text-foreground"
                        : "border-border bg-background hover:border-primary/50 hover:bg-muted/50 text-foreground"
                }`}
                onClick={() => handleSelectMethod("pickup")}
            >
                <Pin size={16} className="text-foreground" />
                <span className="ml-3 font-medium text-foreground">Retirada no estabelecimento</span>
                {method === "pickup" && <Check size={16} className="ml-auto text-primary" />}
            </div>

            <div
                className={`flex flex-1 flex-row px-4 py-3 cursor-pointer transition-all duration-200 items-center rounded-lg border-2 ${
                    method === "delivery"
                        ? "border-primary bg-primary/10 dark:bg-primary/20 text-foreground"
                        : "border-border bg-background hover:border-primary/50 hover:bg-muted/50 text-foreground"
                }`}
                onClick={() => handleSelectMethod("delivery")}
            >
                <Truck size={16} className="text-foreground" />
                <span className="ml-3 font-medium text-foreground">Entrega a domicílio</span>
                {method === "delivery" && <Check size={16} className="ml-auto text-primary" />}
            </div>
        </Card>
    )
}