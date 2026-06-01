'use server'

import { revalidatePath } from 'next/cache'
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"
import { LogisticaService } from './services/logistica.service'

export async function getCartasPorte(query?: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CARTAS_PORTE, 'read')
        
        return LogisticaService.getCartasPorte(empresaId, query)
    } catch (error) {
        console.error('Error getting cartas porte:', error)
        return []
    }
}

export async function createCartaPorte(data: any) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CARTAS_PORTE, 'create')
        
        await LogisticaService.createCartaPorte(empresaId, data)
        
        revalidatePath('/cartas-porte')
        return { success: true }
    } catch (error) {
        console.error('Error creating carta porte:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido al emitir Carta Porte' }
    }
}

export async function updateCartaPorte(id: string, data: any) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CARTAS_PORTE, 'update')
        
        await LogisticaService.updateCartaPorte(id, empresaId, data)
        
        revalidatePath('/cartas-porte')
        return { success: true }
    } catch (error) {
        console.error('Error updating carta porte:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Error al actualizar' }
    }
}

export async function deleteCartaPorte(id: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CARTAS_PORTE, 'delete')
        
        await LogisticaService.deleteCartaPorte(id, empresaId)
        
        revalidatePath('/cartas-porte')
        return { success: true }
    } catch (error) {
        console.error('Error deleting carta porte:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Error al eliminar Carta de Porte' }
    }
}
