import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserContextSafe } from '@/server/context'
import { getCampanaById } from '@/server/campanas'
import { getLotesCampana } from '@/server/produccion'
import { prisma } from '@/lib/prisma'
import { Sprout, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { LotesCampanaClient } from '@/components/campanas/lotes-campana-client'

export const metadata: Metadata = {
    title: 'Planificación de Campaña | AgroDAFF',
    description: 'Gestión productiva de la campaña agrícola',
}

export const dynamic = 'force-dynamic'

export default async function CampanaDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const context = await getUserContextSafe()

    if (!context || !context.empresaId) {
        redirect('/login')
    }

    const { id } = await params

    const campanaRes = await getCampanaById(id)
    if (!campanaRes.success || !campanaRes.data) {
        redirect('/campanas')
    }
    const campana = campanaRes.data

    const lotesCampanaRes = await getLotesCampana(id)
    const lotesCampana = lotesCampanaRes.success ? lotesCampanaRes.data : []

    // Fetch all lotes for the dropdown to assign
    const lotes = await prisma.lote.findMany({
        where: { establecimiento: { cliente: { empresa_id: context.empresaId } }, deleted_at: null },
        include: { establecimiento: true },
        orderBy: { nombre: 'asc' }
    })
    
    // Filter out lotes already in this campana
    const assignedIds = lotesCampana?.map((lc: any) => lc.lote_id) || []
    const disponiblesLotes = lotes.filter(l => !assignedIds.includes(l.id))

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/campanas" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Sprout className="h-6 w-6" />
                            </div>
                            {campana.nombre}
                        </h1>
                        <p className="text-slate-500 font-light mt-2 text-lg">
                            Planificación Productiva - {campana.tipo === 'GRUESA' ? 'Cosecha Gruesa' : campana.tipo === 'FINA' ? 'Cosecha Fina' : 'Campaña General'}
                        </p>
                    </div>
                </div>
            </div>

            <LotesCampanaClient 
                campana={campana} 
                lotesCampana={lotesCampana || []} 
                disponiblesLotes={disponiblesLotes} 
            />
        </div>
    )
}
