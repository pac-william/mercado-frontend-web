"use client";

import { useEffect, useMemo, useState } from "react";

import { deleteAddress, patchAddress } from "@/actions/address.actions";
import { CreateAddressDialog } from "@/app/(app)/my/profile/components/address/CreateAddressDialog";
import { AddressDomain } from "@/app/domain/addressDomain";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ChevronDown, EllipsisVertical, Home, MapPin, Search, Star, Trash } from "lucide-react";
import { toast } from "sonner";

interface AddressSelectionDialogProps {
    addresses: AddressDomain[];
    selectedAddressId?: string;
    onSelectAddress?: (address: AddressDomain) => void;
    triggerLabel?: string;
    triggerDescription?: string;
}

type DisplayAddress = {
    address: AddressDomain;
    title: string;
    subtitle?: string;
    description?: string;
};

const formatDisplayAddress = (address: AddressDomain): DisplayAddress => {
    const subtitle = [address.street, address.number].filter(Boolean).join(", ");
    const cityState =
        address.city && address.state
            ? `${address.city} - ${address.state}`
            : address.city || address.state || "";
    const description = [address.neighborhood, cityState]
        .filter(Boolean)
        .join(" • ");

    return {
        address,
        title: address.name || "Endereço",
        subtitle: subtitle || undefined,
        description: description || undefined,
    };
};

export function AddressSelectionDialog({
    addresses,
    selectedAddressId,
    onSelectAddress,
    triggerLabel = "Onde você quer receber?",
    triggerDescription,
}: AddressSelectionDialogProps) {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [internalSelection, setInternalSelection] = useState(selectedAddressId);
    const [addressesState, setAddressesState] = useState<AddressDomain[]>(addresses);
    const [favoriteUpdating, setFavoriteUpdating] = useState<string | null>(null);

    useEffect(() => {
        setAddressesState(addresses);
    }, [addresses]);

    const sortedAddresses = useMemo(() => {
        return [...addressesState].sort((a, b) => {
            if (a.isFavorite === b.isFavorite) return 0;
            return a.isFavorite ? -1 : 1;
        });
    }, [addressesState]);

    const displayAddresses = useMemo(() => sortedAddresses.map(formatDisplayAddress), [sortedAddresses]);
    const favoriteAddress = useMemo(() => sortedAddresses.find((address) => address.isFavorite), [sortedAddresses]);

    const effectiveSelection =
        selectedAddressId ?? internalSelection ?? favoriteAddress?.id ?? sortedAddresses[0]?.id;
    const selectedDisplayAddress = displayAddresses.find((item) => item.address.id === effectiveSelection);

    const filteredAddresses = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        if (!normalizedSearch) return displayAddresses;

        return displayAddresses.filter((item) =>
            [item.title, item.subtitle, item.description]
                .filter(Boolean)
                .some((value) => value?.toLowerCase().includes(normalizedSearch)),
        );
    }, [displayAddresses, searchTerm]);

    const handleSelect = (displayAddress: DisplayAddress) => {
        setInternalSelection(displayAddress.address.id);
        onSelectAddress?.(displayAddress.address);
    };

    const handleSetFavorite = async (addressId: string) => {
        if (favoriteUpdating === addressId) return;
        setFavoriteUpdating(addressId);
        try {
            const updated = await patchAddress(addressId, { isFavorite: true });
            setAddressesState((prev) =>
                prev.map((item) =>
                    item.id === addressId
                        ? updated
                        : {
                            ...item,
                            isFavorite: false,
                        },
                ),
            );
            setInternalSelection(addressId);
            onSelectAddress?.(updated);
        } catch (error) {
            console.error("Erro ao atualizar favorito:", error);
        } finally {
            setFavoriteUpdating(null);
        }
    };

    const fallbackSelectedText = selectedDisplayAddress
        ? [selectedDisplayAddress.title, selectedDisplayAddress.subtitle].filter(Boolean).join(" • ")
        : undefined;

    const triggerText = triggerDescription ?? fallbackSelectedText ?? triggerLabel;


    const handleDeleteAddress = async (addressId: string) => {
        if (favoriteUpdating === addressId) return;
        setFavoriteUpdating(addressId);
        try {
            await deleteAddress(addressId);
            setAddressesState((prev) =>
                prev.filter((item) => item.id !== addressId),
            );
        } catch (error) {
            console.error("Erro ao deletar endereço:", error);
            toast.error("Erro ao deletar endereço");
            toast.error(error instanceof Error ? error.message : "Erro ao deletar endereço");
        }
        finally {
            setFavoriteUpdating(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <MapPin className="size-4 text-primary" />
                    <div className="flex flex-col items-start leading-tight">
                        <span className="text-sm font-semibold text-foreground">
                            {triggerText || "Adicionar endereço"}
                        </span>
                    </div>
                    <ChevronDown className="size-4 text-primary" />
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl gap-0 p-0">
                <DialogHeader className="p-6 pb-2">
                    <div className="mx-auto mb-6 flex flex-col items-center gap-4">
                        <DialogTitle className="text-xl font-semibold text-foreground">
                            Onde você quer receber seu pedido?
                        </DialogTitle>
                        <DialogDescription className="text-center text-muted-foreground">
                            Selecione um endereço abaixo ou adicione um novo para continuar com suas compras.
                        </DialogDescription>
                    </div>
                    <Label className="sr-only" htmlFor="address-search">
                        Buscar endereço
                    </Label>
                    <div className="flex flex-col gap-3">
                        <div className="relative">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="address-search"
                                placeholder="Buscar endereço e número"
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </DialogHeader>

                <Separator />

                <ScrollArea className="max-h-[360px] px-6">
                    <div className="flex flex-col gap-3 py-6">
                        {filteredAddresses.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-muted p-6 text-center text-sm text-muted-foreground">
                                Nenhum endereço encontrado. Tente outro termo de busca ou adicione um novo endereço.
                            </div>
                        ) : null}

                        {filteredAddresses.map((item) => {
                            const { address, title, subtitle, description } = item;
                            const isSelected = address.id === effectiveSelection;
                            return (
                                <div
                                    key={address.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => handleSelect(item)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            handleSelect(item);
                                        }
                                    }}
                                    className={cn(
                                        "flex w-full cursor-pointer items-center gap-4 rounded-lg border bg-background p-4 text-left transition-all",
                                        "hover:border-primary/40 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                                        isSelected ? "border-primary ring-2 ring-primary/20" : "border-border",
                                    )}
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/40 text-primary">
                                        <Home className="size-5" />
                                    </div>
                                    <div className="flex flex-1 flex-col gap-1">
                                        <span className="text-sm font-semibold text-foreground">{title}</span>
                                        {subtitle ? (
                                            <span className="text-xs font-medium uppercase tracking-wide text-primary">
                                                {subtitle}
                                            </span>
                                        ) : null}
                                        {description ? (
                                            <span className="text-sm text-muted-foreground">{description}</span>
                                        ) : null}
                                        {isSelected ? (
                                            <span className="text-xs font-medium text-primary">
                                                Endereço selecionado para entrega
                                            </span>
                                        ) : null}
                                    </div>
                                    {address.isFavorite && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            className={cn(
                                                "transition-colors rounded-full",
                                                "text-muted-foreground hover:text-foreground",
                                                address.isFavorite ? "text-primary" : "",
                                            )}
                                            aria-label={`Marcar ${title} como favorito`}
                                        >
                                            <Star size={16} className="text-amber-300" fill={address.isFavorite ? "currentColor" : "none"} />
                                        </Button>
                                    )}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" size="icon">
                                                <EllipsisVertical className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-56" align="start">
                                            <DropdownMenuLabel>Preferências</DropdownMenuLabel>
                                            <DropdownMenuGroup>
                                                {!address.isFavorite && (
                                                    <DropdownMenuItem onClick={() => handleSetFavorite(address.id)}>
                                                        <Star size={16} className="text-amber-300" fill={address.isFavorite ? "currentColor" : "none"} />
                                                        Favoritar endereço
                                                    </DropdownMenuItem>
                                                )}

                                                <DropdownMenuItem onClick={() => handleDeleteAddress(address.id)}>
                                                    <Trash size={16} className="text-red-500" />
                                                    Remover endereço
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            );
                        })}
                    </div>
                </ScrollArea>

                <Separator />

                <DialogFooter className="flex flex-col gap-3 p-6 pt-4 sm:flex-row sm:justify-between">
                    <CreateAddressDialog addressesCount={addresses.length} />
                    <Button
                        type="button"
                        className="w-full sm:w-auto"
                        onClick={() => setOpen(false)}
                    >
                        Continuar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
