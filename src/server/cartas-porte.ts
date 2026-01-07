'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"

export async function getCartasPorte(query?: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CARTAS_PORTE, 'read')
        const cartas = await prisma.cartaPorte.findMany({
            where: query ? {
                empresa_id: empresaId,
                OR: [
                    { cliente: { razon_social: { contains: query, mode: 'insensitive' } } },
                    { chofer: { contains: query, mode: 'insensitive' } },
                    { patente_camion: { contains: query, mode: 'insensitive' } }
                ]
            } : undefined,
            include: {
                cliente: true
            },
            orderBy: { created_at: 'desc' }
        })
        return cartas.map(carta => ({
            ...carta,
            kilos_estimados: carta.kilos_estimados.toNumber()
        }))
    } catch (error) {
        console.error('Error getting cartas porte:', error)
        return []
    }
}

export async function createCartaPorte(data: any) {
    try {
        // Here we would ideally validate against a Zod schema again on server side
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CARTAS_PORTE, 'create')
        await prisma.cartaPorte.create({
            data: {
                empresa_id: empresaId,
                cliente_id: data.cliente_id,
                ctg: data.ctg,
                fecha_carga: data.fecha_carga,
                origen: data.origen,
                destino: data.destino,
                chofer: data.chofer,
                cuit_chofer: data.cuit_chofer || null,
                corredor: data.corredor || null,
                destinatario: data.destinatario || null,
                patente_camion: data.patente_camion,
                patente_acoplado: data.patente_acoplado || null, // Handle empty string
                kilos_estimados: data.kilos_estimados,
                peso_bruto: data.peso_bruto || null,
                peso_tara: data.peso_tara || null,
                observaciones: data.observaciones || null, // Handle empty string
                estado: 'EMITIDA'
            }
        })
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
        await prisma.cartaPorte.update({
            where: { id, empresa_id: empresaId },
            data: {
                cliente: { connect: { id: data.cliente_id } },
                ctg: data.ctg,
                fecha_carga: data.fecha_carga,
                origen: data.origen,
                destino: data.destino,
                chofer: data.chofer,
                patente_camion: data.patente_camion,
                patente_acoplado: data.patente_acoplado || null,
                kilos_estimados: data.kilos_estimados,
                peso_bruto: data.peso_bruto || null,
                peso_tara: data.peso_tara || null,
                cuit_chofer: data.cuit_chofer || null,
                observaciones: data.observaciones || null,
            }
        })
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
        await prisma.cartaPorte.delete({
            where: { id, empresa_id: empresaId }
        })
        revalidatePath('/cartas-porte')
        return { success: true }
    } catch (error) {
        console.error('Error deleting carta porte:', error)
        return { success: false, error: 'Error al eliminar Carta de Porte' }
    }
}
