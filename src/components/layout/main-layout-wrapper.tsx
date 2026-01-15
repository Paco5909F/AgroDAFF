'use client'

import { usePathname } from 'next/navigation'

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLandingPage = pathname === '/'

    if (isLandingPage) {
        // Landing Page: Full width, no global footer, children handles everything
        return (
            <main className="flex-1 w-full">
                {children}
            </main>
        )
    }

    // Default (Dashboard/App): Container + Global Footer
    return (
        <>
            <main className="flex-1 container mx-auto p-4 md:p-8">
                {children}
            </main>
            <footer className="py-6 px-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white mt-auto">
                <p>© {new Date().getFullYear()} Agroservicios El Trisquel - O'Higgins</p>
            </footer>
        </>
    )
}
