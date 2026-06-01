'use server'

import { revalidatePath } from 'next/cache'
import { getUserContext } from '@/server/context'
import { FinanzasService } from './services/finanzas.service'

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

        await FinanzasService.cerrarOrdenTrabajo(orden_id, data)

        revalidatePath('/ordenes')
        return { success: true }
    } catch (error: any) {
        console.error('Error cerrando orden de trabajo:', error)
        return { success: false, error: error.message || 'Error al procesar la liquidación' }
    }
}
