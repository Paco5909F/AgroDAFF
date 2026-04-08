'use client'

import { usePathname } from 'next/navigation'

export function MainLayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLandingPage = pathname === '/'

    if (isLandingPage) {
        // Landing Page: Full width, no global footer, children handles everything
        return (
            <>
                {/* Fixed Background Layer for Landing Page Only */}
                <div
                    className="fixed inset-0 -z-10 h-full w-full bg-cover bg-bottom bg-no-repeat pointer-events-none"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.4) 60%, rgba(255, 255, 255, 0.1) 100%), url('/images/field_background.png')`
                    }}
                />
                <main className="flex-1 w-full">
                    {children}
                </main>
            </>
        )
    }

    // Default (Dashboard/App): Container + Global Footer
    return (
        <>
            <main className="flex-1 container mx-auto p-4 md:p-8">
                {children}
            </main>
            <footer className="py-6 px-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white mt-auto">
                <p>© {new Date().getFullYear()} AgroDAFF SaaS - O'Higgins</p>
            </footer>
        </>
    )
}
