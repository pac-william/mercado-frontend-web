"use client"

import { AddressDomain } from "@/app/domain/addressDomain";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { DeleteAddressAlertDialog } from "./DeleteAddressAlertDialog";
import { EditAddressDialog } from "./EditAddressDialog";

interface AddressCardProps {
    address: AddressDomain;
}

export default function AddressCard({ address }: AddressCardProps) {
    return (
        <Card className="bg-card border-border">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex flex-1 items-center justify-between gap-2">
                        <h3 className="text-lg font-medium text-card-foreground">{address.name}</h3>
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
                    </div>
                </div>
                <Separator className="my-2" />
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