'use server'

import { prisma } from '@/lib/prisma'
import { getUserContext } from './context'
import { revalidatePath } from 'next/cache'

export interface CalculateCostParams {
    dosis_por_ha: number
    cantidad_pasadas: number
    hectareas: number
    precio_unitario: number
    interes_mensual?: number
    meses_financiacion?: number
}

// Pure business logic: Calculate Cost
export async function calculateInsumoCost(data: CalculateCostParams) {
    const { dosis_por_ha, precio_unitario, cantidad_pasadas, hectareas, interes_mensual, meses_financiacion } = data

    const costo_por_ha = dosis_por_ha * precio_unitario * cantidad_pasadas
    const costo_total = costo_por_ha * hectareas

    let costo_total_financiado = null
    if (interes_mensual && meses_financiacion && interes_mensual > 0 && meses_financiacion > 0) {
        // Interés simple: Costo Final = Costo Inicial * (1 + (Tasa * Tiempo / 100))
        const interes_dec = interes_mensual / 100
        costo_total_financiado = costo_total * (1 + (interes_dec * meses_financiacion))
    }

    return {
        costo_por_ha,
        costo_total,
        costo_total_financiado
    }
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

        // Validate OrdenItem exists and calculate Hectares (either from the Item or Lote)
        const ordenItem = await prisma.ordenItem.findFirst({
            where: { id: data.orden_item_id, orden: { empresa_id: empresaId } },
            include: { lote: true }
        })

        if (!ordenItem) return { success: false, error: 'Ítem de orden no encontrado' }

        // Try to get Hectares to compute total cost (fallback to 1 if unknown or not mapped correctly)
        // Usually, in this domain logic, 'cantidad' on OrdenItem is the hectares for a 'Cosecha/Siembra' service
        const hectareas = Number(ordenItem.cantidad) || Number(ordenItem.lote?.hectareas) || 1

        if (hectareas <= 0 || data.dosis_por_ha <= 0) {
            return { success: false, error: 'Hectáreas y Dosis deben ser mayores a 0' }
        }

        // Fetch Latest Price for Insumo
        const insumo = await prisma.insumo.findFirst({
            where: { id: data.insumo_id, empresa_id: empresaId },
            include: {
                precios: {
                    where: { fecha_hasta: null },
                    orderBy: { fecha_desde: 'desc' },
                    take: 1
                }
            }
        })

        if (!insumo || insumo.precios.length === 0) {
            return { success: false, error: 'Insumo no encontrado o sin precio configurado' }
        }

        const currentPrice = Number(insumo.precios[0].precio)
        const moneda = insumo.precios[0].moneda

        // Calculate Costs
        const calcResult = await calculateInsumoCost({
            dosis_por_ha: data.dosis_por_ha,
            cantidad_pasadas: data.cantidad_pasadas,
            hectareas: hectareas,
            precio_unitario: currentPrice,
            interes_mensual: data.interes_mensual,
            meses_financiacion: data.meses_financiacion
        })

        // Save to Database
        const ordenItemInsumo = await prisma.ordenItemInsumo.create({
            data: {
                orden_item_id: data.orden_item_id,
                insumo_id: data.insumo_id,
                dosis_por_ha: data.dosis_por_ha,
                cantidad_pasadas: data.cantidad_pasadas,
                precio_unit_usado: currentPrice,
                moneda_usada: moneda,
                costo_por_ha: calcResult.costo_por_ha,
                costo_total: calcResult.costo_total,
                interes_mensual: data.interes_mensual,
                meses_financiacion: data.meses_financiacion,
                costo_total_financiado: calcResult.costo_total_financiado
            }
        })

        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true, ordenItemInsumo }

    } catch (error: any) {
        console.error("addInsumoToOrdenItem Error:", error)
        return { success: false, error: 'Error al agregar insumo a la orden' }
    }
}

// Add a remove/delete method as well
export async function deleteOrdenItemInsumo(id: string) {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        // Ensure ownership
        const target = await prisma.ordenItemInsumo.findFirst({
            where: {
                id,
                orden_item: { orden: { empresa_id: empresaId } }
            }
        })

        if (!target) return { success: false, error: 'Insumo de orden no encontrado' }

        await prisma.ordenItemInsumo.delete({ where: { id } })
        
        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true }
    } catch (error: any) {
        console.error("deleteOrdenItemInsumo Error:", error)
        return { success: false, error: 'Error al eliminar insumo de la orden' }
    }
}
