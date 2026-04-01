'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type Campana = {
    id: string
    nombre: string
    fecha_inicio: Date
    fecha_fin: Date
    activa: boolean
    created_at: Date
}

export type CreateCampanaInput = {
    nombre: string
    fecha_inicio: string | Date // String from form, Date for DB
    fecha_fin: string | Date
    activa?: boolean
    tipo?: string
    ciclo?: string
}

import { getCompanyId } from '@/server/context'

export async function getCampanas() {
    try {
        const empresaId = await getCompanyId()
        const campanas = await prisma.campana.findMany({
            where: {
                OR: [
                    { empresa_id: empresaId },
                    { empresa_id: null }
                ]
            },
            orderBy: {
                fecha_inicio: 'desc'
            }
        })
        return { success: true, data: campanas }
    } catch (error) {
        console.error('Error fetching campanas:', error)
        return { success: false, error: 'Error al obtener campañas' }
    }
}

export async function getCampanaActiva() {
    try {
        const empresaId = await getCompanyId()
        const campana = await prisma.campana.findFirst({
            where: {
                activa: true,
                OR: [
                    { empresa_id: empresaId },
                    { empresa_id: null }
                ]
            }
        })
        return { success: true, data: campana }
    } catch (error) {
        console.error('Error fetching active campana:', error)
        return { success: false, error: 'Error al obtener campaña activa' }
    }
}

export async function createCampana(data: CreateCampanaInput) {
    try {
        const empresaId = await getCompanyId()

        // If this one is set to active, deactivate others for this company
        if (data.activa) {
            await prisma.campana.updateMany({
                where: {
                    activa: true,
                    OR: [
                        { empresa_id: empresaId },
                        { empresa_id: null }
                    ]
                },
                data: { activa: false }
            })
        }

        const campana = await prisma.campana.create({
            data: {
                nombre: data.nombre,
                fecha_inicio: new Date(data.fecha_inicio),
                fecha_fin: new Date(data.fecha_fin),
                activa: data.activa || false,
                tipo: data.tipo || 'GENERAL',
                ciclo: data.ciclo,
                empresa_id: empresaId
            }
        })

        revalidatePath('/campanas')
        revalidatePath('/dashboard')
        revalidatePath('/ordenes')
        return { success: true, data: campana }
    } catch (error) {
        console.error('Error creating campana:', error)
        return { success: false, error: 'Error al crear campaña' }
    }
}

export async function toggleCampanaActiva(id: string) {
    try {
        const empresaId = await getCompanyId()

        // Deactivate all for this company (or legacy)
        await prisma.campana.updateMany({
            where: {
                activa: true,
                OR: [
                    { empresa_id: empresaId },
                    { empresa_id: null }
                ]
            },
            data: { activa: false }
        })

        // Activate specific one using updateMany for multi-tenant safety
        const result = await prisma.campana.updateMany({
            where: { 
                id,
                OR: [
                    { empresa_id: empresaId },
                    { empresa_id: null }
                ]
            },
            data: { activa: true }
        })

        if (result.count === 0) return { success: false, error: 'Campaña no encontrada o sin autorización' }

        revalidatePath('/campanas')
        revalidatePath('/dashboard')
        revalidatePath('/ordenes')
        return { success: true, data: { id } }
    } catch (error) {
        console.error('Error toggling campana:', error)
        return { success: false, error: 'Error al cambiar estado de campaña' }
    }
}

export async function updateCampana(id: string, data: CreateCampanaInput) {
    try {
        const empresaId = await getCompanyId()

        // If updating to active, deactivate others
        if (data.activa) {
            await prisma.campana.updateMany({
                where: {
                    activa: true,
                    id: { not: id },
                    OR: [
                        { empresa_id: empresaId },
                        { empresa_id: null }
                    ]
                },
                data: { activa: false }
            })
        }

        const result = await prisma.campana.updateMany({
            where: { 
                id,
                OR: [
                    { empresa_id: empresaId },
                    { empresa_id: null } // Allow updating legacy if necessary, though ideally we shouldn't mutate nulls here. Kept for compatibility.
                ]
            },
            data: {
                nombre: data.nombre,
                fecha_inicio: new Date(data.fecha_inicio),
                fecha_fin: new Date(data.fecha_fin),
                activa: data.activa || false,
                tipo: data.tipo || 'GENERAL',
                ciclo: data.ciclo
            }
        })
        
        if (result.count === 0) return { success: false, error: 'Campaña no autorizada' }

        revalidatePath('/campanas')
        revalidatePath('/dashboard')
        revalidatePath('/ordenes')
        return { success: true, data: { id } }
    } catch (error) {
        console.error('Error updating campana:', error)
        return { success: false, error: 'Error al actualizar campaña' }
    }
}

export async function deleteCampana(id: string) {
    try {
        const empresaId = await getCompanyId()

        // Use deleteMany to enforce multi-tenant isolation on non-unique fields alongside ID
        const result = await prisma.campana.deleteMany({
            where: { 
                id,
                empresa_id: empresaId
            }
        })

        if (result.count === 0) {
            return { success: false, error: 'Campaña no encontrada o sin autorización' }
        }

        revalidatePath('/campanas')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error deleting campana:', error)
        return { success: false, error: 'Error al eliminar campaña. Asegúrese de que no tenga órdenes asociadas.' }
    }
}
