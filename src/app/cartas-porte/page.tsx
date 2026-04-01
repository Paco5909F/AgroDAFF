
import { Suspense } from 'react'
import { getCartasPorte } from '@/server/cartas-porte'
import { getClientes } from '@/server/clientes'
import { Input } from '@/components/ui/input'
import { Search, Truck } from 'lucide-react'
import { CartaPorteList } from '@/components/cartas-porte/carta-porte-list'
import { SearchInput } from '@/components/ui/search-input'
import { CartaPorteFormDialog } from '@/components/cartas-porte/carta-porte-form-dialog'
import { getUserContext } from '@/server/context'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'
import { prisma } from "@/lib/prisma"
import { PdfBranding } from "@/lib/pdf-generator"

export default async function CartasPortePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const { q } = await searchParams
    const query = q
    const rawCartas = await getCartasPorte(query)
    const cartas = rawCartas.map((cp: any) => ({
        ...cp,
        kilos_estimados: Number(cp.kilos_estimados),
        peso_bruto: cp.peso_bruto ? Number(cp.peso_bruto) : 0,
        peso_tara: cp.peso_tara ? Number(cp.peso_tara) : 0
    }))
    const clientes = await getClientes()
    const { rol, empresaId } = await getUserContext()

    // Fetch Branding Data
    const empresa = await prisma.empresa.findUnique({
        where: { id: empresaId },
        select: {
            nombre: true,
            cuit: true,
            direccion: true,
            logo_url: true,
            email: true,
            telefono: true
        }
    })

    const branding: PdfBranding = {
        name: empresa?.nombre || "Empresa",
        address: empresa?.direccion || "",
        cuit: empresa?.cuit || "",
        logoUrl: empresa?.logo_url || undefined,
        email: empresa?.email || "",
        phone: empresa?.telefono || ""
    }
    const canCreate = hasPermission(rol, PERMISSIONS.CARTAS_PORTE, 'create')

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Truck className="h-8 w-8 text-slate-400" />
                        Cartas de Porte
                    </h1>
                    <p className="text-sm md:text-base text-slate-500 font-light mt-1">
                        Gestión logística y documentos de transporte de granos.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <SearchInput placeholder="Buscar carta de porte..." />
                    {canCreate && <CartaPorteFormDialog clientes={clientes} />}
                </div>
            </div>

            <Suspense fallback={<div>Cargando...</div>}>
                <CartaPorteList data={cartas} clientes={clientes} rol={rol} branding={branding} />
            </Suspense>
        </div>
    )
}
