import { getAddresses } from "@/actions/address.actions";
import RouterBack from "@/components/RouterBack";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LogOut, MapPin, User } from "lucide-react";
import AddressesSection from "./components/address/AddressesSection";
import LogoutSection from "./components/sections/LogoutSection";
import { PersonalInfoSection } from "./components/sections/PersonalInfoSection";

type Section = 'personal' | 'addresses' | 'security' | 'logout';

export default async function Profile() {

    const menuItems = [
        { id: 'personal' as Section, label: 'Informações Pessoais', icon: User },
        { id: 'addresses' as Section, label: 'Endereços', icon: MapPin },
        { id: 'logout' as Section, label: 'Sair da conta', icon: LogOut, destructive: true },
    ];

    const { addresses } = await getAddresses();

    return (
        <div className="flex flex-col flex-1 container mx-auto my-4">
            <div className="flex flex-1 gap-4">
                <Card className="flex flex-col w-[320px]">
                    <CardContent className="p-4">
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Button
                                        key={item.id}
                                        variant="ghost"
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                            "hover:bg-accent hover:text-accent-foreground",
                                        )}
                                    >
                                        <Icon size={16} />
                                        <span className="flex-1 text-left">{item.label}</span>
                                    </Button>
                                );
                            })}
                        </nav>
                    </CardContent>
                </Card>
                <div className="flex flex-col flex-1 gap-4">
                    <RouterBack />
                    <ScrollArea className="flex flex-col flex-grow h-0 pr-4">
                        <div className="flex flex-col flex-1 gap-4">
                            <div className="flex flex-col flex-1 gap-4">
                                <PersonalInfoSection />
                                <AddressesSection addresses={addresses} />
                                <LogoutSection />
                            </div>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}   