import { Metadata } from 'next'
import { ReportesClient } from '@/components/reportes/reportes-client'
import { getClientes } from '@/server/clientes'
import { getCampanas } from '@/server/campanas'
import { getUserContext } from '@/server/context'
import { prisma } from '@/lib/prisma'
import { BarChart3 } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Reportes y Cierre | AgroDAFF',
    description: 'Generación de reportes y cierre de periodos',
}

export const dynamic = 'force-dynamic'

export default async function ReportesPage() {
    const context = await getUserContext()
    const empresa = await prisma.empresa.findUnique({
        where: { id: context.empresaId }
    })

    const clientes = await getClientes()
    const { data: campanas } = await getCampanas()

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <BarChart3 className="h-8 w-8 text-slate-400" />
                        Reportes de Gestión
                    </h1>
                    <p className="text-slate-500 font-light mt-1">Genere reportes detallados y realice el cierre de periodos.</p>
                </div>
                <div className="flex items-center space-x-2">
                    {/* Optional header actions */}
                </div>
            </div>

            <ReportesClient clientes={clientes} campanas={campanas || []} empresa={empresa} />
        </div>
    )
}
