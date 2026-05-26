'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { format } from 'date-fns'
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"

export async function getPresupuestos(
    query?: string,
    page: number = 1,
    limit: number = 10
) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'read')
        const whereClause: Prisma.PresupuestoWhereInput = {
            empresa_id: empresaId,
            ...(query ? {
                OR: [
                    { cliente: { razon_social: { contains: query, mode: 'insensitive' } } },
                ]
            } : {})
        }

        const [total, presupuestos] = await prisma.$transaction([
            prisma.presupuesto.count({ where: whereClause }),
            prisma.presupuesto.findMany({
                where: whereClause,
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    cliente: true,
                    lote: true,
                    items: true
                },
                orderBy: { created_at: 'desc' }
            })
        ])

        const totalPages = Math.ceil(total / limit)

        const serializedPresupuestos = presupuestos.map((p) => ({
            ...p,
            total: Number(p.total),
            total_final: Number(p.total_final),
            hectareas: Number(p.hectareas),
            fechaFormatted: format(new Date(p.fecha), 'dd/MM/yyyy'),
            items: p.items.map((i) => ({
                ...i,
                cantidad: Number(i.cantidad),
                precio_unit: Number(i.precio_unit),
                subtotal: Number(i.subtotal),
            }))
        }))

        return {
            success: true,
            data: serializedPresupuestos,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        }
    } catch (error) {
        console.error('Error getting presupuestos:', error)
        return { success: false, data: [] }
    }
}

export async function createPresupuesto(data: any) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'create')
        console.log("Creating Presupuesto with data:", JSON.stringify(data, null, 2))
        await prisma.presupuesto.create({
            data: {
                empresa_id: empresaId,
                cliente_id: data.cliente_id,
                lote_id: data.lote_id || null,
                hectareas: data.hectareas || 1,
                fecha: new Date(data.fecha),
                valido_hasta: data.valido_hasta ? new Date(data.valido_hasta) : null,
                total: data.total,
                total_final: data.total_final || data.total,
                observaciones: data.observaciones,
                estado: 'PENDIENTE',
                items: {
                    create: data.items.map((item: any) => ({
                        tipo: item.tipo,
                        referencia_id: item.referencia_id,
                        nombre: item.nombre,
                        unidad: item.unidad,
                        cantidad: item.cantidad,
                        precio_unit: item.precio_unit,
                        subtotal: item.subtotal,
                        detalle: item.detalle || null
                    }))
                }
            }
        })
        revalidatePath('/presupuestos')
        return { success: true }
    } catch (error: any) {
        console.error('Error creating presupuesto:', error)
        return { success: false, error: error.message || 'Failed to create presupuesto' }
    }
}

export async function deletePresupuesto(id: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'delete')
        await prisma.presupuesto.delete({
            where: { id, empresa_id: empresaId }
        })
        revalidatePath('/presupuestos')
        return { success: true }
    } catch (error) {
        console.error('Error deleting presupuesto:', error)
        return { success: false, error: 'Failed to delete presupuesto' }
    }
}

export async function updatePresupuestoStatus(id: string, status: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'change_status')
        const result = await prisma.$transaction(async (tx) => {
            // 1. Update Budget Status
            const presupuesto = await tx.presupuesto.update({
                where: { id, empresa_id: empresaId },
                data: { estado: status },
                include: { items: true }
            })

            // 2. If Approved, Create Work Order automatically
            if (status === 'APROBADO') {
                await tx.ordenTrabajo.create({
                    data: {
                        empresa_id: empresaId,
                        fecha: new Date(),
                        cliente_id: presupuesto.cliente_id,
                        observaciones: `Generado desde Presupuesto #${presupuesto.id.slice(0, 8)}.\n${presupuesto.observaciones || ''}`,
                        total: presupuesto.total_final,
                        moneda: 'ARS',
                        estado: 'pendiente',
                        items: {
                            create: presupuesto.items.map(item => ({
                                servicio_id: item.tipo === 'servicio' ? item.referencia_id : undefined,
                                lote_id: presupuesto.lote_id,
                                cantidad: item.cantidad,
                                precio_unit: item.precio_unit,
                                total: item.subtotal,
                                kilometros: 0,
                                insumos: item.tipo === 'insumo' ? {
                                    create: [{
                                        insumo_id: item.referencia_id,
                                        dosis_por_ha: item.cantidad,
                                        cantidad_pasadas: 1,
                                        precio_unit_usado: item.precio_unit,
                                        moneda_usada: 'ARS',
                                        costo_por_ha: item.subtotal,
                                        costo_total: item.subtotal
                                    }]
                                } : undefined
                            }))
                        }
                    }
                })
            }
            return presupuesto
        })

        revalidatePath('/presupuestos')
        revalidatePath('/ordenes')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating presupuesto status:', error)
        return { success: false, error: 'Failed to update status: ' + error.message }
    }
}

export async function updatePresupuesto(id: string, data: any) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.PRESUPUESTOS, 'update')
        await prisma.$transaction(async (tx) => {
            // 1. Update basic info
            await tx.presupuesto.update({
                where: { id, empresa_id: empresaId },
                data: {
                    cliente_id: data.cliente_id,
                    lote_id: data.lote_id || null,
                    hectareas: data.hectareas || 1,
                    fecha: new Date(data.fecha),
                    valido_hasta: data.valido_hasta ? new Date(data.valido_hasta) : null,
                    total: data.total,
                    total_final: data.total_final || data.total,
                    observaciones: data.observaciones,
                }
            })

            // 2. Replace items (Delete all + Create new)
            // This is safer/easier than diffing for simple line items
            await tx.presupuestoItem.deleteMany({
                where: { presupuesto_id: id }
            })

            if (data.items && data.items.length > 0) {
                await tx.presupuestoItem.createMany({
                    data: data.items.map((item: any) => ({
                        presupuesto_id: id,
                        tipo: item.tipo,
                        referencia_id: item.referencia_id,
                        nombre: item.nombre,
                        unidad: item.unidad,
                        cantidad: item.cantidad,
                        precio_unit: item.precio_unit,
                        subtotal: item.subtotal,
                        detalle: item.detalle || null
                    }))
                })
            }
        })

        revalidatePath('/presupuestos')
        return { success: true }
    } catch (error: any) {
        console.error('Error updating presupuesto:', error)
        return { success: false, error: error.message || 'Failed to update presupuesto' }
    }
}
