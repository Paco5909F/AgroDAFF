import { Suspense } from 'react'
import Link from 'next/link'
import { getDashboardStats } from '@/server/dashboard'
import { Card, CardContent } from "@/components/ui/card"
import { Users, Tractor, DollarSign, Activity, TrendingUp, Calendar, Sprout, LayoutDashboard } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { createClient } from "@/lib/supabase/server"
import { StatsFilter } from "@/components/dashboard/stats-filter"
import { StockOverview } from "@/components/dashboard/stock-overview"
import { getAggregatedStock } from "@/server/stock"
import { prisma } from "@/lib/prisma"

interface DashboardPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const params = await searchParams
    const view = params.view as string
    const filterUserId = (view === 'mine' && user) ? user.id : undefined

    // Fetch User Profile for Greeting
    let userName = user?.email?.split('@')[0] || "Usuario"
    if (user) {
        const profile = await prisma.usuario.findUnique({
            where: { id: user.id },
            select: { nombre: true }
        })
        if (profile?.nombre) userName = profile.nombre
    }

    const stats = await getDashboardStats(filterUserId)
    const { data: stock } = await getAggregatedStock()

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <LayoutDashboard className="h-8 w-8 text-slate-400" />
                        Hola, <span className="font-semibold text-emerald-600">{userName}</span>
                    </h1>
                    <p className="text-slate-500 font-light mt-1">
                        Resumen general de tu actividad.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    {/* ACTIVE CAMPAIGN PILL - MINIMALIST */}
                    {stats.activeCampaign && (
                        <Link href="/campanas" className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 w-fit animate-in fade-in zoom-in duration-500 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
                            {stats.activeCampaign.tipo === 'GRUESA' ? (
                                <span className="text-amber-500 text-xs">☀️</span>
                            ) : stats.activeCampaign.tipo === 'FINA' ? (
                                <span className="text-blue-500 text-xs">❄️</span>
                            ) : (
                                <Sprout className="w-3 h-3 text-emerald-500" />
                            )}
                            <span className="font-semibold text-slate-700">
                                {stats.activeCampaign.nombre}
                            </span>
                        </Link>
                    )}

                    <StatsFilter />
                    <div className="flex items-center gap-2 text-sm text-slate-500 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100 w-fit">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Argentina/Buenos_Aires' })}</span>
                    </div>
                </div>
            </div>

            {/* METRICS GRID - HIGH CONTRAST */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Facturacion Card */}
                <Card className="border shadow-none border-slate-200 bg-white relative overflow-hidden group hover:border-emerald-300 hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                    <CardContent className="p-5 flex flex-col h-full pl-7">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                                <DollarSign className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-50 rounded-lg text-slate-500 border border-slate-100 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> Mes Actual
                            </span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Facturación Realizada</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                ${stats.facturacionMes.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                            </h3>
                            <p className="text-xs text-amber-600 font-medium mt-1 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                                + ${stats.facturacionPendiente.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} Pendiente
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Trabajos Card */}
                <Card className="border shadow-none border-slate-200 bg-white relative overflow-hidden group hover:border-amber-300 hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                    <CardContent className="p-5 flex flex-col h-full pl-7">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                                <Tractor className="h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Trabajos Realizados</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                {stats.trabajosMes}
                            </h3>
                        </div>
                    </CardContent>
                </Card>

                {/* Stock Overview */}
                <div className="md:col-span-3 lg:col-span-1">
                    <StockOverview stock={stock || {}} />
                </div>

                {/* Clientes Card */}
                <Card className="border shadow-none border-slate-200 bg-white relative overflow-hidden group hover:border-stone-400 hover:shadow-md transition-all duration-300">
                    <div className="absolute top-0 left-0 w-1 h-full bg-stone-500"></div>
                    <CardContent className="p-5 flex flex-col h-full pl-7">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2.5 bg-stone-100 text-stone-600 rounded-xl">
                                <Users className="h-6 w-6" />
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Clientes Activos</p>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-800 tracking-tight">
                                {stats.clientesActivos}
                            </h3>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CHARTS & ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {/* Chart occupies 4 columns on large screens */}
                <div className="lg:col-span-4">
                    <OverviewChart data={stats.monthlyRevenue} />
                </div>

                {/* Recent Activity occupies 3 columns */}
                <div className="lg:col-span-3">
                    <Card className="h-full border-none shadow-lg shadow-emerald-100/30 bg-white overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-800">
                                <Activity className="h-5 w-5 text-emerald-600" />
                                <h3 className="font-semibold text-lg">Actividad Reciente</h3>
                            </div>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Últimas órdenes</span>
                        </div>

                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-50">
                                {stats.recentActivity.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        No hay actividad registrada recientemente.
                                    </div>
                                ) : (
                                    stats.recentActivity.map((activity: any) => (
                                        <div key={activity.id} className="p-4 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between group gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors shrink-0">
                                                    <Tractor className="w-5 h-5" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-medium text-slate-800 truncate">
                                                        {activity.servicio.nombre}
                                                    </p>
                                                    <p className="text-sm text-slate-500 truncate">
                                                        {activity.cliente.razon_social}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right pl-14 sm:pl-0">
                                                <span className="block font-medium text-slate-800">
                                                    ${Number(activity.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-xs text-slate-400">
                                                    {new Date(activity.fecha).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div >
    )
}
