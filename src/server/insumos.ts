'use server'

import { getUserContext } from './context'
import { revalidatePath } from 'next/cache'
import { CatalogosService } from './services/catalogos.service'

export async function getInsumos() {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        const mappedInsumos = await CatalogosService.getInsumos(empresaId)

        return { success: true, insumos: mappedInsumos }
    } catch (error: any) {
        console.error("getInsumos Error:", error)
        return { success: false, error: 'Error al obtener insumos de la base de datos' }
    }
}

export async function createInsumo(data: {
    nombre: string,
    tipo: string,
    unidad_medida: string,
    precio: number,
    moneda?: string
}) {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        const insumo = await CatalogosService.createInsumo(empresaId, data)

        revalidatePath('/dashboard/insumos')
        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true, insumo }

    } catch (error: any) {
        console.error("createInsumo Error:", error)
        return { success: false, error: 'Error al crear insumo' }
    }
}

export async function appendPrecioInsumo(insumoId: string, precio: number, moneda: string = 'USD') {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        await CatalogosService.appendPrecioInsumo(empresaId, insumoId, precio, moneda)

        revalidatePath('/dashboard/insumos')
        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true }
    } catch (error: any) {
        console.error("appendPrecioInsumo Error:", error)
        return { success: false, error: error.message || 'Error al actualizar precio' }
    }
}

export async function cloneGlobalInsumo(globalId: string, customPrice: number = 0) {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        const newInsumo = await CatalogosService.cloneGlobalInsumo(empresaId, globalId, customPrice)

        revalidatePath('/dashboard/insumos')
        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true, insumo: newInsumo }
    } catch (error: any) {
        console.error("cloneGlobalInsumo Error:", error)
        return { success: false, error: error.message || 'Error al clonar insumo' }
    }
}
