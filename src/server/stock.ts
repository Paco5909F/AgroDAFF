'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"

export type MovimientoStock = {
    id: string
    fecha: Date
    tipo: string
    producto: string
    cantidad: number
    lote_id?: string | null
    silo_id?: string | null
    created_at: Date
    lote?: { nombre: string }
    silo?: { nombre: string }
}

export type CreateMovimientoInput = {
    fecha: string | Date
    tipo: 'INGRESO' | 'EGRESO'
    producto: string
    cantidad: number
    lote_id?: string
    silo_id?: string
    observaciones?: string
}

export async function createMovimiento(data: CreateMovimientoInput) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.MOVIMIENTOS, 'create')

        await prisma.$transaction(async (tx) => {
            // 1. Create the movement
            await tx.movimientoStock.create({
                data: {
                    empresa_id: empresaId,
                    fecha: new Date(data.fecha),
                    tipo: data.tipo,
                    producto: data.producto,
                    cantidad: data.cantidad,
                    lote_id: data.lote_id || null,
                    silo_id: data.silo_id || null,
                    observaciones: data.observaciones
                }
            })

            // 2. Update Silo Stock if silo_id is present
            if (data.silo_id) {
                const adjustment = data.tipo === 'INGRESO' ? data.cantidad : -data.cantidad
                await tx.silo.update({
                    where: { id: data.silo_id, empresa_id: empresaId },
                    data: {
                        stock_actual: { increment: adjustment }
                    }
                })
            }
        })

        revalidatePath('/silos')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error('Error creating movimiento:', error)
        return { success: false, error: 'Error al registrar movimiento' }
    }
}

export async function getMovimientosBySilo(siloId: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.MOVIMIENTOS, 'read')
        const movimientos = await prisma.movimientoStock.findMany({
            where: { silo_id: siloId, empresa_id: empresaId },
            orderBy: { fecha: 'desc' },
            include: {
                lote: { select: { nombre: true } }
            }
        })

        const serialized = movimientos.map(m => ({
            ...m,
            cantidad: Number(m.cantidad)
        }))

        return { success: true, data: serialized }
    } catch (error) {
        return { success: false, error: 'Error fetching history' }
    }
}

// Calculate global stock by product
// Calculate global stock by product from Silo Snapshots
export async function getAggregatedStock() {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.SILOS, 'read')
        const silos = await prisma.silo.findMany({
            where: { active: true, empresa_id: empresaId }
        })

        const stockByProduct: Record<string, number> = {}

        silos.forEach(s => {
            // Use 'grano' from Silo as the product key. 
            // Fallback to 'Sin Clasificar' if grano is null but stock > 0 (should rarely happen if validated)
            if (Number(s.stock_actual) > 0) {
                const prod = s.grano || 'Cereal'
                stockByProduct[prod] = (stockByProduct[prod] || 0) + Number(s.stock_actual)
            }
        })

        return { success: true, data: stockByProduct }
    } catch (error) {
        console.error("Error calculating stock:", error)
        return { success: false, error: 'Error calculating aggregated stock' }
    }
}
