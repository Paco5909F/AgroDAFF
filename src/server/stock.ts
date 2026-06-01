'use server'

import { revalidatePath } from 'next/cache'
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"
import { StockService } from './services/stock.service'

export type MovimientoStock = {
    id: string
    fecha: Date
    tipo: string
    producto: string
    cantidad: number
    lote_id?: string | null
    silo_id?: string | null
    created_at: Date
    lote?: { nombre: string }
    silo?: { nombre: string }
}

export type CreateMovimientoInput = {
    fecha: string | Date
    tipo: 'INGRESO' | 'EGRESO'
    producto: string
    cantidad: number
    lote_id?: string
    silo_id?: string
    observaciones?: string
}

export async function createMovimiento(data: CreateMovimientoInput) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.MOVIMIENTOS, 'create')

        await StockService.createMovimiento(empresaId, data)

        revalidatePath('/silos')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Error creating movimiento:', error)
        return { success: false, error: error.message || 'Error al registrar movimiento' }
    }
}

export async function getMovimientosBySilo(siloId: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.MOVIMIENTOS, 'read')
        
        const movimientos = await StockService.getMovimientosBySilo(siloId, empresaId)
        return { success: true, data: movimientos }
    } catch (error) {
        return { success: false, error: 'Error fetching history' }
    }
}

export async function getAggregatedStock() {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.SILOS, 'read')
        
        const stockByProduct = await StockService.getAggregatedStock(empresaId)
        return { success: true, data: stockByProduct }
    } catch (error) {
        console.error("Error calculating stock:", error)
        return { success: false, error: 'Error calculating aggregated stock' }
    }
}
