import { Suspense } from 'react'
import { getProveedoresAction } from '@/server/proveedores'
import { ProveedorListTable } from '@/components/proveedores/proveedor-list-table'
import { ProveedorFormDialog } from '@/components/proveedores/proveedor-form-dialog'
import { BriefcaseBusiness } from 'lucide-react'
import { SearchInput } from '@/components/ui/search-input'
import { getUserContext } from '@/server/context'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'

export const dynamic = 'force-dynamic'

export default async function ProveedoresPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const query = q
    const proveedores = await getProveedoresAction(query)
    const { rol } = await getUserContext()
    const canCreate = hasPermission(rol, PERMISSIONS.PROVEEDORES, 'create')

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <BriefcaseBusiness className="h-8 w-8 text-slate-400" />
                        Proveedores
                    </h1>
                    <p className="text-slate-500 font-light mt-1">
                        Gestione sus cuentas a pagar y proveedores de insumos.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <SearchInput placeholder="Buscar proveedor..." />
                    {canCreate && <ProveedorFormDialog />}
                </div>
            </div>

            <Suspense fallback={<div>Cargando proveedores...</div>}>
                <ProveedorListTable data={proveedores} rol={rol} />
            </Suspense>
        </div>
    )
}
