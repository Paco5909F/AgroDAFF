'use server'

import { prisma } from '@/lib/prisma'
import { getUserContext } from './context'
import { revalidatePath } from 'next/cache'

export async function getInsumos() {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        const insumos = await prisma.insumo.findMany({
            where: { 
                active: true,
                OR: [
                    { es_global: true },
                    { empresa_id: empresaId }
                ]
            },
            include: {
                precios: {
                    orderBy: { fecha_desde: 'desc' },
                    take: 1
                }
            },
            orderBy: { nombre: 'asc' }
        })

        // Map latest price for ease of use and explicitly format properties for Client Boundary transmission
        const mappedInsumos = insumos.map(insumo => {
            const { precios, ...rest } = insumo
            return {
                ...rest,
                precio_actual: Number(precios[0]?.precio || 0),
                moneda: precios[0]?.moneda || 'USD'
            }
        })

        return { success: true, insumos: mappedInsumos }
    } catch (error: any) {
        console.error("getInsumos Error:", error)
        return { success: false, error: 'Error al obtener insumos de la base de datos' }
    }
}

export async function createInsumo(data: {
    nombre: string,
    tipo: string,
    unidad_medida: string,
    precio: number,
    moneda?: string
}) {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        const insumo = await prisma.$transaction(async (tx) => {
            const newInsumo = await tx.insumo.create({
                data: {
                    nombre: data.nombre,
                    tipo: data.tipo,
                    unidad_medida: data.unidad_medida,
                    empresa_id: empresaId,
                }
            })

            if (data.precio > 0) {
                await tx.precioInsumo.create({
                    data: {
                        insumo_id: newInsumo.id,
                        precio: data.precio,
                        moneda: data.moneda || 'USD',
                    }
                })
            }

            return newInsumo
        })

        revalidatePath('/dashboard/insumos')
        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true, insumo }

    } catch (error: any) {
        console.error("createInsumo Error:", error)
        return { success: false, error: 'Error al crear insumo' }
    }
}

export async function appendPrecioInsumo(insumoId: string, precio: number, moneda: string = 'USD') {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        // Security check: ensure Insumo belongs to this Empresa
        const insumo = await prisma.insumo.findFirst({
            where: { id: insumoId, empresa_id: empresaId }
        })

        if (!insumo) return { success: false, error: 'Insumo no encontrado o es de sistema (no editable)' }
        if (insumo.es_global) return { success: false, error: 'No se puede modificar precio de un insumo global. Clónelo primero.' }

        await prisma.$transaction(async (tx) => {
            // "Close" current active prices by setting fecha_hasta
            await tx.precioInsumo.updateMany({
                where: { insumo_id: insumoId, fecha_hasta: null },
                data: { fecha_hasta: new Date() }
            })

            // Add new price
            await tx.precioInsumo.create({
                data: {
                    insumo_id: insumoId,
                    precio,
                    moneda
                }
            })
        })

        revalidatePath('/dashboard/insumos')
        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true }
    } catch (error: any) {
        console.error("appendPrecioInsumo Error:", error)
        return { success: false, error: 'Error al actualizar precio' }
    }
}

export async function cloneGlobalInsumo(globalId: string, customPrice: number = 0) {
    try {
        const { empresaId } = await getUserContext()
        if (!empresaId) return { success: false, error: 'No autorizado' }

        const globalInsumo = await prisma.insumo.findFirst({
            where: { id: globalId, es_global: true }
        })

        if (!globalInsumo) return { success: false, error: 'Insumo global no encontrado' }

        const newInsumo = await prisma.$transaction(async (tx) => {
            const clon = await tx.insumo.create({
                data: {
                    nombre: globalInsumo.nombre,
                    tipo: globalInsumo.tipo,
                    unidad_medida: globalInsumo.unidad_medida,
                    marca: globalInsumo.marca,
                    proveedor: globalInsumo.proveedor,
                    empresa_id: empresaId,
                    es_global: false
                }
            })

            if (customPrice > 0) {
                await tx.precioInsumo.create({
                    data: {
                        insumo_id: clon.id,
                        precio: customPrice,
                        moneda: 'USD'
                    }
                })
            }
            return clon
        })

        revalidatePath('/dashboard/insumos')
        revalidatePath('/dashboard/ordenes/[id]', 'page')
        return { success: true, insumo: newInsumo }
    } catch (error: any) {
        console.error("cloneGlobalInsumo Error:", error)
        return { success: false, error: 'Error al clonar insumo' }
    }
}
