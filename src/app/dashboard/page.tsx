import { Suspense } from 'react'
import Link from 'next/link'
import { getDashboardStats } from '@/server/dashboard'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Tractor, DollarSign, Activity, TrendingUp, Calendar, Sprout, LayoutDashboard, Brain, AlertTriangle, CheckCircle2, Building2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { createClient } from "@/lib/supabase/server"
import { StatsFilter } from "@/components/dashboard/stats-filter"
import { StockOverview } from "@/components/dashboard/stock-overview"
import { getAggregatedStock } from "@/server/stock"
import { prisma } from "@/lib/prisma"
import { ExportErpButton } from '@/components/dashboard/erp-export-button'
import { AnalyticsChart } from '@/app/dashboard/analytics/analytics-chart'

interface DashboardPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const params = await searchParams
    const view = params.view as string
    const filterUserId = (view === 'mine' && user) ? user.id : undefined

    // Fetch User Profile for Greeting
    let userName = user?.email?.split('@')[0] || "Usuario"
    let empresaName = "Tu Organización"
    let brandingFull = {
        name: "Tu Organización",
        address: "Dirección no registrada",
        phone: "",
        email: "",
        cuit: "",
        logoUrl: undefined as string | undefined
    }
    if (user) {
        const { getUserContextSafe } = await import('@/server/context');
        const context = await getUserContextSafe();
        
        const profile = await prisma.usuario.findUnique({
            where: { id: user.id },
            select: { nombre: true }
        })
        if (profile?.nombre) userName = profile.nombre
        
        if (context?.empresaId) {
            const empresa = await prisma.empresa.findUnique({
                where: { id: context.empresaId },
                select: { nombre: true, cuit: true, direccion: true, logo_url: true, email: true, telefono: true }
            })
            if (empresa?.nombre) {
                empresaName = empresa.nombre
                brandingFull = {
                    name: empresa.nombre,
                    address: empresa.direccion || "Dirección no registrada",
                    phone: empresa.telefono || "",
                    email: empresa.email || "",
                    cuit: empresa.cuit || "",
                    logoUrl: empresa.logo_url || undefined
                }
            }
        }
    }

    const stats = await getDashboardStats(filterUserId)
    const { data: stock } = await getAggregatedStock()

    const { analyticsData, margenBrutoCampana, totalRevenueCampaign } = stats.erp;

    // Formatting analytics data for Recharts
    const chartLotes = Object.entries(analyticsData.gastoPorLote || {}).map(([name, value]) => ({ name, value: Number(value) }));
    const chartInsumos = Object.entries(analyticsData.gastoPorInsumo || {}).map(([name, value]) => ({ name, value: Number(value) }));
    const loteMasCaro = Object.entries(analyticsData.gastoPorLote || {}).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* HEROLINE / HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <LayoutDashboard className="h-8 w-8 text-emerald-600" />
                        Hola, <span className="font-semibold">{userName}</span>
                    </h1>
                    <p className="text-slate-500 font-medium mt-1 text-xs tracking-widest flex items-center gap-1.5 opacity-90">
                        <Building2 className="w-4 h-4" />
                        <span className="uppercase">{empresaName}</span>
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                    {/* ACTIVE CAMPAIGN PILL */}
                    {stats.activeCampaign && (
                        <Link href="/campanas" className="flex items-center gap-2 text-sm bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full shadow-sm border border-indigo-100 hover:shadow-md transition-all cursor-pointer">
                            <Sprout className="w-4 h-4" />
                            <span className="font-bold">
                                {stats.activeCampaign.nombre}
                            </span>
                        </Link>
                    )}

                    <StatsFilter />
                    <ExportErpButton 
                        empresa={empresaName}
                        branding={brandingFull}
                        campana={stats.activeCampaign?.nombre || 'Actual'}
                        ingresos={totalRevenueCampaign}
                        costos={analyticsData.gastoTotal}
                        margen={margenBrutoCampana}
                        gastosPorLote={analyticsData.gastoPorLote}
                        gastosPorInsumo={analyticsData.gastoPorInsumo}
                        costoPorHectarea={analyticsData.costoPorHectarea}
                        totalHectareas={analyticsData.totalHectareas}
                        labores={analyticsData.labores}
                    />
                </div>
            </div>

            {/* FILA 1: KPIs FINANCIEROS Y OPERATIVOS */}
            {/* The absolute cores for Enterprise Decision Making */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-t-4 border-t-emerald-500 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Facturación Campaña</p>
                            <DollarSign className="h-5 w-5 text-emerald-500/50" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                            ${totalRevenueCampaign.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                            Facturación operativa registrada
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-red-500 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Costos Inyectados</p>
                            <TrendingUp className="h-5 w-5 text-red-500/50 transform rotate-180" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                            ${analyticsData.gastoTotal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">
                            Suma de insumos y servicios consumidos
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-indigo-500 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Margen Bruto Parcial</p>
                            <Activity className="h-5 w-5 text-indigo-500/50" />
                        </div>
                        <h3 className={`text-3xl font-bold tracking-tight ${margenBrutoCampana >= 0 ? 'text-indigo-700' : 'text-red-600'}`}>
                            ${margenBrutoCampana.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </h3>
                        <p className="text-xs text-slate-400 mt-2">
                            Resultado operativo actual
                        </p>
                    </CardContent>
                </Card>
                
                <Card className="border-t-4 border-t-amber-500 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">Costo por Hectárea</p>
                            <AlertTriangle className="h-5 w-5 text-amber-500/50" />
                        </div>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                            ${analyticsData.costoPorHectarea.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </h3>
                        <p className="text-xs text-amber-600 font-medium mt-2 bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                            Promedio ponderado ({analyticsData.totalHectareas} ha)
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* FILA 2: INTELIGENCIA IA Y GRÁFICOS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SUGERENCIAS DE IA */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        Avisos Inteligentes (IA)
                    </h3>
                    <div className="space-y-3">
                        {analyticsData.sugerencias.length === 0 ? (
                            <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-xl text-center">
                                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                <p className="text-sm text-slate-600 font-medium">Los ratios financieros de tu campaña están estables.</p>
                            </div>
                        ) : (
                            analyticsData.sugerencias.map((sug: string, i: number) => (
                                <div key={i} className="p-4 bg-white border border-purple-200 shadow-sm rounded-xl flex gap-3 hover:shadow-md transition-all">
                                    <AlertTriangle className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-slate-800 leading-relaxed font-medium">{sug}</p>
                                </div>
                            ))
                        )}
                        
                        {/* Mini Resumen Mensual (from old dashboard) */}
                        <div className="p-4 bg-white border border-slate-200 rounded-xl mt-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Resumen de Este Mes</h4>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600 flex items-center gap-2"><Tractor className="w-4 h-4 text-amber-500" /> Trabajos Creados</span>
                                <span className="font-bold text-slate-800">{stats.trabajosMes}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600 flex items-center gap-2"><DollarSign className="w-4 h-4 text-emerald-500" /> Fact. Mes</span>
                                <span className="font-bold text-slate-800">${stats.facturacionMes.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600 flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Clientes Activos</span>
                                <span className="font-bold text-slate-800">{stats.clientesActivos}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRÁFICOS RECHARTS */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-sm border-slate-200 h-[350px] flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                Costo por Lote
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                            <AnalyticsChart type="bar" data={chartLotes} />
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-slate-200 h-[350px] flex flex-col">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                                Partición de Insumos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 pb-4">
                            <AnalyticsChart type="pie" data={chartInsumos} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* FILA 3: STOCK & RECENT ACTIVITY */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                <div className="lg:col-span-1">
                    <StockOverview stock={stock || {}} />
                </div>

                <div className="lg:col-span-2">
                    <Card className="h-full border-slate-200 shadow-sm bg-white overflow-hidden">
                        <div className="p-5 border-b border-slate-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-800">
                                <Activity className="h-5 w-5 text-emerald-600" />
                                <h3 className="font-semibold">Log de Auditoría</h3>
                            </div>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Últimas 5 Facturaciones</span>
                        </div>

                        <CardContent className="p-0">
                            <div className="divide-y divide-slate-100">
                                {stats.recentActivity.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        Sin actividad reciente.
                                    </div>
                                ) : (
                                    stats.recentActivity.map((activity: any) => (
                                        <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                                                    <DollarSign className="w-5 h-5" />
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
                                            <div className="text-left sm:text-right pl-13 sm:pl-0">
                                                <span className="block font-bold text-slate-800">
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
