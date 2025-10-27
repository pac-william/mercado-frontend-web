import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Loader2, Package, Truck, XCircle } from "lucide-react";

type OrderStatus = 
    | "PENDING" 
    | "CONFIRMED" 
    | "PREPARING" 
    | "READY_FOR_DELIVERY" 
    | "OUT_FOR_DELIVERY" 
    | "DELIVERED" 
    | "CANCELLED";

interface StatusBadgeProps {
    status: string;
}

const statusConfig: Record<OrderStatus, {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
    icon: React.ElementType;
    className: string;
}> = {
    PENDING: {
        label: "Pendente",
        variant: "secondary",
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    },
    CONFIRMED: {
        label: "Confirmado",
        variant: "default",
        icon: CheckCircle2,
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    },
    PREPARING: {
        label: "Preparando",
        variant: "default",
        icon: Loader2,
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    },
    READY_FOR_DELIVERY: {
        label: "Pronto",
        variant: "default",
        icon: Package,
        className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
    },
    OUT_FOR_DELIVERY: {
        label: "Saiu para entrega",
        variant: "default",
        icon: Truck,
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
    },
    DELIVERED: {
        label: "Entregue",
        variant: "default",
        icon: CheckCircle2,
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    },
    CANCELLED: {
        label: "Cancelado",
        variant: "destructive",
        icon: XCircle,
        className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    }
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    const config = statusConfig[status as OrderStatus] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
        <Badge variant={config.variant} className={`${config.className} flex items-center gap-1 w-fit`}>
            <Icon className="w-3 h-3" />
            <span>{config.label}</span>
        </Badge>
    );
}

