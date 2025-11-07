import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { LogOut, MapPin, User } from "lucide-react";
import AddressesSection from "./components/sections/AddressesSection";
import LogoutSection from "./components/sections/LogoutSection";
import { PersonalInfoSection } from "./components/sections/PersonalInfoSection";

type Section = 'personal' | 'addresses' | 'security' | 'logout';

export default async function Profile() {

    const menuItems = [
        { id: 'personal' as Section, label: 'Informações Pessoais', icon: User },
        { id: 'addresses' as Section, label: 'Endereços', icon: MapPin },
        { id: 'logout' as Section, label: 'Sair da conta', icon: LogOut, destructive: true },
    ];

    return (
        <div className="flex flex-col flex-1 gap-4 container mx-auto my-4">
            <div className="flex flex-col flex-1 lg:flex-row gap-6">
                <Card className="bg-card border-border lg:sticky lg:top-4 w-[320px]">
                    <CardContent className="p-4">
                        <nav className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                            "hover:bg-accent hover:text-accent-foreground",
                                        )}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="flex-1 text-left">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </CardContent>
                </Card>
                <div className="flex flex-col flex-1">
                    <ScrollArea className="flex flex-col flex-grow h-0 pr-4">
                        <div className="flex flex-col flex-1 gap-6">
                            <PersonalInfoSection />
                            <AddressesSection />
                            <LogoutSection />
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}   