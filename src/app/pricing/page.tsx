import { Suspense } from 'react'
import { getUserContext } from '@/server/context'
import { prisma } from '@/lib/prisma'
import { PricingClient } from '@/components/billing/pricing-client'

export default async function PricingPage() {
    const { empresaId } = await getUserContext()

    const empresa = await prisma.empresa.findUnique({
        where: { id: empresaId },
        select: { plan_status: true }
    })

    return (
        <div className="bg-slate-50/50 -mx-4 md:-mx-8 -my-4 md:-my-8 px-4 md:px-8 min-h-[calc(100vh-4rem)]">
            <div className="py-20 text-center space-y-4">
                <h1 className="text-4xl font-bold text-slate-900">Elije el plan ideal para tu campo</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Comienza gratis y escala a medida que creces. Sin contratos forzosos.
                </p>
            </div>

            <Suspense fallback={<div className="text-center py-20">Cargando planes...</div>}>
                <PricingClient planStatus={empresa?.plan_status || 'FREE'} />
            </Suspense>
        </div>
    )
}
