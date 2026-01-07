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

export async function getCampanas() {
    try {
        const campanas = await prisma.campana.findMany({
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
        const campana = await prisma.campana.findFirst({
            where: { activa: true }
        })
        return { success: true, data: campana }
    } catch (error) {
        console.error('Error fetching active campana:', error)
        return { success: false, error: 'Error al obtener campaña activa' }
    }
}

export async function createCampana(data: CreateCampanaInput) {
    try {
        // If this one is set to active, deactivate others
        if (data.activa) {
            await prisma.campana.updateMany({
                where: { activa: true },
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
                ciclo: data.ciclo
            }
        })

        revalidatePath('/setup/campanas')
        revalidatePath('/ordenes')
        return { success: true, data: campana }
    } catch (error) {
        console.error('Error creating campana:', error)
        return { success: false, error: 'Error al crear campaña' }
    }
}

export async function toggleCampanaActiva(id: string) {
    try {
        // Deactivate all
        await prisma.campana.updateMany({
            where: { activa: true },
            data: { activa: false }
        })

        // Activate specific one
        const campana = await prisma.campana.update({
            where: { id },
            data: { activa: true }
        })

        revalidatePath('/setup/campanas')
        revalidatePath('/ordenes')
        return { success: true, data: campana }
    } catch (error) {
        console.error('Error toggling campana:', error)
        return { success: false, error: 'Error al cambiar estado de campaña' }
    }
}

export async function updateCampana(id: string, data: CreateCampanaInput) {
    try {
        // If updating to active, deactivate others
        if (data.activa) {
            await prisma.campana.updateMany({
                where: {
                    activa: true,
                    id: { not: id } // Exclude self
                },
                data: { activa: false }
            })
        }

        const campana = await prisma.campana.update({
            where: { id },
            data: {
                nombre: data.nombre,
                fecha_inicio: new Date(data.fecha_inicio),
                fecha_fin: new Date(data.fecha_fin),
                activa: data.activa || false,
                tipo: data.tipo || 'GENERAL',
                ciclo: data.ciclo
            }
        })

        revalidatePath('/setup/campanas')
        revalidatePath('/ordenes')
        return { success: true, data: campana }
    } catch (error) {
        console.error('Error updating campana:', error)
        return { success: false, error: 'Error al actualizar campaña' }
    }
}

export async function deleteCampana(id: string) {
    try {
        await prisma.campana.delete({
            where: { id }
        })
        revalidatePath('/setup/campanas')
        return { success: true }
    } catch (error) {
        console.error('Error deleting campana:', error)
        return { success: false, error: 'Error al eliminar campaña. Asegúrese de que no tenga órdenes asociadas.' }
    }
}
