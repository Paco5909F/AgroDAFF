'use server'

import { revalidatePath } from "next/cache"
import { getUserContext } from "./context"
import { CatalogosService } from "./services/catalogos.service"

export async function getServicios(query?: string) {
    const { empresaId } = await getUserContext()
    return CatalogosService.getServicios(empresaId, query)
}

export async function createServicio(nombre: string, unidad: string, precio: number, moneda: string = 'ARS') {
    try {
        const { empresaId } = await getUserContext()
        
        await CatalogosService.createServicio(empresaId, {
            nombre,
            unidad,
            precio,
            moneda
        })
        
        revalidatePath('/ordenes')
        revalidatePath('/servicios')
        return { success: true }
    } catch (error) {
        console.error('Error creating servicio:', error)
        return { success: false, error: 'Database error' }
    }
}

export async function deleteServicio(id: string) {
    try {
        const { empresaId } = await getUserContext()
        
        await CatalogosService.deleteServicio(id, empresaId)
        
        revalidatePath('/ordenes')
        revalidatePath('/servicios')
        return { success: true }
    } catch (error: any) {
        console.error('Error deleting servicio:', error)
        return { success: false, error: error.message || 'Failed to delete servicio' }
    }
}

export async function updateServicio(id: string, data: any) {
    try {
        const { empresaId } = await getUserContext()
        
        await CatalogosService.updateServicio(id, empresaId, data)
        
        revalidatePath('/ordenes')
        revalidatePath('/servicios')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating servicio:', error)
        return { success: false, error: error.message || 'Failed to update servicio' }
    }
}
