import { AddressDomain } from "@/app/domain/addressDomain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AddressCard from "./AddressCard";
import { CreateAddressDialog } from "./CreateAddressDialog";

interface AddressesSectionProps {
    addresses: AddressDomain[];
}

export default function AddressesSection({ addresses }: AddressesSectionProps) {
    return (
        <Card className="flex flex-col flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-card-foreground">Endereços</CardTitle>
                    <CardDescription className="text-muted-foreground">Gerencie seus endereços de entrega</CardDescription>
                </div>
                <CreateAddressDialog />
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col flex-1 gap-4">
                {addresses.length > 0 ? addresses.map((address) => (
                    <AddressCard key={address.id} address={address} />
                )) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-muted-foreground">Nenhum endereço cadastrado</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

