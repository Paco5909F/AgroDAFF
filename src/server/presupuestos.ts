'use server'

import { revalidatePath } from 'next/cache'
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"
import { FinanzasService } from './services/finanzas.service'

export async function getPresupuestos(
    query?: string,
    page: number = 1,
    limit: number = 10
) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'read')
        
        const result = await FinanzasService.getPresupuestos(empresaId, page, limit, query)

        return {
            success: true,
            data: result.presupuestos,
            meta: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        }
    } catch (error) {
        console.error('Error getting presupuestos:', error)
        return { success: false, data: [] }
    }
}

export async function createPresupuesto(data: any) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'create')
        
        await FinanzasService.createPresupuesto(empresaId, data)
        
        revalidatePath('/presupuestos')
        return { success: true }
    } catch (error: any) {
        console.error('Error creating presupuesto:', error)
        return { success: false, error: error.message || 'Failed to create presupuesto' }
    }
}

export async function deletePresupuesto(id: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'delete')
        
        await FinanzasService.deletePresupuesto(id, empresaId)
        
        revalidatePath('/presupuestos')
        return { success: true }
    } catch (error) {
        console.error('Error deleting presupuesto:', error)
        return { success: false, error: 'Failed to delete presupuesto' }
    }
}

export async function updatePresupuestoStatus(id: string, status: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'change_status')
        
        await FinanzasService.updatePresupuestoStatus(id, empresaId, status)

        revalidatePath('/presupuestos')
        revalidatePath('/ordenes')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating presupuesto status:', error)
        return { success: false, error: 'Failed to update status: ' + error.message }
    }
}

export async function updatePresupuesto(id: string, data: any) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'update')
        
        await FinanzasService.updatePresupuesto(id, empresaId, data)

        revalidatePath('/presupuestos')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating presupuesto:', error)
        return { success: false, error: error.message || 'Failed to update presupuesto' }
    }
}
