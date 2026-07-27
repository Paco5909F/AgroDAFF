import { getCampanas } from "@/server/campanas"
import { CampanaList } from "@/components/campanas/campana-list"
import { CampanaDialog } from "@/components/campanas/campana-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Sprout } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function CampanasPage() {
    const { data: campanas } = await getCampanas()

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Sprout className="h-8 w-8 text-slate-400" />
                        Campañas Agrícolas
                    </h1>
                    <p className="text-slate-500 font-light mt-1">Administre las temporadas de siembra y cosecha.</p>
                </div>
                <CampanaDialog
                    trigger={
                        <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Campaña
                        </Button>
                    }
                />
            </div>

            <CampanaList campanas={campanas || []} />
        </div>
    )
}
