import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserContextSafe } from '@/server/context'
import { getFacturas } from '@/server/facturas'
import { FacturaListClient } from '@/components/facturacion/factura-list-client'
import { FileText, ShieldAlert } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Facturación AFIP | AgroDAFF',
    description: 'Gestión de facturación electrónica AFIP',
}

export const dynamic = 'force-dynamic'

export default async function FacturacionPage() {
    const context = await getUserContextSafe()

    if (!context || !context.empresaId) {
        redirect('/login')
    }

    if (context.rol !== 'ADMIN') {
        return (
            <div className="flex-1 p-8 text-center text-slate-500">
                <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h2 className="text-xl font-medium">Acceso Restringido</h2>
                <p>Solo los administradores pueden acceder al módulo de facturación.</p>
            </div>
        )
    }

    const { data: facturas, success, error } = await getFacturas()

    if (!success) {
        return (
            <div className="flex-1 p-8 text-center text-red-500">
                <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-red-300" />
                <h2 className="text-xl font-medium">Error al cargar facturas</h2>
                <p>{error}</p>
            </div>
        )
    }

    // Calcula KPIs
    const totalFacturas = facturas?.length || 0
    const totalAprobadas = facturas?.filter(f => f.estado_afip === 'APROBADO').length || 0
    const montoTotal = facturas?.filter(f => f.estado_afip === 'APROBADO')
                                .reduce((acc, f) => acc + Number(f.total), 0) || 0

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            {/* Cabecera */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                            <FileText className="h-6 w-6" />
                        </div>
                        Facturación AFIP
                    </h1>
                    <p className="text-slate-500 font-light mt-2 text-lg">
                        Visualice y gestione los comprobantes electrónicos emitidos.
                    </p>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="relative">
                        <p className="text-sm font-medium text-slate-500">Monto Facturado Aprobado</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">
                            $ {montoTotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>
                </div>
                
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="relative">
                        <p className="text-sm font-medium text-slate-500">Facturas Aprobadas</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">
                            {totalAprobadas}
                        </h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-slate-100 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity" />
                    <div className="relative">
                        <p className="text-sm font-medium text-slate-500">Total de Emisiones</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">
                            {totalFacturas}
                        </h3>
                    </div>
                </div>
            </div>

            <FacturaListClient data={facturas || []} />
        </div>
    )
}
