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
        <Card className="flex flex-col p-4 gap-2">
            <div
                className={`flex flex-1 flex-row px-4 py-3 cursor-pointer transition-all duration-200 items-center rounded-lg border ${method === "pickup"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                onClick={() => handleSelectMethod("pickup")}
            >
                <Pin size={16} />
                <span className="ml-3 font-medium">Retirada no estabelecimento</span>
                {method === "pickup" && <Check size={16} className="ml-auto" />}
            </div>

            <div
                className={`flex flex-1 flex-row px-4 py-3 cursor-pointer transition-all duration-200 items-center rounded-lg border ${method === "delivery"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                    }`}
                onClick={() => handleSelectMethod("delivery")}
            >

                <Truck size={16} />
                <span className="ml-3 font-medium">Entrega a domicílio</span>
                {method === "delivery" && <Check size={16} className="ml-auto" />}
            </div>
        </Card>
    )
}