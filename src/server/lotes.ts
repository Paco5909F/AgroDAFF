'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { LoteFormValues } from '@/lib/validations/lote'
import { getUserContext } from './context'

export async function getLotes(query?: string) {
    const context = await getUserContext()
    
    return prisma.lote.findMany({
        where: {
            empresa_id: context.empresaId,
            deleted_at: null,
            ...(query ? {
                nombre: { contains: query, mode: 'insensitive' }
            } : {})
        },
        include: {
            establecimiento: {
                include: {
                    cliente: true
                }
            }
        },
        orderBy: { created_at: 'desc' }
    })
}

export async function createLote(data: LoteFormValues) {
    try {
        const context = await getUserContext()

        const lote = await prisma.lote.create({
            data: {
                nombre: data.nombre,
                hectareas: data.hectareas,
                establecimiento_id: data.establecimiento_id,
                empresa_id: context.empresaId
            }
        })

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

        const lote = await prisma.lote.update({
            where: { id, empresa_id: context.empresaId },
            data: {
                nombre: data.nombre,
                hectareas: data.hectareas,
                establecimiento_id: data.establecimiento_id
            }
        })

        revalidatePath('/lotes')
        return { success: true, data: lote }
    } catch (error: any) {
        return { success: false, error: 'Error al actualizar el lote' }
    }
}

export async function deleteLote(id: string) {
    try {
        const context = await getUserContext()

        await prisma.lote.update({
            where: { id, empresa_id: context.empresaId },
            data: { deleted_at: new Date() }
        })

        revalidatePath('/lotes')
        return { success: true }
    } catch (error) {
        return { success: false, error: 'Error al eliminar el lote' }
    }
}
