import { Suspense } from 'react'
import { getOrdenes } from '@/server/ordenes'
import { getClientes } from '@/server/clientes'
import { getServicios, createServicio } from '@/server/servicios'
import { OrdenForm } from '@/components/ordenes/orden-form'
import { OrdenList } from '@/components/ordenes/orden-list'
import { PDFDownloadButton } from '@/components/ordenes/pdf-download-button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { FilePlus, History as HistoryIcon } from "lucide-react"
import { PaginationControls } from "@/components/ui/pagination-controls"
import { SearchInput } from "@/components/ui/search-input"
import { getUserContext } from "@/server/context"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

export default async function OrdenesPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string }>
}) {
    const { page, q } = await searchParams
    const currentPage = Number(page) || 1
    const query = q || ''
    const { data: ordenesData, meta } = await getOrdenes(currentPage, 10, query)

    // Fallback if data is undefined (error case)
    const safeOrdenes = ordenesData || []

    // Serialize Decimals for Client Components
    const serializedOrdenes = (safeOrdenes as any[]).map(o => ({
        ...o,
        total: Number(o.total),
        items: o.items.map((item: any) => ({
            ...item,
            cantidad: Number(item.cantidad),
            precio_unit: Number(item.precio_unit),
            total: Number(item.total),
            kilometros: item.kilometros ? Number(item.kilometros) : null
        }))
    }))
    const clientes = await getClientes()
    const { rol } = await getUserContext()
    const canCreate = hasPermission(rol, PERMISSIONS.ORDENES, 'create')
    // Cast Decimal to number for the component
    const serviciosRaw = await getServicios()
    const servicios = serviciosRaw.map((s: any) => ({
        ...s,
        precio_base: Number(s.precio_base)
    }))

    // Auto-seed services if empty (Demo purpose)
    if (servicios.length === 0) {
        await createServicio("Cosecha", "Ha", 85.00)
        await createServicio("Embolsado", "Ton", 15.50)
        await createServicio("Transporte", "Km", 1.50)
    }

    return (
        <div className="flex flex-col md:flex-row gap-8 space-y-0 animate-in fade-in duration-700">
            {/* LEFT: FORMULARIO */}
            {canCreate && (
                <div className="w-full md:w-1/3">
                    <div className="sticky top-24">
                        <div className="mb-6">
                            <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                                <FilePlus className="h-8 w-8 text-slate-400" />
                                Nueva Orden
                            </h1>
                            <p className="text-slate-500 font-light mt-1 text-sm">
                                Registre un nuevo servicio realizado.
                            </p>
                        </div>
                        <Card className="border-none shadow-lg shadow-emerald-100/50 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-1 h-2 w-full"></div>
                            <CardContent className="p-6">
                                <OrdenForm clientes={clientes} servicios={servicios} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* RIGHT: LISTADO */}
            <div className={`w-full ${canCreate ? 'md:w-2/3' : 'md:w-full'} space-y-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                            <HistoryIcon className="h-8 w-8 text-slate-400" />
                            Historial de Trabajos
                        </h1>
                        <p className="text-slate-500 font-light mt-1 text-sm">
                            Últimos servicios y movimientos registrados.
                        </p>
                    </div>
                    <SearchInput placeholder="Buscar por cliente o servicio..." />
                </div>

                <div className="space-y-4">
                    <OrdenList
                        ordenes={serializedOrdenes}
                        clientes={clientes}
                        servicios={servicios}
                        rol={rol}
                    />
                    {meta && (
                        <PaginationControls
                            currentPage={meta.page}
                            totalPages={meta.totalPages}
                            hasNextPage={meta.hasNextPage}
                            hasPrevPage={meta.hasPrevPage}
                        />
                    )}
                </div>

            </div >
        </div >
    )
}
