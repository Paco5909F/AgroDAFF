import { Suspense } from 'react'
import Link from 'next/link'
import { getDashboardStats } from '@/server/dashboard'
import { PdfBranding } from "@/lib/pdf-generator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Tractor, DollarSign, Activity, TrendingUp, Calendar, Sprout, LayoutDashboard, Brain, AlertTriangle, CheckCircle2, Building2, Map, Package } from "lucide-react"
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
    let brandingFull: PdfBranding = {
        name: "Tu Organización",
        address: "Dirección no registrada",
        phone: "",
        email: "",
        cuit: "",
        logoUrl: undefined,
        isPremium: false
    }
    if (user) {
        const { getUserContextSafe } = await import('@/server/context');
        const context = await getUserContextSafe();
        
        try {
            const profile = await prisma.usuario.findUnique({
                where: { id: user.id },
                select: { nombre: true }
            })
            if (profile?.nombre) userName = profile.nombre
        } catch (e) {
            console.warn("Could not fetch user profile:", e)
        }
        
        if (context?.empresaId) {
            const empresa = await prisma.empresa.findUnique({
                where: { id: context.empresaId },
                select: { nombre: true, cuit: true, direccion: true, logo_url: true, email: true, telefono: true, plan_status: true, is_lifetime: true }
            })
            if (empresa?.nombre) {
                empresaName = empresa.nombre
                brandingFull = {
                    name: empresa.nombre,
                    address: empresa.direccion || "Dirección no registrada",
                    phone: empresa.telefono || "",
                    email: empresa.email || "",
                    cuit: empresa.cuit || "",
                    logoUrl: empresa.logo_url || undefined,
                    isPremium: empresa.plan_status === 'PRO' || empresa.plan_status === 'ENTERPRISE' || empresa.is_lifetime || false
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
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            
            {/* HERO / HEADER SECTION */}
            <div className="relative overflow-hidden bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-sm rounded-3xl p-6 md:p-8">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 flex items-center justify-center shadow-inner border border-emerald-200/50">
                            <LayoutDashboard className="h-7 w-7 text-emerald-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                                Hola, <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500">{userName}</span>
                            </h1>
                            <p className="text-slate-500 font-medium mt-1 text-sm flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-emerald-500" />
                                <span className="uppercase tracking-wider">{empresaName}</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50/50 p-2 rounded-2xl border border-slate-100">
                        {/* ACTIVE CAMPAIGN PILL */}
                        {stats.activeCampaign && (
                            <Link href="/campanas" className="group flex items-center justify-center gap-2 text-sm bg-white text-indigo-700 px-4 py-2.5 rounded-xl shadow-sm border border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer h-full">
                                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
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
            </div>

            {/* FILA 1: KPIs FINANCIEROS Y OPERATIVOS (GLASSMORPHISM) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Facturación */}
                <Card className="relative overflow-hidden bg-white/80 backdrop-blur-lg border border-slate-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group cursor-default rounded-3xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-colors"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-emerald-600" />
                            </div>
                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-full">Operativa</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Facturación Total</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                            ${totalRevenueCampaign.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </h3>
                    </CardContent>
                </Card>

                {/* Costos */}
                <Card className="relative overflow-hidden bg-white/80 backdrop-blur-lg border border-slate-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group cursor-default rounded-3xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-colors"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                                <TrendingUp className="h-5 w-5 text-red-600 transform rotate-180" />
                            </div>
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest bg-red-50 px-2 py-1 rounded-full">Gastos</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Costos Inyectados</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                            ${analyticsData.gastoTotal.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </h3>
                    </CardContent>
                </Card>

                {/* Margen */}
                <Card className="relative overflow-hidden bg-white/80 backdrop-blur-lg border border-slate-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group cursor-default rounded-3xl">
                    <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 rounded-full blur-2xl transition-colors ${margenBrutoCampana >= 0 ? 'bg-indigo-500/10 group-hover:bg-indigo-500/20' : 'bg-red-500/10 group-hover:bg-red-500/20'}`}></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${margenBrutoCampana >= 0 ? 'bg-indigo-50' : 'bg-red-50'}`}>
                                <Activity className={`h-5 w-5 ${margenBrutoCampana >= 0 ? 'text-indigo-600' : 'text-red-600'}`} />
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${margenBrutoCampana >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-600'}`}>Bruto</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Margen Parcial</p>
                        <h3 className={`text-3xl font-bold tracking-tight ${margenBrutoCampana >= 0 ? 'text-indigo-700' : 'text-red-600'}`}>
                            ${margenBrutoCampana.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </h3>
                    </CardContent>
                </Card>
                
                {/* Costo/ha */}
                <Card className="relative overflow-hidden bg-white/80 backdrop-blur-lg border border-slate-200/60 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 group cursor-default rounded-3xl">
                    <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-colors"></div>
                    <CardContent className="p-6 relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                                <Tractor className="h-5 w-5 text-amber-600" />
                            </div>
                            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-full">
                                {analyticsData.totalHectareas} ha
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-500 mb-1">Costo por Hectárea</p>
                        <h3 className="text-3xl font-bold text-slate-800 tracking-tight">
                            ${analyticsData.costoPorHectarea.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                        </h3>
                    </CardContent>
                </Card>
            </div>

            {/* FILA 2: INTELIGENCIA IA Y GRÁFICOS */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                {/* SUGERENCIAS DE IA */}
                <div className="xl:col-span-1 flex flex-col gap-6">
                    <div className="bg-gradient-to-br from-white to-purple-50/50 border border-purple-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6 relative overflow-hidden flex-1">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center shadow-inner">
                                    <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Análisis de IA</h3>
                                    <p className="text-xs text-slate-500 font-medium">Sugerencias financieras en tiempo real</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                {analyticsData.sugerencias.length === 0 ? (
                                    <div className="p-6 bg-white/80 backdrop-blur-sm border border-purple-100/50 shadow-sm rounded-2xl text-center">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                                        <p className="text-sm text-slate-600 font-medium">Los ratios financieros de tu campaña están estables y saludables.</p>
                                    </div>
                                ) : (
                                    analyticsData.sugerencias.map((sug: string, i: number) => (
                                        <div key={i} className="p-4 bg-white/90 backdrop-blur-md border border-purple-100 shadow-sm rounded-2xl flex gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                            <p className="text-sm text-slate-700 leading-relaxed font-medium">{sug}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Mini Resumen Mensual (from old dashboard) */}
                    <div className="bg-white border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-3xl p-6">
                        <div className="flex items-center gap-2 mb-5">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <h4 className="text-sm font-bold text-slate-700">Resumen de Este Mes</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                <span className="text-sm text-slate-600 font-medium flex items-center gap-2"><Tractor className="w-4 h-4 text-emerald-600" /> Trabajos</span>
                                <span className="font-bold text-slate-800 text-lg">{stats.trabajosMes}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                <span className="text-sm text-slate-600 font-medium flex items-center gap-2"><DollarSign className="w-4 h-4 text-blue-600" /> Facturado</span>
                                <span className="font-bold text-slate-800 text-lg">${stats.facturacionMes.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                                <span className="text-sm text-slate-600 font-medium flex items-center gap-2"><Users className="w-4 h-4 text-purple-600" /> Clientes</span>
                                <span className="font-bold text-slate-800 text-lg">{stats.clientesActivos}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* GRÁFICOS RECHARTS */}
                <div className="xl:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-slate-200/60 rounded-3xl flex flex-col overflow-hidden bg-white/80 backdrop-blur-xl">
                        <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Map className="w-4 h-4 text-slate-400" /> Costo Operativo por Lote
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-6">
                            <AnalyticsChart type="bar" data={chartLotes} />
                        </CardContent>
                    </Card>

                    <Card className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-slate-200/60 rounded-3xl flex flex-col overflow-hidden bg-white/80 backdrop-blur-xl">
                        <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <Package className="w-4 h-4 text-slate-400" /> Partición de Insumos
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 p-6">
                            <AnalyticsChart type="pie" data={chartInsumos} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* FILA 3: STOCK & RECENT ACTIVITY */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                
                <div className="xl:col-span-1">
                    <StockOverview stock={stock || {}} />
                </div>

                <div className="xl:col-span-2">
                    <Card className="h-full border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/80 backdrop-blur-xl overflow-hidden rounded-3xl flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                            <div className="flex items-center gap-3 text-slate-800">
                                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 shadow-inner">
                                    <Activity className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Log de Auditoría</h3>
                                    <p className="text-xs text-slate-500 font-medium">Historial de transacciones financieras</p>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-3 py-1 rounded-full uppercase tracking-wider">Últimas 5 Facturaciones</span>
                        </div>

                        <CardContent className="p-0 flex-1">
                            <div className="divide-y divide-slate-100">
                                {stats.recentActivity.length === 0 ? (
                                    <div className="p-12 flex flex-col items-center justify-center text-slate-400">
                                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
                                            <DollarSign className="w-8 h-8 text-slate-300" />
                                        </div>
                                        <p className="text-sm font-medium">Sin actividad reciente registrada.</p>
                                    </div>
                                ) : (
                                    stats.recentActivity.map((activity: any) => (
                                        <div key={activity.id} className="p-5 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
                                                    <DollarSign className="w-6 h-6" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-slate-800 truncate text-base">
                                                        {activity.servicio.nombre}
                                                    </p>
                                                    <p className="text-sm text-slate-500 font-medium truncate flex items-center gap-1.5">
                                                        <Users className="w-3.5 h-3.5" />
                                                        {activity.cliente.razon_social}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-left sm:text-right pl-16 sm:pl-0 flex flex-col justify-center">
                                                <span className="block font-bold text-slate-800 text-lg">
                                                    ${Number(activity.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-xs font-medium text-slate-400">
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
