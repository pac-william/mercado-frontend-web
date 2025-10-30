"use client"

import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
    success?: string;
    error?: string;
}

export default function ToastOnMount({ success, error }: Props) {
    useEffect(() => {
        if (success) toast.success(success);
        if (error) toast.error(error);
    }, [success, error]);

    return null;
}


