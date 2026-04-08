import { Suspense } from 'react'
import { getClientes } from '@/server/clientes'
import { ClienteListTable } from '@/components/clientes/cliente-list-table'
import { ClienteFormDialog } from '@/components/clientes/cliente-form-dialog'
import { Users } from 'lucide-react'
import { SearchInput } from '@/components/ui/search-input'
import { getUserContext } from '@/server/context'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'
// Server Component
export const dynamic = 'force-dynamic'

export default async function ClientesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const query = q
    const clientes = await getClientes(query)
    const { rol } = await getUserContext()
    const canCreate = hasPermission(rol, PERMISSIONS.CLIENTES, 'create')

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Users className="h-8 w-8 text-slate-400" />
                        Clientes
                    </h1>
                    <p className="text-slate-500 font-light mt-1">
                        Gestione su cartera de clientes.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <SearchInput placeholder="Buscar clientes..." />
                    {canCreate && <ClienteFormDialog />}
                </div>
            </div >

            <Suspense fallback={<div>Cargando clientes...</div>}>
                <ClienteListTable data={clientes} rol={rol} />
            </Suspense>
        </div >
    )
}
