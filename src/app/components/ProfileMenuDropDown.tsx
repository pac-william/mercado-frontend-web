"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@auth0/nextjs-auth0/types"
import { History, LogOut, Package, User as UserIcon } from "lucide-react"
import Link from "next/link"

export function ProfileMenuDropDown({ currentUser }: { currentUser: User }) {
    const profilePicture = currentUser.picture || '/images/profile-placeholder.png';
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src={profilePicture} />
                        <AvatarFallback>
                            {currentUser.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>{currentUser.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/my/profile" className="flex items-center cursor-pointer">
                        <UserIcon />
                        <span>Perfil</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/my/history" className="flex items-center cursor-pointer">
                        <History />
                        <span>Histórico de Sugestões</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href="/my/orders" className="flex items-center cursor-pointer">
                        <Package />
                        <span>Meus Pedidos</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild variant="destructive">
                    <Link href="/auth/logout" className="flex items-center cursor-pointer">
                        <LogOut />
                        <span>Sair</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
