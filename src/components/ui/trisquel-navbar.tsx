import { NavLink } from "@/components/ui/nav-link"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { UserMenu } from "@/components/ui/user-menu"
import { MobileNav } from "@/components/ui/mobile-nav"

export async function TrisquelNavbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let userData = null
    if (user) {
        try {
            userData = await prisma.usuario.findUnique({
                where: { id: user.id },
                select: { nombre: true, rol: true }
            })
        } catch (error) {
            console.error("Error fetching user data:", error)
        }
    }

    return (
        <nav className="bg-white/90 backdrop-blur-xl border-b border-emerald-100/50 sticky top-0 z-50 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 lg:px-8 h-16 md:h-20 flex items-center justify-between">
                {/* Mobile Menu (< lg) - Left Side */}
                <div className="lg:hidden">
                    <MobileNav user={user} userData={userData} />
                </div>

                {/* Logo Section */}
                <a href={user ? "/dashboard" : "/"} className="flex items-center gap-2 md:gap-3 group">
                    <div className="relative w-8 h-8 md:w-11 md:h-11 overflow-hidden rounded-xl shadow-lg shadow-emerald-100 transition-transform group-hover:scale-105 bg-white p-0.5 border border-emerald-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/images/logo.png" alt="Trisquel Logo" className="object-contain w-full h-full" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm md:text-lg font-bold text-slate-800 leading-tight tracking-tight group-hover:text-emerald-700 transition-colors">EL TRISQUEL</span>
                        <span className="text-[8px] md:text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase">Agroservicios</span>
                    </div>
                </a>

                {/* Navigation Links (Desktop > lg) */}
                <div className="hidden lg:flex items-center gap-6">
                    {user ? (
                        <>
                            <div className="flex items-center gap-1 bg-emerald-50/50 p-1.5 rounded-full border border-emerald-100/50">
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
                            </div>
                            <div className="pl-4 border-l border-slate-200 ml-2">
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
