'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

export function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
    const pathname = usePathname()
    // Simple check: exact match or starts with for sub-routes
    const isActive = pathname === href || pathname?.startsWith(`${href}/`)

    return (
        <Link
            href={href}
            className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
        >
            {children}
        </Link>
    )
}
