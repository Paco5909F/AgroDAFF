'use server'

import { getUserContext } from './context'
import { revalidatePath } from 'next/cache'
import { OrdenesService, CalculateCostParams } from './services/ordenes.service'

export async function calculateInsumoCost(data: CalculateCostParams) {
    return OrdenesService.calculateInsumoCost(data)
}

export async function addInsumoToOrdenItem(data: {
    orden_item_id: string
    insumo_id: string
    dosis_por_ha: number
    cantidad_pasadas: number
    interes_mensual?: number
    meses_financiacion?: number
}) {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        const ordenItemInsumo = await OrdenesService.addInsumoToOrdenItem(empresaId, data)

        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true, ordenItemInsumo }
    } catch (error: any) {
        console.error("addInsumoToOrdenItem Error:", error)
        return { success: false, error: error.message || 'Error al agregar insumo a la orden' }
    }
}

export async function deleteOrdenItemInsumo(id: string) {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        await OrdenesService.deleteOrdenItemInsumo(id, empresaId)
        
        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true }
    } catch (error: any) {
        console.error("deleteOrdenItemInsumo Error:", error)
        return { success: false, error: error.message || 'Error al eliminar insumo de la orden' }
    }
}
