import { Metadata } from 'next'
import { PrismaClient } from '@prisma/client'
import { getUserContext } from '@/server/context'
import { redirect } from 'next/navigation'
import { EmpresaForm } from '@/components/configuracion/empresa-form'
import { prisma } from '@/lib/prisma'
import { Settings } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Configuración | Trisquel',
    description: 'Configuración de la empresa y perfil',
}

export default async function ConfiguracionPage() {
    const context = await getUserContext()

    const empresa = await prisma.empresa.findUnique({
        where: { id: context.empresaId }
    })

    if (!empresa) {
        redirect('/onboarding')
    }

    // Only allow ADMIN to see this page
    if (context.rol !== 'ADMIN') {
        return (
            <div className="flex-1 p-8 text-center text-slate-500">
                <Settings className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <h2 className="text-xl font-medium">Acceso Restringido</h2>
                <p>Solo los administradores pueden acceder a la configuración de la empresa.</p>
            </div>
        )
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Settings className="h-8 w-8 text-slate-400" />
                        Configuración
                    </h1>
                    <p className="text-slate-500 font-light mt-1">
                        Gestione los datos de su empresa y preferencias.
                    </p>
                </div>
            </div>

            <EmpresaForm initialData={empresa} />
        </div>
    )
}
