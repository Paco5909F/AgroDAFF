"use client"

import { createClient } from "@/lib/supabase/client"
import { LogOut, User, ChevronDown, CreditCard } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

interface UserMenuProps {
    name: string | null
    email: string | undefined
    avatarUrl?: string
}

export function UserMenu({ name, email, avatarUrl }: UserMenuProps) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push("/login")
    }

    const initials = name
        ? name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
        : email?.substring(0, 2).toUpperCase() || "U"

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-auto rounded-full pl-2 pr-4 hover:bg-slate-100 transition-colors duration-200" suppressHydrationWarning>
                    <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-slate-200">
                            <AvatarImage src={avatarUrl} alt={name || "User"} />
                            <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-sm">
                            <span className="font-semibold text-slate-700 leading-none">
                                {name || "Usuario"}
                            </span>
                            <span className="text-xs text-muted-foreground leading-none mt-1">
                                {email}
                            </span>
                        </div>
                        <ChevronDown className="h-3 w-3 text-muted-foreground opacity-50 ml-2" />
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Mi Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/pricing")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Suscripción</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
