'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronsUpDown, ShieldAlert } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { switchAdminContext } from '@/server/admin'
import { toast } from 'sonner'

interface CompanySwitcherProps {
    companies: { id: string, nombre: string }[]
    currentCompanyId?: string
    className?: string
}

export function CompanySwitcher({ companies, currentCompanyId, className }: CompanySwitcherProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const currentCompany = companies.find(c => c.id === currentCompanyId)

    const handleSwitch = (companyId: string) => {
        setOpen(false)
        const promise = new Promise((resolve, reject) => {
            startTransition(async () => {
                const res = await switchAdminContext(companyId)
                if (res.success) {
                    resolve(true)
                    // Hard refresh to ensure all server components update
                    // router.refresh() might not be enough for deep layout context
                    window.location.reload()
                } else {
                    reject(res.error)
                }
            })
        })

        toast.promise(promise, {
            loading: 'Cambiando contexto...',
            success: 'Contexto actualizado',
            error: (err) => `Error: ${err}`
        })
    }

    return (
        <Popover open={open} onOpenChange={setOpen} modal={false}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-auto min-w-[200px] h-9 px-3 justify-between border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-950 font-normal", className)}
                >
                    <ShieldAlert className="mr-2 h-4 w-4 text-amber-600" />
                    {currentCompany ? currentCompany.nombre : "Seleccionar Empresa"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Buscar empresa..." />
                    <CommandList>
                        <CommandEmpty>No company found.</CommandEmpty>
                        <CommandGroup heading="Modo Dios Activado">
                            {companies.map((company) => (
                                <CommandItem
                                    key={company.id}
                                    value={company.nombre}
                                    onSelect={() => handleSwitch(company.id)}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            currentCompanyId === company.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {company.nombre}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
