'use client'

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

interface SearchInputProps {
    placeholder?: string
}

export function SearchInput({ placeholder }: SearchInputProps) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        // Reset page to 1 when searching
        params.set('page', '1')

        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
                placeholder={placeholder || "Buscar..."}
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('q')?.toString()}
                className="pl-9 w-full sm:w-[250px] bg-white border-slate-200 focus:border-emerald-300 transition-colors rounded-full"
            />
        </div>
    )
}
