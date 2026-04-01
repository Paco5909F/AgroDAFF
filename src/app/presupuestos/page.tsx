
import { Suspense } from 'react'
import { getPresupuestos } from '@/server/presupuestos' // We just created this
import { getClientes } from '@/server/clientes'
import { getServicios } from '@/server/servicios'
import { PresupuestosList } from '@/components/presupuestos/presupuesto-list' // We will create this
import { PresupuestoFormDialog } from '@/components/presupuestos/presupuesto-form-dialog' // And this
import { Input } from '@/components/ui/input'
import { Search, Calculator } from 'lucide-react'

import { PaginationControls } from "@/components/ui/pagination-controls"
import { SearchInput } from "@/components/ui/search-input"
import { getUserContext } from "@/server/context"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"
import { prisma } from "@/lib/prisma"

export default async function PresupuestosPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string, page?: string }>
}) {
    const { q, page } = await searchParams
    const query = q
    const currentPage = Number(page) || 1

    const { data: presupuestos, meta } = await getPresupuestos(query, currentPage)
    const clientes = await getClientes()
    // Fix decimal services mapping as in orders
    const serviciosRaw = await getServicios()
    const servicios = serviciosRaw.map((s: any) => ({
        ...s,
        precio_base: Number(s.precio_base)
    }))

    const { rol, empresaId } = await getUserContext()
    const canCreate = hasPermission(rol, PERMISSIONS.PRESUPUESTOS, 'create')

    // Fetch Branding Data
    const empresa = await prisma.empresa.findUnique({
        where: { id: empresaId },
        select: {
            nombre: true,
            cuit: true,
            direccion: true,
            logo_url: true,
            email: true,
            telefono: true
        }
    })

    const branding = {
        name: empresa?.nombre || "EL TRISQUEL AGROSERVICIOS",
        address: empresa?.direccion || "O'Higgins, Buenos Aires",
        cuit: empresa?.cuit || "20-12345678-9",
        logoUrl: empresa?.logo_url || undefined,
        email: empresa?.email || "agroserviciosciglieri@hotmail.com",
        phone: empresa?.telefono || "2364-610322"
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Calculator className="h-8 w-8 text-slate-400" />
                        Presupuestos
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 font-light mt-1">
                        Gestione y envíe cotizaciones a sus clientes.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <SearchInput placeholder="Buscar presupuesto..." />
                    {canCreate && (
                        <PresupuestoFormDialog clientes={clientes} servicios={servicios} />
                    )}
                </div>
            </div>

            <Suspense fallback={<div>Cargando presupuestos...</div>}>
                <div className="space-y-4">
                    <PresupuestosList
                        data={presupuestos}
                        clientes={clientes}
                        servicios={servicios}
                        rol={rol}
                        branding={branding}
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
            </Suspense>
        </div>
    )
}
