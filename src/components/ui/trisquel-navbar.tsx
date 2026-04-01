import { NavLink } from "@/components/ui/nav-link"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { UserMenu } from "@/components/ui/user-menu"
import { MobileNav } from "@/components/ui/mobile-nav"

import { CompanySwitcher } from "@/components/admin/company-switcher"
import { getUserContextSafe } from "@/server/context"

export async function TrisquelNavbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const context = await getUserContextSafe()
    let userData = null
    let isSuperAdmin = false
    let companies: { id: string, nombre: string }[] = []

    if (user && context) {
        try {
            // Fetch minimal display data, but use Context for ROLE
            userData = await prisma.usuario.findUnique({
                where: { id: user.id },
                select: { nombre: true, active_empresa_id: true }
            })

            const SUPER_ADMIN_EMAILS = ['admin@eltrisquel.com']
            if (user.email && SUPER_ADMIN_EMAILS.includes(user.email)) {
                isSuperAdmin = true
                companies = await prisma.empresa.findMany({
                    select: { id: true, nombre: true },
                    orderBy: { nombre: 'asc' }
                })
            }

        } catch (error) {
            console.error("Error fetching user data:", error)
        }
    }

    return (
        <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                {/* Mobile Menu (< lg) - Left Side */}
                <div className="lg:hidden">
                    <MobileNav
                        user={user}
                        userData={{ ...userData, rol: context?.rol }}
                        companies={isSuperAdmin ? companies : []}
                        currentCompanyId={userData?.active_empresa_id || undefined}
                    />
                </div>

                <a href={user ? "/dashboard" : "/"} className="flex items-center gap-2 md:gap-3 group">
                    <div className="relative w-10 h-10 md:w-16 md:h-16 flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/logo.png" alt="Trisquel Logo" className="object-contain w-full h-full" />
                    </div>
                    <span className="font-bold text-sm md:text-lg tracking-tight text-slate-800 group-hover:text-emerald-700 transition-colors">
                        AGROSERVICIOS EL TRISQUEL
                    </span>
                </a>

                {/* Navigation Links (Desktop > lg) */}
                <div className="hidden lg:flex items-center gap-2">
                    {user ? (
                        <>
                            {context && (
                                <div className="flex items-center gap-0.5 bg-emerald-50/50 p-1 rounded-full border border-emerald-100/50">
                                    <NavLink href="/dashboard">Dashboard</NavLink>
                                    <NavLink href="/clientes">Clientes</NavLink>
                                    <NavLink href="/presupuestos">Presupuestos</NavLink>
                                    <NavLink href="/ordenes">Órdenes</NavLink>
                                    <NavLink href="/dashboard/servicios">Labor</NavLink>
                                    <NavLink href="/cartas-porte">Logística</NavLink>
                                    <NavLink href="/campanas">Campañas</NavLink>
                                    <NavLink href="/silos">Silos</NavLink>
                                    <NavLink href="/reportes">Reportes</NavLink>
                                    <NavLink href="/dashboard/equipo">Equipo</NavLink>
                                    <NavLink href="/dashboard/insumos">Insumos</NavLink>
                                    {context?.rol === 'ADMIN' && (
                                        <NavLink href="/dashboard/configuracion">Config</NavLink>
                                    )}
                                </div>
                            )}
                            <div className="pl-3 border-l border-slate-200 ml-2 flex items-center gap-2">
                                {isSuperAdmin && companies.length > 0 && (
                                    <CompanySwitcher
                                        companies={companies}
                                        currentCompanyId={userData?.active_empresa_id || undefined}
                                    />
                                )}
                                <UserMenu
                                    name={userData?.nombre || user.email?.split('@')[0] || "Usuario"}
                                    email={user.email}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-6">
                            <NavLink href="/">Inicio</NavLink>
                            <NavLink href="/servicios">Servicios</NavLink>
                            <NavLink href="/contacto">Contacto</NavLink>
                            <a href="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg hover:shadow-emerald-200">
                                Iniciar Sesión
                            </a>
                        </div>
                    )}
                </div>

                {/* Mobile Menu (< lg) - Removed from right side */}
            </div>
        </nav>
    )
}
