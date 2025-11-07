"use client"

import { AddressDomain } from "@/app/domain/addressDomain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { DeleteAddressAlertDialog } from "./DeleteAddressAlertDialog";
import { EditAddressDialog } from "./EditAddressDialog";

interface AddressCardProps {
    address: AddressDomain;
}

export default function AddressCard({ address }: AddressCardProps) {
    return (
        <Card className="flex flex-col flex-1">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-card-foreground">{address.name}</CardTitle>
                <div className="flex items-center gap-2">
                    {address.isFavorite ? (
                        <Button variant="ghost" size="icon_xs" className="text-xs rounded-full">
                            <Heart size={14} />
                        </Button>
                    ) :
                        <Button variant="ghost" size="icon_xs" className="text-xs rounded-full">
                            <Heart size={14} />
                        </Button>
                    }
                    <EditAddressDialog address={address} />
                    <DeleteAddressAlertDialog addressId={address.id} />
                </div>
            </CardHeader>
            <Separator />
            <CardContent className="flex flex-col flex-1 p-4">
                <div className="space-y-1 text-sm text-muted-foreground">
                    <p>
                        {address.street}, {address.number}
                        {address.complement && ` - ${address.complement}`}
                    </p>
                    <p>{address.neighborhood}</p>
                    <p>
                        {address.city} - {address.state}, {address.zipCode}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}