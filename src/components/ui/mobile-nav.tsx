'use client'

import { useState } from 'react'
import { Menu, X, LayoutDashboard, Users, FileText, ClipboardList, Truck, LogOut, Calendar, Warehouse, BarChart, UserCog, User, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NavLink } from '@/components/ui/nav-link'
import { createClient } from '@/lib/supabase/client'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface MobileNavProps {
    user: any
    userData: any
    companies?: { id: string, nombre: string }[]
    currentCompanyId?: string
}

import { CompanySwitcher } from "@/components/admin/company-switcher"

export function MobileNav({ user, userData, companies = [], currentCompanyId }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.refresh()
        router.push('/')
        setIsOpen(false)
    }

    if (!user) {
        return (
            <div className="lg:hidden flex items-center gap-4">
                <a href="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md">
                    Ingresar
                </a>
            </div>
        )
    }

    return (
        <div className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="text-slate-600">
                <Menu className="h-6 w-6" />
            </Button>

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 top-16 bg-black/50 z-[40] backdrop-blur-[1px]"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Drawer */}
            <div className={cn(
                "fixed top-16 left-0 w-[85%] max-w-[300px] bg-white z-[45] shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col h-auto max-h-[calc(100dvh-5rem)] rounded-br-2xl border-r border-b border-slate-100",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Header - User Info + Company Switcher */}
                <div className="p-6 border-b border-slate-100 flex flex-col gap-3 bg-slate-50/50 shrink-0 rounded-tr-lg">
                    <div className="flex flex-col gap-1">
                        <span className="font-bold text-base text-slate-800">
                            {userData?.nombre || "Usuario"}
                        </span>
                        <span className="text-xs text-slate-500 truncate max-w-[220px]">
                            {user.email}
                        </span>
                    </div>

                    {/* Mobile Company Switcher */}
                    {companies.length > 0 && (
                        <div className="pt-2">
                            <CompanySwitcher
                                companies={companies}
                                currentCompanyId={currentCompanyId}
                                className="w-full justify-between"
                            />
                        </div>
                    )}

                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Links Section */}
                <div className="flex-1 overflow-y-auto py-4 px-4 flex flex-col gap-1 bg-white">
                    {currentCompanyId ? (
                        <>
                            <MobileLink href="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Dashboard
                            </MobileLink>
                            <MobileLink href="/clientes" icon={<Users className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Clientes
                            </MobileLink>
                            <MobileLink href="/presupuestos" icon={<FileText className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Presupuestos
                            </MobileLink>
                            <MobileLink href="/ordenes" icon={<ClipboardList className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Órdenes
                            </MobileLink>
                            <MobileLink href="/dashboard/servicios" icon={<ClipboardList className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Labor
                            </MobileLink>
                            <MobileLink href="/cartas-porte" icon={<Truck className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Logística
                            </MobileLink>
                            <MobileLink href="/campanas" icon={<Calendar className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Campañas
                            </MobileLink>
                            <MobileLink href="/silos" icon={<Warehouse className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Silos (Stock)
                            </MobileLink>
                            <MobileLink href="/reportes" icon={<BarChart className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Reportes
                            </MobileLink>
                            <MobileLink href="/dashboard/equipo" icon={<UserCog className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                Equipo
                            </MobileLink>
                            {userData?.rol === 'ADMIN' && (
                                <>
                                    <div className="h-px bg-slate-100 my-2 mx-2" />
                                    <div className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                        Administración
                                    </div>
                                    <MobileLink href="/dashboard/configuracion" icon={<UserCog className="h-5 w-5" />} onClick={() => setIsOpen(false)}>
                                        Configuración
                                    </MobileLink>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="p-4 text-center text-slate-500 text-sm">
                            Complete la configuración de su empresa para acceder al menú.
                        </div>
                    )}
                </div>

                {/* Footer / Logout */}
                <div className="p-4 bg-white border-t border-slate-100 shrink-0 rounded-br-2xl space-y-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50 gap-3 h-10 text-sm font-medium mb-1"
                        onClick={() => {
                            router.push('/profile')
                            setIsOpen(false)
                        }}
                    >
                        <User className="h-5 w-5 text-slate-400" />
                        Mi Perfil
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50 gap-3 h-10 text-sm font-medium mb-1"
                        onClick={() => {
                            router.push('/pricing')
                            setIsOpen(false)
                        }}
                    >
                        <CreditCard className="h-5 w-5 text-slate-400" />
                        Suscripción
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 gap-3 h-10 text-sm font-medium"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-5 w-5" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </div>
    )
}

function MobileLink({ href, icon, children, onClick }: { href: string; icon: React.ReactNode; children: React.ReactNode; onClick: () => void }) {
    const pathname = usePathname()
    // Simple active check
    const isActive = pathname === href || pathname?.startsWith(`${href}/`)

    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-colors duration-200",
                isActive
                    ? "bg-emerald-50 text-emerald-700 font-medium"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            )}
            onClick={onClick}
        >
            <div className={cn("shrink-0", isActive ? "text-emerald-600" : "text-slate-400")}>
                {icon}
            </div>
            <span className="text-base font-medium">{children}</span>
        </Link>
    )
}
