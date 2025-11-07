import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddressList from "../AddressList";

export default function AddressesSection() {
    return (
        <Card className="bg-card border-border">
            <CardHeader>
                <CardTitle className="text-card-foreground">Endereços</CardTitle>
                <CardDescription className="text-muted-foreground">Gerencie seus endereços de entrega</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <AddressList />
            </CardContent>
        </Card>
    );
}

