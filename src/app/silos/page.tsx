import { getSilos } from "@/server/silos"
import { getUserContext } from "@/server/context"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"
import { SiloList } from "@/components/silos/silo-list"
import { SiloDialog } from "@/components/silos/silo-dialog"
import { MovimientoDialog } from "@/components/stock/movimiento-dialog"
import { Button } from "@/components/ui/button"
import { Plus, ArrowRightLeft, Warehouse } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function SilosPage() {
    const { data: silos } = await getSilos()
    const { rol } = await getUserContext()
    const canCreate = hasPermission(rol, PERMISSIONS.SILOS, 'create')

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Warehouse className="h-8 w-8 text-slate-400" />
                        Inventario Físico (Silos)
                    </h1>
                    <p className="text-slate-500 font-light mt-1">Gestione sus puntos de acopio: Silos fijos, celdas y silobolsas.</p>
                </div>
                {canCreate && (
                    <SiloDialog
                        trigger={
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="w-4 h-4 mr-2" />
                                Nuevo Silo
                            </Button>
                        }
                    />
                )}
            </div>

            <SiloList silos={silos || []} rol={rol} />
        </div >
    )
}
