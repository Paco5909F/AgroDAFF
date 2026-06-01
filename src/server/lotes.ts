'use server'

import { revalidatePath } from 'next/cache'
import { LoteFormValues } from '@/lib/validations/lote'
import { getUserContext } from './context'
import { ProduccionService } from './services/produccion.service'

export async function getLotes(query?: string) {
    const context = await getUserContext()
    return ProduccionService.getLotes(context.empresaId, query)
}

export async function createLote(data: LoteFormValues) {
    try {
        const context = await getUserContext()
        const lote = await ProduccionService.createLote(context.empresaId, data)

        revalidatePath('/lotes')
        revalidatePath('/clientes')
        
        return { success: true, data: lote }
    } catch (error: any) {
        return { success: false, error: 'Error al crear el lote' }
    }
}

export async function updateLote(id: string, data: LoteFormValues) {
    try {
        const context = await getUserContext()
        const lote = await ProduccionService.updateLote(id, context.empresaId, data)

        revalidatePath('/lotes')
        return { success: true, data: lote }
    } catch (error: any) {
        return { success: false, error: 'Error al actualizar el lote' }
    }
}

export async function deleteLote(id: string) {
    try {
        const context = await getUserContext()
        await ProduccionService.deleteLote(id, context.empresaId)

        revalidatePath('/lotes')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Error al eliminar el lote' }
    }
}
