'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getServicios(query?: string) {
    const servicios = await prisma.servicio.findMany({
        where: {
            active: true,
            ...(query ? { nombre: { contains: query, mode: 'insensitive' } } : {})
        },
        orderBy: { nombre: 'asc' },
    })

    return servicios.map(s => ({
        ...s,
        precio_base: s.precio_base.toNumber()
    }))
}

// Quick helper to seed/create services if needed for testing
export async function createServicio(nombre: string, unidad: string, precio: number, moneda: string = 'ARS') {
    try {
        await prisma.servicio.create({
            data: {
                nombre,
                unidad_medida: unidad,
                precio_base: precio,
                moneda: moneda,
                active: true
            }
        })
        revalidatePath('/ordenes')
        revalidatePath('/servicios')
        return { success: true }
    } catch (error) {
        console.error('Error creating servicio:', error)
        return { success: false, error: 'Database error' }
    }
}

export async function deleteServicio(id: string) {
    try {
        await prisma.servicio.update({
            where: { id },
            data: { active: false }
        })
        revalidatePath('/ordenes')
        revalidatePath('/servicios')
        return { success: true }
    } catch (error) {
        console.error('Error deleting servicio:', error)
        return { success: false, error: 'Failed to delete servicio' }
    }
}

export async function updateServicio(id: string, data: any) {
    try {
        await prisma.servicio.update({
            where: { id },
            data: {
                nombre: data.nombre,
                unidad_medida: data.unidad_medida,
                precio_base: data.precio_base,
                moneda: data.moneda,
            }
        })
        revalidatePath('/ordenes')
        revalidatePath('/servicios')
        return { success: true }
    } catch (error) {
        console.error('Error updating servicio:', error)
        return { success: false, error: 'Failed to update servicio' }
    }
}
