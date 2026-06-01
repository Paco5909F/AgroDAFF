import { Suspense } from 'react'
import { getMaquinariasAction } from '@/server/maquinaria'
import { Tractor } from 'lucide-react'
import { getUserContext } from '@/server/context'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'
import { MaquinariaList } from '@/components/maquinaria/maquinaria-list'
import { MaquinariaFormDialog } from '@/components/maquinaria/maquinaria-form-dialog'

export const dynamic = 'force-dynamic'

export default async function MaquinariaPage() {
    const maquinarias = await getMaquinariasAction()
    const { rol } = await getUserContext()
    const canCreate = hasPermission(rol, PERMISSIONS.MAQUINARIA, 'create')

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Tractor className="h-8 w-8 text-amber-600" />
                        Parque de Maquinaria
                    </h1>
                    <p className="text-slate-500 font-light mt-1">
                        Control operativo, mantenimientos y amortización de la flota.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {canCreate && (
                        <MaquinariaFormDialog />
                    )}
                </div>
            </div>

            <Suspense fallback={<div>Cargando flota...</div>}>
                <MaquinariaList data={maquinarias} rol={rol} />
            </Suspense>
        </div>
    )
}
