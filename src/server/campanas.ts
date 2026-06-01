'use server'

import { revalidatePath } from 'next/cache'
import { CampanaService } from '@/server/services/campana.service'
import { getCompanyId } from '@/server/context'

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
    fecha_inicio: string | Date
    fecha_fin: string | Date
    activa?: boolean
    tipo?: string
    ciclo?: string
}

export async function getCampanas() {
    try {
        const empresaId = await getCompanyId()
        const campanas = await CampanaService.findAll(empresaId)
        return { success: true, data: campanas }
    } catch (error) {
        console.error('Error fetching campanas:', error)
        return { success: false, error: 'Error al obtener campañas' }
    }
}

export async function getCampanaById(id: string) {
    try {
        const empresaId = await getCompanyId()
        const campana = await CampanaService.findById(id, empresaId)
        if (!campana) return { success: false, error: 'No encontrado' }
        return { success: true, data: campana }
    } catch (error) {
        return { success: false, error: 'Error al obtener campaña' }
    }
}

export async function getCampanaActiva() {
    try {
        const empresaId = await getCompanyId()
        const campana = await CampanaService.findActive(empresaId)
        return { success: true, data: campana }
    } catch (error) {
        console.error('Error fetching active campana:', error)
        return { success: false, error: 'Error al obtener campaña activa' }
    }
}

export async function createCampana(data: CreateCampanaInput) {
    try {
        const empresaId = await getCompanyId()

        const campana = await CampanaService.create({
            nombre: data.nombre,
            fecha_inicio: new Date(data.fecha_inicio),
            fecha_fin: new Date(data.fecha_fin),
            activa: data.activa || false,
            tipo: data.tipo || 'GENERAL',
            ciclo: data.ciclo,
            empresa_id: empresaId
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
        const success = await CampanaService.setAsActive(id, empresaId)

        if (!success) return { success: false, error: 'Campaña no encontrada o sin autorización' }

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

        const success = await CampanaService.update(id, empresaId, {
            nombre: data.nombre,
            fecha_inicio: new Date(data.fecha_inicio),
            fecha_fin: new Date(data.fecha_fin),
            activa: data.activa || false,
            tipo: data.tipo || 'GENERAL',
            ciclo: data.ciclo
        })
        
        if (!success) return { success: false, error: 'Campaña no autorizada' }

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
        const success = await CampanaService.delete(id, empresaId)

        if (!success) {
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
