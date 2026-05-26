import { SetupWizard } from "@/components/setup/setup-wizard"
import { getUserContext } from "@/server/context"
import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic'

export default async function SetupPage() {
    const context = await getUserContext()
    
    // Fetch current company data
    const empresa = await prisma.empresa.findUnique({
        where: { id: context.empresaId }
    })

    if (!empresa) return <div>Empresa no encontrada</div>

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-800">Configuración de la Empresa</h1>
                <p className="text-slate-500 mt-2">Completa el perfil de tu organización para generar PDFs y facturas profesionales.</p>
            </div>
            
            <SetupWizard initialData={empresa} />
        </div>
    )
}
