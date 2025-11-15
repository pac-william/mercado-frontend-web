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
import { Bell, Check, Copy, Heart, MapPin, MoreVertical, Share2, Star } from "lucide-react";
import GoogleMaps from "@/app/components/GoogleMaps";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MarketActionsProps {
    marketName: string;
    marketId: string;
    marketAddress: string;
    marketLatitude?: number | null;
    marketLongitude?: number | null;
}

export function MarketActions({ marketName, marketId, marketAddress, marketLatitude, marketLongitude }: MarketActionsProps) {
    const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
    const [addressMapDialogOpen, setAddressMapDialogOpen] = useState(false);
    const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);

    return (
        <>
            <FavoriteButton marketId={marketId} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                        <MoreVertical className="size-4" />
                        <span className="sr-only">Mais ações</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => setRatingDialogOpen(true)}>
                        <Star className="mr-2 size-4" />
                        <span>Avaliar mercado</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setAddressMapDialogOpen(true)}>
                        <MapPin className="mr-2 size-4" />
                        <span>Ver endereço e mapa</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setNotificationDialogOpen(true)}>
                        <Bell className="mr-2 size-4" />
                        <span>Notificações</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShareDialogOpen(true)}>
                        <Share2 className="mr-2 size-4" />
                        <span>Compartilhar</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <RatingDialog 
                marketName={marketName} 
                marketId={marketId}
                open={ratingDialogOpen}
                onOpenChange={setRatingDialogOpen}
            />
            <AddressMapDialog 
                marketName={marketName}
                marketAddress={marketAddress}
                marketLatitude={marketLatitude}
                marketLongitude={marketLongitude}
                open={addressMapDialogOpen}
                onOpenChange={setAddressMapDialogOpen}
            />
            <NotificationDialog 
                marketName={marketName}
                open={notificationDialogOpen}
                onOpenChange={setNotificationDialogOpen}
            />
            <ShareDialog 
                marketName={marketName}
                open={shareDialogOpen}
                onOpenChange={setShareDialogOpen}
            />
        </>
    );
}

interface NotificationDialogProps {
    marketName: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function NotificationDialog({ marketName, open, onOpenChange }: NotificationDialogProps) {
    const [notifyWhenOpen, setNotifyWhenOpen] = useState(true);
    const [notifyOrders, setNotifyOrders] = useState(false);
    const [notifyPromos, setNotifyPromos] = useState(true);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
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

interface ShareDialogProps {
    marketName: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function ShareDialog({ marketName, open, onOpenChange }: ShareDialogProps) {
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
        <Dialog open={open} onOpenChange={onOpenChange}>
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

interface RatingDialogProps {
    marketName: string;
    marketId: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function RatingDialog({ marketName, marketId, open, onOpenChange }: RatingDialogProps) {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleRatingClick = (value: number) => {
        setRating(value);
    };

    const handleSubmitRating = () => {
        if (rating > 0) {
            // Aqui você pode adicionar a lógica para salvar a avaliação
            toast.success(`Você avaliou ${marketName} com ${rating} estrela${rating !== 1 ? 's' : ''}`);
            onOpenChange?.(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Avaliar mercado</DialogTitle>
                    <DialogDescription>
                        Avalie {marketName} de 1 a 5 estrelas.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((value) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => handleRatingClick(value)}
                                onMouseEnter={() => setHoveredRating(value)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className={cn(
                                    "transition-colors p-2 rounded-full",
                                    (hoveredRating >= value || (hoveredRating === 0 && rating >= value))
                                        ? "text-amber-400"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Star
                                    className={cn(
                                        "size-8",
                                        (hoveredRating >= value || (hoveredRating === 0 && rating >= value))
                                            ? "fill-current"
                                            : "fill-none"
                                    )}
                                />
                            </button>
                        ))}
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            {rating === 0 ? "Selecione uma avaliação" : `${rating} de 5 estrelas`}
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Fechar
                        </Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button 
                            type="button" 
                            variant="default"
                            disabled={rating === 0}
                            onClick={handleSubmitRating}
                        >
                            Enviar avaliação
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function FavoriteButton({ marketId }: { marketId: string }) {
    const [isFavorite, setIsFavorite] = useState(false);

    const handleToggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Aqui você pode adicionar a lógica para favoritar/desfavoritar
        toast.success(isFavorite ? "Mercado removido dos favoritos" : "Mercado adicionado aos favoritos");
    };

    return (
        <Button
            variant="outline"
            size="icon"
            className={cn(
                "rounded-full",
                isFavorite && "text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
            )}
            onClick={handleToggleFavorite}
            aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
            <Heart className={cn("size-4", isFavorite && "fill-current")} />
            <span className="sr-only">{isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}</span>
        </Button>
    );
}

interface AddressMapDialogProps {
    marketName: string;
    marketAddress: string;
    marketLatitude?: number | null;
    marketLongitude?: number | null;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function AddressMapDialog({ marketName, marketAddress, marketLatitude, marketLongitude, open, onOpenChange }: AddressMapDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Endereço e Localização</DialogTitle>
                    <DialogDescription>
                        Localização completa de {marketName}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/50">
                        <MapPin className="size-5 text-primary mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-foreground mb-1">Endereço</p>
                            <p className="text-sm text-muted-foreground">{marketAddress}</p>
                        </div>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-border">
                        <GoogleMaps
                            latitude={marketLatitude ?? undefined}
                            longitude={marketLongitude ?? undefined}
                            zoom={15}
                            height="400px"
                            interactive={true}
                        />
                    </div>

                    {(!marketLatitude || !marketLongitude) && (
                        <p className="text-xs text-muted-foreground text-center">
                            Coordenadas não disponíveis. O mapa mostra uma localização aproximada.
                        </p>
                    )}
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


