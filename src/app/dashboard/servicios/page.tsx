import { Suspense } from 'react'
import { getServicios } from '@/server/servicios'
import ServiciosPageClient from '@/components/servicios/servicios-page-client'
import { ServicioDialog } from '@/components/servicios/servicio-dialog'
import { Search, Plus, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default async function DashboardServiciosPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const servicios = await getServicios(q)

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div>
                    <h2 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Briefcase className="h-8 w-8 text-slate-400" />
                        Catálogo de Labores
                    </h2>
                    <p className="text-slate-500 font-light mt-1">
                        Administración de servicios y costos base.
                    </p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <form action="" className="w-full">
                            <Input
                                placeholder="Filtrar servicios..."
                                name="q"
                                defaultValue={q}
                                className="pl-9 w-full md:w-[250px] bg-white border-slate-200 focus:border-emerald-300 transition-colors rounded-full"
                            />
                        </form>
                    </div>
                    <ServicioDialog>
                        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-100 transition-all hover:scale-105">
                            <Plus className="mr-2 h-4 w-4" /> Nuevo
                        </Button>
                    </ServicioDialog>
                </div>
            </div>

            <Suspense fallback={<div>Cargando servicios...</div>}>
                <ServiciosPageClient data={servicios} />
            </Suspense>
        </div>
    )
}
