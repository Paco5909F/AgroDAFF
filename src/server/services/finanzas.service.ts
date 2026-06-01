import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { format } from 'date-fns'

interface LiquidacionItem {
    id: string
    cantidad_real: number
    precio_unit: number
}

export class FinanzasService {
    // --- FACTURAS ---
    static async getFacturas(empresaId: string) {
        return prisma.factura.findMany({
            where: { empresa_id: empresaId },
            include: {
                orden: { include: { cliente: true } }
            },
            orderBy: { created_at: 'desc' }
        })
    }

    // --- LIQUIDACIONES ---
    static async cerrarOrdenTrabajo(
        orden_id: string,
        data: { cotizacion_usd: number, fecha_cierre: Date, total_final: number, items: LiquidacionItem[], insumos: LiquidacionItem[] }
    ) {
        const orden = await prisma.ordenTrabajo.findUnique({ where: { id: orden_id } })
        if (!orden) throw new Error('Orden no encontrada')

        return prisma.$transaction(async (tx) => {
            // 1. Actualizar Items
            for (const item of data.items) {
                const subtotal = item.cantidad_real * item.precio_unit
                await tx.ordenItem.update({
                    where: { id: item.id },
                    data: {
                        cantidad_real: item.cantidad_real,
                        precio_congelado: item.precio_unit,
                        subtotal_real: subtotal
                    }
                })
            }

            // 2. Actualizar Insumos
            for (const insumo of data.insumos) {
                const subtotal = insumo.cantidad_real * insumo.precio_unit
                await tx.ordenItemInsumo.update({
                    where: { id: insumo.id },
                    data: {
                        cantidad_real: insumo.cantidad_real,
                        precio_congelado: insumo.precio_unit,
                        subtotal_real: subtotal
                    }
                })
            }

            // 3. Cerrar Orden
            await tx.ordenTrabajo.update({
                where: { id: orden_id },
                data: {
                    estado: 'facturada',
                    fecha_cierre: new Date(data.fecha_cierre),
                    cotizacion_usd: data.cotizacion_usd,
                    total_final: data.total_final
                }
            })
        })
    }

    // --- PRESUPUESTOS ---
    static async getPresupuestos(empresaId: string, page: number = 1, limit: number = 10, query?: string) {
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
                include: { cliente: true, lote: true, items: true },
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
            total,
            presupuestos: serializedPresupuestos,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    }

    static async createPresupuesto(empresaId: string, data: any) {
        return prisma.presupuesto.create({
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
    }

    static async deletePresupuesto(id: string, empresaId: string) {
        return prisma.presupuesto.delete({
            where: { id, empresa_id: empresaId }
        })
    }

    static async updatePresupuestoStatus(id: string, empresaId: string, status: string) {
        return prisma.$transaction(async (tx) => {
            const presupuesto = await tx.presupuesto.update({
                where: { id, empresa_id: empresaId },
                data: { estado: status },
                include: { items: true }
            })

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
    }

    static async updatePresupuesto(id: string, empresaId: string, data: any) {
        return prisma.$transaction(async (tx) => {
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
    }
}
