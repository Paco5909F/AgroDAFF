'use client'

import { Button } from "@/components/ui/button"
import { Users, User } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

export function StatsFilter() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const currentView = searchParams.get('view') || 'global'

    const handleValueChange = (value: string) => {
        const params = new URLSearchParams(searchParams)
        if (value === 'global') {
            params.delete('view')
        } else {
            params.set('view', value)
        }

        router.replace(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center p-1 bg-slate-100/50 rounded-lg border border-slate-200">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleValueChange('global')}
                className={cn(
                    "gap-2 px-3 h-8 text-xs font-medium transition-all hover:bg-white hover:text-emerald-700 hover:shadow-sm",
                    currentView === 'global' && "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200"
                )}
            >
                <Users className="h-3.5 w-3.5" />
                Globales
            </Button>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => handleValueChange('mine')}
                className={cn(
                    "gap-2 px-3 h-8 text-xs font-medium transition-all hover:bg-white hover:text-emerald-700 hover:shadow-sm",
                    currentView === 'mine' && "bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200"
                )}
            >
                <User className="h-3.5 w-3.5" />
                Mis Estadísticas
            </Button>
        </div>
    )
}
