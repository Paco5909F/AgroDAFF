import { Metadata } from 'next'
import { getCampaignAnalytics } from '@/server/analytics'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, Info, TrendingUp, AlertTriangle, Cpu } from 'lucide-react'
import { AnalyticsChart } from './analytics-chart' // Client Component for Recharts

export const metadata: Metadata = {
    title: 'Analítica Inteligente | AgroDAFF'
}

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
    // Pass null to default to active campaign
    const stats = await getCampaignAnalytics(null)

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(val);

    return (
        <div className="flex-1 space-y-6 container mx-auto p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-400">
                        Inteligencia Agronómica
                    </h2>
                    <p className="text-muted-foreground flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-primary animate-pulse" />
                        Analizando la sanidad financiera de tu campaña en tiempo real
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover:shadow-lg transition-all border-l-4 border-l-primary bg-background/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Gasto Total Campaña</CardTitle>
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-primary truncate" title={formatCurrency(stats.gastoTotal)}>
                            {formatCurrency(stats.gastoTotal)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Acumulado Labores e Insumos</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all bg-background/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Lote más Intensivo</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        {Object.keys(stats.gastoPorLote).length > 0 ? (
                            <>
                                <div className="text-xl font-bold truncate">
                                    {Object.entries(stats.gastoPorLote).sort((a,b) => b[1]-a[1])[0]?.[0] || 'N/A'}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Mayor inyección de capital</p>
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground">Sin registros este ciclo</div>
                        )}
                    </CardContent>
                </Card>

                <Card className="lg:col-span-1 md:col-span-2 shadow-xl bg-gradient-to-br from-primary/10 to-transparent border-primary/20">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-emerald-500 animate-pulse" />
                            Sugerencias de la IA
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {stats.sugerencias.length > 0 ? (
                            stats.sugerencias.map((s, i) => (
                                <div key={i} className="text-sm p-3 bg-background rounded-md shadow-sm border border-border/50 text-foreground flex items-start gap-2">
                                    <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    <span>{s}</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm text-muted-foreground pt-2">No se encontraron anomalías estadísticas.</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="shadow-lg min-h-[400px]">
                    <CardHeader>
                        <CardTitle>Composición del Gasto x Lote</CardTitle>
                        <CardDescription>Distribución porcentual de inyección de capital a lo largo del establecimiento.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <AnalyticsChart type="pie" data={Object.entries(stats.gastoPorLote).map(([name, value]) => ({ name, value }))} />
                    </CardContent>
                </Card>

                <Card className="shadow-lg min-h-[400px]">
                    <CardHeader>
                        <CardTitle>Gastos por Categoría Insumo</CardTitle>
                        <CardDescription>Histograma agrupativo para detectar excesos toxicológicos.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <AnalyticsChart type="bar" data={Object.entries(stats.gastoPorInsumo).map(([name, value]) => ({ name, value }))} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
