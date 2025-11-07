import { useState, useTransition } from "react";

import { deleteAddress } from "@/actions/address.actions";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteAddressAlertDialogProps {
    addressId: string;
}

export function DeleteAddressAlertDialog({ addressId }: DeleteAddressAlertDialogProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isOpen, setIsOpen] = useState(false);

    const handleDeleteAddress = () => {
        startTransition(async () => {
            try {
                await deleteAddress(addressId);
                toast.success("Endereço removido com sucesso");
                router.refresh();
                setIsOpen(false);
            } catch (error) {
                const message =
                    error instanceof Error ? error.message : "Erro ao excluir endereço";
                toast.error(message);
            }
        });
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon_xs" className="text-xs rounded-full text-destructive hover:text-destructive/80">
                    <Trash2 size={14} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza que deseja deletar este endereço?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta ação não pode ser desfeita. Este endereço será permanentemente deletado e não poderá ser recuperado.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAddress} disabled={isPending}>
                        {isPending ? "Deletando..." : "Deletar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
