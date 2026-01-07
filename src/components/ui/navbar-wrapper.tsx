'use client'

import { usePathname } from 'next/navigation'

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

    // Hide Navbar on Login page
    if (pathname === '/login') {
        return null
    }

    return <>{children}</>
}
