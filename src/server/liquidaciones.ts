'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserContext } from '@/server/context'

interface LiquidacionItem {
    id: string
    cantidad_real: number
    precio_unit: number // USD or ARS
}

export async function cerrarOrdenTrabajo(
    orden_id: string, 
    data: {
        cotizacion_usd: number,
        fecha_cierre: Date,
        total_final: number,
        items: LiquidacionItem[],
        insumos: LiquidacionItem[]
    }
) {
    try {
        const { userId } = await getUserContext()
        if (!userId) throw new Error('Unauthorized')

        // Validamos existencia y permisos (idealmente)
        const orden = await prisma.ordenTrabajo.findUnique({ where: { id: orden_id }})
        if (!orden) throw new Error('Orden no encontrada')

        // Transacción para asegurar la integridad de la liquidación
        await prisma.$transaction(async (tx) => {
            // 1. Actualizar Items (Servicios)
            for (const item of data.items) {
                const subtotal = item.cantidad_real * item.precio_unit
                await tx.ordenItem.update({
                    where: { id: item.id },
                    data: {
                        cantidad_real: item.cantidad_real,
                        precio_congelado: item.precio_unit,
                        subtotal_real: subtotal
                    }
                })
            }

            // 2. Actualizar Insumos
            for (const insumo of data.insumos) {
                const subtotal = insumo.cantidad_real * insumo.precio_unit
                await tx.ordenItemInsumo.update({
                    where: { id: insumo.id },
                    data: {
                        cantidad_real: insumo.cantidad_real,
                        precio_congelado: insumo.precio_unit,
                        subtotal_real: subtotal
                    }
                })
            }

            // 3. Cerrar Orden
            await tx.ordenTrabajo.update({
                where: { id: orden_id },
                data: {
                    estado: 'facturada', // o 'completada' dependiendo de la lógica de negocio, asumamos 'facturada' como liquidada por ahora
                    fecha_cierre: new Date(data.fecha_cierre),
                    cotizacion_usd: data.cotizacion_usd,
                    total_final: data.total_final
                }
            })
        })

        revalidatePath('/ordenes')
        return { success: true }
    } catch (error: any) {
        console.error('Error cerrando orden de trabajo:', error)
        return { success: false, error: error.message || 'Error al procesar la liquidación' }
    }
}
