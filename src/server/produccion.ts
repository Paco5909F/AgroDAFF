'use server'

import { prisma } from '@/lib/prisma'
import { getUserContext } from '@/server/context'
import { revalidatePath } from 'next/cache'

export async function getLotesCampana(campanaId: string) {
    try {
        const context = await getUserContext()
        const lotes = await prisma.loteCampana.findMany({
            where: { 
                campana_id: campanaId,
                campana: { empresa_id: context.empresaId }
            },
            include: {
                lote: {
                    include: { establecimiento: true }
                }
            },
            orderBy: { created_at: 'desc' }
        })
        return { success: true, data: lotes }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function addLoteToCampana(data: {
    lote_id: string
    campana_id: string
    cultivo: string
    superficie: number
    rinde_estimado_qq?: number
    fecha_siembra?: string
    observaciones?: string
}) {
    try {
        const context = await getUserContext()
        
        // Ensure campana belongs to this company
        const campana = await prisma.campana.findUnique({
            where: { id: data.campana_id, empresa_id: context.empresaId }
        })
        if (!campana) throw new Error("Campaña no encontrada o acceso denegado")

        const loteCampana = await prisma.loteCampana.create({
            data: {
                lote_id: data.lote_id,
                campana_id: data.campana_id,
                cultivo: data.cultivo,
                superficie: data.superficie,
                rinde_estimado_qq: data.rinde_estimado_qq || null,
                fecha_siembra: data.fecha_siembra ? new Date(data.fecha_siembra) : null,
                observaciones: data.observaciones
            }
        })
        
        revalidatePath(`/campanas/${data.campana_id}`)
        revalidatePath(`/lotes`)
        return { success: true, data: loteCampana }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function updateLoteCampana(id: string, data: {
    cultivo: string
    superficie: number
    rinde_estimado_qq?: number
    rinde_real_qq?: number
    fecha_siembra?: string
    fecha_cosecha?: string
    observaciones?: string
}) {
    try {
        const context = await getUserContext()
        
        // Security check
        const existing = await prisma.loteCampana.findUnique({
            where: { id },
            include: { campana: true }
        })
        
        if (!existing || existing.campana.empresa_id !== context.empresaId) {
            throw new Error("Lote-Campaña no encontrado o acceso denegado")
        }

        const loteCampana = await prisma.loteCampana.update({
            where: { id },
            data: {
                cultivo: data.cultivo,
                superficie: data.superficie,
                rinde_estimado_qq: data.rinde_estimado_qq || null,
                rinde_real_qq: data.rinde_real_qq || null,
                fecha_siembra: data.fecha_siembra ? new Date(data.fecha_siembra) : null,
                fecha_cosecha: data.fecha_cosecha ? new Date(data.fecha_cosecha) : null,
                observaciones: data.observaciones,
                updated_at: new Date()
            }
        })
        
        revalidatePath(`/campanas/${existing.campana_id}`)
        return { success: true, data: loteCampana }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

export async function removeLoteFromCampana(id: string) {
    try {
        const context = await getUserContext()
        
        const existing = await prisma.loteCampana.findUnique({
            where: { id },
            include: { campana: true }
        })
        
        if (!existing || existing.campana.empresa_id !== context.empresaId) {
            throw new Error("Acceso denegado")
        }

        await prisma.loteCampana.delete({ where: { id } })
        
        revalidatePath(`/campanas/${existing.campana_id}`)
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}
