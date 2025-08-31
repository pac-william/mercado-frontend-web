"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Pin, Truck } from "lucide-react"
import { useState } from "react"

export default function SelectMethod() {
    const [method, setMethod] = useState<"pickup" | "delivery">("pickup")

    const handleSelectMethod = (method: "pickup" | "delivery") => {
        setMethod(method)
    }

    return (
        <div className="flex flex-row gap-4">
            <Card 
                className={`flex flex-1 flex-row p-4 cursor-pointer transition-all duration-200 ${
                    method === "pickup" 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`} 
                onClick={() => handleSelectMethod("pickup")}
            >
                <Button 
                    variant={method === "pickup" ? "default" : "outline"} 
                    size="icon" 
                    className="flex flex-row gap-2 rounded-full"
                >
                    <Pin size={16} />
                </Button>
                <span className="ml-3 font-medium">Retirada no estabelecimento</span>
            </Card>
            
            <Card 
                className={`flex flex-1 flex-row p-4 cursor-pointer transition-all duration-200 ${
                    method === "delivery" 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`} 
                onClick={() => handleSelectMethod("delivery")}
            >
                <Button 
                    variant={method === "delivery" ? "default" : "outline"} 
                    size="icon" 
                    className="flex flex-row gap-2 rounded-full"
                >
                    <Truck size={16} />
                </Button>
                <span className="ml-3 font-medium">Entrega a domicílio</span>
            </Card>
        </div>
    )
}