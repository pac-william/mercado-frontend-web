"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Bell, Check, Copy, Share2 } from "lucide-react";

interface MarketActionsProps {
    marketName: string;
}

export function MarketActions({ marketName }: MarketActionsProps) {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <NotificationDialog marketName={marketName} />
            <ShareDialog marketName={marketName} />
        </div>
    );
}

function NotificationDialog({ marketName }: MarketActionsProps) {
    const [notifyWhenOpen, setNotifyWhenOpen] = useState(true);
    const [notifyOrders, setNotifyOrders] = useState(false);
    const [notifyPromos, setNotifyPromos] = useState(true);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Bell className="size-4" />
                    <span className="sr-only">Configurações de notificações</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Notificações</DialogTitle>
                    <DialogDescription>
                        Escolha os alertas que deseja receber sobre o mercado {marketName}.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <NotificationToggle
                        id="notify-market-open"
                        label="Quando este mercado abrir"
                        description="Receba um aviso assim que o mercado estiver disponível."
                        checked={notifyWhenOpen}
                        onCheckedChange={setNotifyWhenOpen}
                    />
                    <NotificationToggle
                        id="notify-orders"
                        label="Sobre meu pedido"
                        description="Fique por dentro do andamento e atualizações do seu pedido."
                        checked={notifyOrders}
                        onCheckedChange={setNotifyOrders}
                    />
                    <NotificationToggle
                        id="notify-promos"
                        label="Quando tiver promoções"
                        description="Receba novidades sobre ofertas e descontos exclusivos."
                        checked={notifyPromos}
                        onCheckedChange={setNotifyPromos}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Salvar preferências
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface NotificationToggleProps {
    id: string;
    label: string;
    description: string;
    checked: boolean;
    onCheckedChange: (value: boolean) => void;
}

function NotificationToggle({ id, label, description, checked, onCheckedChange }: NotificationToggleProps) {
    return (
        <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
            <div className="flex-1 space-y-1.5">
                <Label htmlFor={id} className="text-base">
                    {label}
                </Label>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
        </div>
    );
}

function ShareDialog({ marketName }: MarketActionsProps) {
    const [shareUrl, setShareUrl] = useState("");
    const [isCopied, setIsCopied] = useState(false);

    const message = useMemo(() => `Confira ${marketName} no Smart Market: `, [marketName]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            setShareUrl(window.location.href);
        }
    }, []);

    useEffect(() => {
        if (!isCopied) return;

        const timeout = window.setTimeout(() => {
            setIsCopied(false);
        }, 2000);

        return () => window.clearTimeout(timeout);
    }, [isCopied]);

    const handleShare = useCallback(
        (urlBuilder: (url: string, text: string) => string) => {
            if (!shareUrl) return;

            const target = urlBuilder(shareUrl, message);
            window.open(target, "_blank", "noopener,noreferrer");
        },
        [shareUrl, message],
    );

    const handleCopyLink = useCallback(async () => {
        if (!shareUrl) return;

        try {
            await navigator.clipboard.writeText(`${message}${shareUrl}`);
            setIsCopied(true);
        } catch (error) {
            console.error("Erro ao copiar link", error);
            setIsCopied(false);
        }
    }, [shareUrl, message]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Share2 className="size-4" />
                    <span className="sr-only">Opções de compartilhamento</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Compartilhar mercado</DialogTitle>
                    <DialogDescription>
                        Mostre este mercado para seus amigos. Escolha uma das opções abaixo.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="justify-between"
                        onClick={handleCopyLink}
                        disabled={!shareUrl}
                    >
                        <span className="flex items-center gap-2">
                            <Copy className="size-4" />
                            Copiar link
                        </span>
                        {isCopied ? (
                            <Check className="size-4 text-emerald-500" aria-label="Link copiado" />
                        ) : null}
                    </Button>

                    <ShareButton
                        icon={<Share2 className="size-4" />}
                        label="Enviar por WhatsApp"
                        onClick={() =>
                            handleShare((url, text) => `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text}${url}`)}`)
                        }
                        disabled={!shareUrl}
                    />
                    <ShareButton
                        icon={<Share2 className="size-4" />}
                        label="Enviar por Instagram"
                        onClick={() =>
                            handleShare((url) => `https://www.instagram.com/?url=${encodeURIComponent(url)}`)
                        }
                        disabled={!shareUrl}
                    />
                    <ShareButton
                        icon={<Share2 className="size-4" />}
                        label="Enviar por Facebook"
                        onClick={() =>
                            handleShare((url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`)
                        }
                        disabled={!shareUrl}
                    />
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Fechar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ShareButtonProps {
    icon: ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
}

function ShareButton({ icon, label, onClick, disabled }: ShareButtonProps) {
    return (
        <Button
            type="button"
            variant="outline"
            className={cn("justify-start gap-3", disabled && "cursor-not-allowed")}
            onClick={onClick}
            disabled={disabled}
        >
            {icon}
            {label}
        </Button>
    );
}


