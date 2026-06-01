'use server'

import { revalidatePath } from 'next/cache'
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"
import { StockService } from './services/stock.service'

export type Silo = {
    id: string
    nombre: string
    tipo: string
    capacidad_max: number
    stock_actual: number
    humedad: number | null
    grano: string | null
    estado: string
    establecimiento_id: string
    campana_id: string | null
    active: boolean
    establecimiento?: {
        nombre: string
    }
    campana?: {
        nombre: string
    } | null
}

export type CreateSiloInput = {
    nombre: string
    tipo: string
    capacidad_max: number
    stock_actual: number
    humedad?: number
    grano?: string
    estado: string
    establecimiento_id: string
    campana_id?: string
}

export async function getSilos() {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.SILOS, 'read')
        
        const silos = await StockService.getSilos(empresaId)
        return { success: true, data: silos as unknown as Silo[] }
    } catch (error) {
        console.error('Error fetching silos:', error)
        return { success: false, error: 'Error al obtener silos' }
    }
}

export async function createSilo(data: CreateSiloInput) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.SILOS, 'create')
        
        await StockService.createSilo(empresaId, data)
        
        revalidatePath('/silos')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error creating silo:', error)
        return { success: false, error: 'Error al crear silo' }
    }
}

export async function deleteSilo(id: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.SILOS, 'delete')
        
        await StockService.deleteSilo(id, empresaId)
        
        revalidatePath('/silos')
        return { success: true }
    } catch (error) {
        console.error('Error deleting silo:', error)
        return { success: false, error: 'Error al eliminar silo' }
    }
}

export async function updateSilo(id: string, data: CreateSiloInput) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.SILOS, 'update')
        
        await StockService.updateSilo(id, empresaId, data)
        
        revalidatePath('/silos')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error updating silo:', error)
        return { success: false, error: 'Error al actualizar silo' }
    }
}
