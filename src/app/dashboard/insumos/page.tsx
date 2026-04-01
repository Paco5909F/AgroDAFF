import { Metadata } from 'next'
import { InsumosClient } from '@/components/insumos/insumos-client'
import { getInsumos } from '@/server/insumos'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PackageOpen } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Insumos | Trisquel',
    description: 'Catálogo y precios de insumos',
}

export default async function InsumosPage() {
    const { success, insumos, error } = await getInsumos()

    if (!success) {
        return (
            <div className="p-8 text-center text-red-500">
                <p>Error cargando insumos: {error}</p>
            </div>
        )
    }

    const serializedInsumos = (insumos || []).map((insumo: any) => {
        const { precios, ...rest } = insumo
        return {
            ...rest,
            precio_actual: Number(insumo.precio_actual)
        }
    })

    return (
        <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-l-4 border-emerald-500 pl-3">
                        Catálogo de Insumos
                    </h2>
                    <p className="text-muted-foreground ml-4 mt-1">
                        Gestione su listado de insumos y actualice precios
                    </p>
                </div>
            </div>

            <Card className="border-emerald-100 shadow-sm">
                <CardHeader className="bg-emerald-50/50 border-b border-emerald-50 pb-4">
                    <div className="flex items-center gap-2">
                        <PackageOpen className="h-5 w-5 text-emerald-600" />
                        <CardTitle className="text-lg text-emerald-950">Insumos Registrados</CardTitle>
                    </div>
                    <CardDescription>
                        Los insumos se utilizan para calcular costos exactos en las órdenes de trabajo.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <InsumosClient initialData={serializedInsumos} />
                </CardContent>
            </Card>
        </div>
    )
}
