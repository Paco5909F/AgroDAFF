'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"

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
        const silos = await prisma.silo.findMany({
            where: { active: true, empresa_id: empresaId },
            orderBy: { created_at: 'desc' },
            include: {
                establecimiento: {
                    select: { nombre: true }
                },
                campana: {
                    select: { nombre: true }
                }
            }
        })

        // Serialize decimals
        const serialized = silos.map(s => ({
            ...s,
            capacidad_max: Number(s.capacidad_max),
            stock_actual: Number(s.stock_actual),
            humedad: s.humedad ? Number(s.humedad) : null,
        }))

        return { success: true, data: serialized as unknown as Silo[] }
    } catch (error) {
        console.error('Error fetching silos:', error)
        return { success: false, error: 'Error al obtener silos' }
    }
}

export async function createSilo(data: CreateSiloInput) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.SILOS, 'create')
        await prisma.silo.create({
            data: {
                empresa_id: empresaId,
                nombre: data.nombre,
                tipo: data.tipo,
                capacidad_max: data.capacidad_max,
                stock_actual: data.stock_actual,
                humedad: data.humedad,
                grano: data.grano,
                estado: data.estado,
                establecimiento_id: data.establecimiento_id,
                campana_id: data.campana_id || null
            }
        })
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
        // Soft delete
        await prisma.silo.update({
            where: { id, empresa_id: empresaId },
            data: { active: false }
        })
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
        await prisma.silo.update({
            where: { id, empresa_id: empresaId },
            data: {
                nombre: data.nombre,
                tipo: data.tipo,
                capacidad_max: data.capacidad_max,
                stock_actual: data.stock_actual,
                humedad: data.humedad,
                grano: data.grano,
                estado: data.estado,
                establecimiento_id: data.establecimiento_id,
                campana_id: data.campana_id || null
            }
        })
        revalidatePath('/silos')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error updating silo:', error)
        return { success: false, error: 'Error al actualizar silo' }
    }
}
