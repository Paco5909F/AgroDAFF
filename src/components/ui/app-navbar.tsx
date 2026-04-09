import { NavLink } from "@/components/ui/nav-link"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { UserMenu } from "@/components/ui/user-menu"
import { MobileNav } from "@/components/ui/mobile-nav"
import Link from "next/link"

import { CompanySwitcher } from "@/components/admin/company-switcher"
import { getUserContextSafe } from "@/server/context"

export async function AppNavbar() {
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
                select: { 
                    nombre: true, 
                    active_empresa_id: true,
                    empresa: { select: { nombre: true, logo_url: true } }
                }
            })

            const SUPER_ADMIN_EMAILS = ['admin@agrodaff.com']
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
                <div className="lg:hidden flex items-center gap-3">
                    <MobileNav
                        user={user}
                        userData={{ ...userData, rol: context?.rol }}
                        companies={isSuperAdmin ? companies : []}
                        currentCompanyId={userData?.active_empresa_id || undefined}
                    />
                    <a href={user ? "/dashboard" : "/"} className="flex items-center gap-2 group shrink-0">
                        <div className="w-8 h-8 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={userData?.empresa?.logo_url || "/images/logo-agrodaff.png"} 
                                alt={`${userData?.empresa?.nombre || 'AgroDAFF'} Logo`} 
                                className="object-contain w-full h-full mix-blend-multiply" 
                            />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800">
                            {userData?.empresa?.nombre || "AgroDAFF"}
                        </span>
                    </a>
                </div>

                {/* Desktop Navbar (Left, Center, Right) */}
                <div className="hidden lg:flex items-center justify-between w-full">
                    
                    {/* LEFT: Branding */}
                    <a href={user ? "/dashboard" : "/"} className="flex items-center gap-3 group shrink-0">
                        <div className="w-10 h-10 flex items-center justify-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img 
                                src={userData?.empresa?.logo_url || "/images/logo-agrodaff.png"} 
                                alt={`${userData?.empresa?.nombre || 'AgroDAFF'} Logo`} 
                                className="object-contain w-full h-full mix-blend-multiply" 
                            />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-slate-800 group-hover:text-emerald-700 transition-colors">
                            {userData?.empresa?.nombre || "AgroDAFF"}
                        </span>
                    </a>

                    {/* CENTER: Navigation Links */}
                    {user ? (
                        context && (
                            <div className="flex items-center space-x-1.5 mx-auto">
                                <Link href="/dashboard" className="px-3 py-2 text-sm font-semibold rounded-md text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors">Dashboard</Link>
                                
                                {/* Operaciones */}
                                <div className="relative group/nav">
                                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors">
                                        Operaciones
                                        <svg className="w-3.5 h-3.5 transition-transform group-hover/nav:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50 py-1.5 focus-within:opacity-100 flex flex-col gap-0.5">
                                        <Link href="/ordenes" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Órdenes</Link>
                                        <Link href="/dashboard/servicios" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Labores</Link>
                                        <Link href="/cartas-porte" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Logística</Link>
                                    </div>
                                </div>

                                {/* Producción */}
                                <div className="relative group/nav">
                                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors">
                                        Producción
                                        <svg className="w-3.5 h-3.5 transition-transform group-hover/nav:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50 py-1.5 focus-within:opacity-100 flex flex-col gap-0.5">
                                        <Link href="/campanas" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Campañas</Link>
                                        <Link href="/lotes" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg flex items-center justify-between">Lotes <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">PRO</span></Link>
                                        <Link href="/silos" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Silos</Link>
                                    </div>
                                </div>

                                {/* Administración */}
                                <div className="relative group/nav">
                                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors">
                                        Administración
                                        <svg className="w-3.5 h-3.5 transition-transform group-hover/nav:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50 py-1.5 focus-within:opacity-100 flex flex-col gap-0.5">
                                        <Link href="/clientes" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Clientes</Link>
                                        <Link href="/presupuestos" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Presupuestos</Link>
                                        <Link href="/facturacion" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg flex items-center justify-between">Facturación <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 py-0.5 rounded font-bold">AFIP</span></Link>
                                    </div>
                                </div>

                                {/* Insumos */}
                                <div className="relative group/nav">
                                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors">
                                        Insumos
                                        <svg className="w-3.5 h-3.5 transition-transform group-hover/nav:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50 py-1.5 focus-within:opacity-100 flex flex-col gap-0.5">
                                        <Link href="/dashboard/insumos" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Insumos</Link>
                                        <Link href="/stock" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Stock</Link>
                                    </div>
                                </div>

                                {/* Análisis */}
                                <div className="relative group/nav">
                                    <button className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-md text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors">
                                        Análisis
                                        <svg className="w-3.5 h-3.5 transition-transform group-hover/nav:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50 py-1.5 focus-within:opacity-100 flex flex-col gap-0.5">
                                        <Link href="/reportes" className="px-4 py-2 text-sm text-slate-700 font-medium hover:bg-emerald-50 hover:text-emerald-700 mx-1.5 rounded-lg">Reportes</Link>
                                    </div>
                                </div>

                                <Link href="/dashboard/equipo" className="px-3 py-2 text-sm font-semibold rounded-md text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors">Equipo</Link>
                                
                                {context?.rol === 'ADMIN' && (
                                    <Link href="/dashboard/configuracion" className="px-3 py-2 text-sm font-semibold rounded-md text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors flex items-center justify-center">
                                        <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    </Link>
                                )}
                            </div>
                        )
                    ) : (
                        <div className="flex items-center gap-6 mx-auto">
                            <NavLink href="/">Inicio</NavLink>
                            <NavLink href="/servicios">Servicios</NavLink>
                            <NavLink href="/contacto">Contacto</NavLink>
                        </div>
                    )}

                    {/* RIGHT: Profile Settings */}
                    <div className="flex items-center gap-3 shrink-0">
                        {user ? (
                            <>
                                {isSuperAdmin && companies.length > 0 && (
                                    <CompanySwitcher
                                        companies={companies}
                                        currentCompanyId={userData?.active_empresa_id || undefined}
                                    />
                                )}
                                <div className="border-l border-slate-200 pl-3">
                                    <UserMenu
                                        name={userData?.nombre || user.email?.split('@')[0] || "Usuario"}
                                        email={context?.rol ? `${context.rol}` : user.email}
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center shrink-0">
                                <a href="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg hover:shadow-emerald-200">
                                    Iniciar Sesión
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
