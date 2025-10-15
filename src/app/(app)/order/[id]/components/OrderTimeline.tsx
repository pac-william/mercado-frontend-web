import { CheckCircle2, Circle, Clock, Loader2, Package, Truck, XCircle } from "lucide-react";

type OrderStatus = 
    | "PENDING" 
    | "CONFIRMED" 
    | "PREPARING" 
    | "READY_FOR_DELIVERY" 
    | "OUT_FOR_DELIVERY" 
    | "DELIVERED" 
    | "CANCELLED";

interface OrderTimelineProps {
    currentStatus: string;
}

const statusSteps = [
    { key: "PENDING", label: "Pedido Recebido", icon: Clock },
    { key: "CONFIRMED", label: "Confirmado", icon: CheckCircle2 },
    { key: "PREPARING", label: "Em Preparação", icon: Loader2 },
    { key: "READY_FOR_DELIVERY", label: "Pronto para Entrega", icon: Package },
    { key: "OUT_FOR_DELIVERY", label: "Saiu para Entrega", icon: Truck },
    { key: "DELIVERED", label: "Entregue", icon: CheckCircle2 }
];

const cancelledStep = { key: "CANCELLED", label: "Cancelado", icon: XCircle };

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
    const isCancelled = currentStatus === "CANCELLED";
    
    const getStepStatus = (stepKey: string): "completed" | "current" | "pending" => {
        if (isCancelled) {
            if (stepKey === "CANCELLED") return "current";
            return "pending";
        }

        const currentIndex = statusSteps.findIndex(s => s.key === currentStatus);
        const stepIndex = statusSteps.findIndex(s => s.key === stepKey);

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "pending";
    };

    if (isCancelled) {
        const Icon = cancelledStep.icon;
        return (
            <div className="flex flex-col items-center gap-4 p-6 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                        <Icon className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-red-900 dark:text-red-100">
                            Pedido Cancelado
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                            Este pedido foi cancelado
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            {statusSteps.map((step, index) => {
                const Icon = step.icon;
                const status = getStepStatus(step.key);
                const isLast = index === statusSteps.length - 1;

                return (
                    <div key={step.key} className="relative pb-8">
                        <div className="flex items-center gap-4">
                            <div className="relative z-10">
                                <div className={`
                                    flex items-center justify-center w-10 h-10 rounded-full border-2
                                    ${status === "completed" 
                                        ? "bg-green-100 border-green-600 dark:bg-green-900 dark:border-green-400" 
                                        : status === "current"
                                        ? "bg-blue-100 border-blue-600 dark:bg-blue-900 dark:border-blue-400"
                                        : "bg-muted border-muted-foreground"
                                    }
                                `}>
                                    <Icon className={`
                                        w-5 h-5
                                        ${status === "completed"
                                            ? "text-green-600 dark:text-green-400"
                                            : status === "current"
                                            ? "text-blue-600 dark:text-blue-400"
                                            : "text-muted-foreground"
                                        }
                                        ${status === "current" && step.key === "PREPARING" ? "animate-spin" : ""}
                                    `} />
                                </div>
                            </div>

                            <div className="flex-1">
                                <p className={`
                                    font-medium
                                    ${status === "completed" || status === "current"
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                    }
                                `}>
                                    {step.label}
                                </p>
                                {status === "current" && (
                                    <p className="text-sm text-blue-600 dark:text-blue-400">
                                        Status atual
                                    </p>
                                )}
                            </div>
                        </div>

                        {!isLast && (
                            <div className={`
                                absolute left-5 top-10 w-0.5 h-8 -ml-px
                                ${status === "completed"
                                    ? "bg-green-600 dark:bg-green-400"
                                    : "bg-muted-foreground"
                                }
                            `} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}


