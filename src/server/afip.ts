'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function emitirFactura(ordenId: string, tipoComprobante: string) {
    try {
        // 1. Validate Order
        const orden = await prisma.ordenTrabajo.findUnique({
            where: { id: ordenId },
            include: { cliente: true }
        })

        if (!orden) return { success: false, error: 'Orden no encontrada' }
        if (orden.estado === 'facturada') return { success: false, error: 'Orden ya facturada' }

        // 2. Simulate AFIP Latency (Mock)
        await new Promise(resolve => setTimeout(resolve, 2000))

        // 3. Generate Mock CAE
        const mockCae = `74${Math.floor(Math.random() * 100000000000)}`
        const mockNumero = Math.floor(Math.random() * 10000)

        // 4. Create Factura Record
        const factura = await prisma.factura.create({
            data: {
                orden_trabajo_id: ordenId,
                tipo_comprobante: tipoComprobante, // 'A', 'B', 'C'
                punto_venta: 1,
                numero: mockNumero,
                cae: mockCae,
                fecha_vencimiento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
                total: orden.total,
                estado_afip: 'APROBADO',
                observaciones_afip: 'Simulación de Facturación AFIP (Testing)'
            }
        })

        // 5. Update Order Status
        await prisma.ordenTrabajo.update({
            where: { id: ordenId },
            data: { estado: 'facturada' }
        })

        revalidatePath('/ordenes')

        // Serialize BigInt and Decimals for client
        const serializedFactura = {
            ...factura,
            numero: Number(factura.numero),
            total: Number(factura.total)
        }

        return { success: true, data: serializedFactura }

    } catch (error) {
        console.error('Error emitting factura:', error)
        return { success: false, error: 'Error al conectar con AFIP' }
    }
}
