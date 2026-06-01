import { prisma } from '@/lib/prisma'

export class StockService {
    // --- SILOS ---
    static async getSilos(empresaId: string) {
        const silos = await prisma.silo.findMany({
            where: { active: true, empresa_id: empresaId },
            orderBy: { created_at: 'desc' },
            include: {
                establecimiento: { select: { nombre: true } },
                campana: { select: { nombre: true } }
            }
        })
        return silos.map(s => ({
            ...s,
            capacidad_max: Number(s.capacidad_max),
            stock_actual: Number(s.stock_actual),
            humedad: s.humedad ? Number(s.humedad) : null,
        }))
    }

    static async createSilo(empresaId: string, data: any) {
        return prisma.silo.create({
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
    }

    static async updateSilo(id: string, empresaId: string, data: any) {
        return prisma.silo.update({
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
    }

    static async deleteSilo(id: string, empresaId: string) {
        return prisma.silo.update({
            where: { id, empresa_id: empresaId },
            data: { active: false }
        })
    }

    // --- MOVIMIENTOS ---
    static async createMovimiento(empresaId: string, data: any) {
        if (data.tipo === 'INGRESO' && !data.lote_id && (!data.observaciones || data.observaciones.trim() === '')) {
            throw new Error('Para ingresos, se debe especificar el Lote de origen o detallar procedencia en observaciones para mantener la trazabilidad.')
        }

        return prisma.$transaction(async (tx) => {
            const mov = await tx.movimientoStock.create({
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

            if (data.silo_id) {
                const adjustment = data.tipo === 'INGRESO' ? data.cantidad : -data.cantidad
                await tx.silo.update({
                    where: { id: data.silo_id, empresa_id: empresaId },
                    data: { stock_actual: { increment: adjustment } }
                })
            }
            return mov
        })
    }

    static async getMovimientosBySilo(siloId: string, empresaId: string) {
        const movimientos = await prisma.movimientoStock.findMany({
            where: { silo_id: siloId, empresa_id: empresaId },
            orderBy: { fecha: 'desc' },
            include: { lote: { select: { nombre: true } } }
        })

        return movimientos.map(m => ({
            ...m,
            cantidad: Number(m.cantidad)
        }))
    }

    static async getAggregatedStock(empresaId: string) {
        const silos = await prisma.silo.findMany({
            where: { active: true, empresa_id: empresaId }
        })

        const stockByProduct: Record<string, number> = {}

        silos.forEach(s => {
            if (Number(s.stock_actual) > 0) {
                const prod = s.grano || 'Cereal'
                stockByProduct[prod] = (stockByProduct[prod] || 0) + Number(s.stock_actual)
            }
        })

        return stockByProduct
    }
}
