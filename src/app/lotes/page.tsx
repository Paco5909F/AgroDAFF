import { Suspense } from 'react'
import { getLotes } from '@/server/lotes'
import { LoteListTable } from '@/components/lotes/lote-list-table'
import { LoteFormDialog } from '@/components/lotes/lote-form-dialog'
import { Map } from 'lucide-react'
import { SearchInput } from '@/components/ui/search-input'
import { getUserContext } from '@/server/context'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function LotesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const query = q
    const lotes = await getLotes(query)
    const context = await getUserContext()
    const rol = context.rol
    const canCreate = hasPermission(rol, PERMISSIONS.LOTES, 'create')

    // Fetch establecimientos for the dropdown in form dialog
    const establecimientos = await prisma.establecimiento.findMany({
        where: { empresa_id: context.empresaId, deleted_at: null },
        include: { cliente: true },
        orderBy: { nombre: 'asc' }
    })

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Map className="h-8 w-8 text-slate-400" />
                        Lotes
                    </h1>
                    <p className="text-slate-500 font-light mt-1">
                        Gestione los lotes productivos y campos de sus clientes.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <SearchInput placeholder="Buscar lotes..." />
                    {canCreate && <LoteFormDialog establecimientos={establecimientos} />}
                </div>
            </div>

            <Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando lotes...</div>}>
                <LoteListTable data={lotes} establecimientos={establecimientos} rol={rol} />
            </Suspense>
        </div >
    )
}
