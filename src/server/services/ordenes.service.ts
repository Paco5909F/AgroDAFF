import { prisma } from "@/lib/prisma"

export interface CalculateCostParams {
    dosis_por_ha: number
    cantidad_pasadas: number
    hectareas: number
    precio_unitario: number
    interes_mensual?: number
    meses_financiacion?: number
}

export class OrdenesService {
    // --- ORDENES ---
    static async getOrdenes(empresaId: string, page: number = 1, limit: number = 10, query?: string) {
        const whereClause: any = { empresa_id: empresaId }

        if (query) {
            whereClause.OR = [
                { cliente: { razon_social: { contains: query, mode: 'insensitive' as const } } },
                { items: { some: { servicio: { nombre: { contains: query, mode: 'insensitive' as const } } } } }
            ]
        }

        const [total, ordenes] = await prisma.$transaction([
            prisma.ordenTrabajo.count({ where: whereClause }),
            prisma.ordenTrabajo.findMany({
                where: whereClause,
                take: limit,
                skip: (page - 1) * limit,
                orderBy: { created_at: 'desc' },
                include: {
                    cliente: { select: { razon_social: true, cuit: true } },
                    items: {
                        include: {
                            servicio: { select: { nombre: true, unidad_medida: true } },
                            insumos: {
                                include: {
                                    insumo: { select: { nombre: true, unidad_medida: true, tipo: true } }
                                }
                            }
                        }
                    }
                }
            })
        ])

        const totalPages = Math.ceil(total / limit)

        return {
            total,
            ordenes,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    }

    static async createOrden(empresaId: string, userId: string | undefined, data: any) {
        const activeCampana = await prisma.campana.findFirst({
            where: { activa: true, empresa_id: empresaId }
        })

        return prisma.ordenTrabajo.create({
            data: {
                fecha: data.fecha,
                observaciones: data.observaciones,
                moneda: data.moneda,
                total: data.total,
                cliente_id: data.cliente_id,
                empresa_id: empresaId,
                created_by: userId,
                items: {
                    create: data.items.map((item: any) => ({
                        servicio_id: item.servicio_id,
                        cantidad: item.cantidad,
                        precio_unit: item.precio_unit,
                        total: item.total,
                        kilometros: item.kilometros,
                        observaciones: item.observaciones,
                        lote_id: item.lote_id || undefined,
                        campana_id: item.campana_id || activeCampana?.id || undefined,
                        
                        // Campos de Albor Campo
                        es_tercerizado: item.es_tercerizado || false,
                        proveedor_id: item.proveedor_id || undefined,
                        costo_tercerizado: item.costo_tercerizado || undefined,
                        
                        receta_agronomica_nro: item.receta_agronomica_nro || undefined,
                        temperatura_c: item.temperatura_c || undefined,
                        humedad_pct: item.humedad_pct || undefined,
                        viento_vel_kmh: item.viento_vel_kmh || undefined,
                        viento_direccion: item.viento_direccion || undefined
                    }))
                }
            }
        })
    }

    static async updateOrden(id: string, empresaId: string, data: any) {
        return prisma.$transaction(async (tx) => {
            await tx.ordenItem.deleteMany({ where: { orden_id: id } })
            return tx.ordenTrabajo.update({
                where: { id, empresa_id: empresaId },
                data: {
                    fecha: new Date(data.fecha),
                    cliente_id: data.cliente_id,
                    observaciones: data.observaciones,
                    moneda: data.moneda,
                    total: data.total,
                    items: {
                        create: data.items.map((item: any) => ({
                            servicio_id: item.servicio_id,
                            cantidad: item.cantidad,
                            precio_unit: item.precio_unit,
                            kilometros: item.kilometros,
                            total: item.total,
                            observaciones: item.observaciones,
                            lote_id: item.lote_id || undefined,
                            campana_id: item.campana_id || undefined,
                            
                            // Campos de Albor Campo
                            es_tercerizado: item.es_tercerizado || false,
                            proveedor_id: item.proveedor_id || undefined,
                            costo_tercerizado: item.costo_tercerizado || undefined,
                            
                            receta_agronomica_nro: item.receta_agronomica_nro || undefined,
                            temperatura_c: item.temperatura_c || undefined,
                            humedad_pct: item.humedad_pct || undefined,
                            viento_vel_kmh: item.viento_vel_kmh || undefined,
                            viento_direccion: item.viento_direccion || undefined
                        }))
                    }
                }
            })
        })
    }

    static async deleteOrden(id: string, empresaId: string) {
        const existingFactura = await prisma.factura.findUnique({
            where: { orden_trabajo_id: id }
        })

        if (existingFactura) {
            await prisma.factura.delete({ where: { id: existingFactura.id } })
        }

        return prisma.ordenTrabajo.delete({
            where: { id, empresa_id: empresaId }
        })
    }

    static async completeOrden(id: string, empresaId: string, cotizacionUsd: number) {
        return prisma.$transaction(async (tx) => {
            const orden = await tx.ordenTrabajo.findUnique({
                where: { id, empresa_id: empresaId },
                include: { items: true }
            })

            if (!orden) throw new Error('Orden no encontrada')

            await tx.ordenTrabajo.update({
                where: { id },
                data: {
                    estado: 'completada',
                    cotizacion_usd: cotizacionUsd,
                    fecha_cierre: new Date()
                }
            })

            for (const item of orden.items) {
                await tx.ordenItem.update({
                    where: { id: item.id },
                    data: {
                        subtotal_real: item.total,
                        cantidad_real: item.cantidad,
                        precio_congelado: item.precio_unit
                    }
                })
            }
            return orden
        })
    }

    // --- INSUMOS DE ORDEN ---
    static calculateInsumoCost(data: CalculateCostParams) {
        const { dosis_por_ha, precio_unitario, cantidad_pasadas, hectareas, interes_mensual, meses_financiacion } = data

        const costo_por_ha = dosis_por_ha * precio_unitario * cantidad_pasadas
        const costo_total = costo_por_ha * hectareas

        let costo_total_financiado = null
        if (interes_mensual && meses_financiacion && interes_mensual > 0 && meses_financiacion > 0) {
            const interes_dec = interes_mensual / 100
            costo_total_financiado = costo_total * (1 + (interes_dec * meses_financiacion))
        }

        return { costo_por_ha, costo_total, costo_total_financiado }
    }

    static async addInsumoToOrdenItem(empresaId: string, data: any) {
        const ordenItem = await prisma.ordenItem.findFirst({
            where: { id: data.orden_item_id, orden: { empresa_id: empresaId } },
            include: { lote: true }
        })

        if (!ordenItem) throw new Error('Ítem de orden no encontrado')

        const hectareas = Number(ordenItem.cantidad) || Number(ordenItem.lote?.hectareas) || 1
        if (hectareas <= 0 || data.dosis_por_ha <= 0) throw new Error('Hectáreas y Dosis deben ser mayores a 0')

        const insumo = await prisma.insumo.findFirst({
            where: { id: data.insumo_id, empresa_id: empresaId },
            include: {
                precios: {
                    where: { fecha_hasta: null },
                    orderBy: { fecha_desde: 'desc' },
                    take: 1
                }
            }
        })

        if (!insumo || insumo.precios.length === 0) throw new Error('Insumo no encontrado o sin precio configurado')

        const currentPrice = Number(insumo.precios[0].precio)
        const moneda = insumo.precios[0].moneda

        const calcResult = OrdenesService.calculateInsumoCost({
            dosis_por_ha: data.dosis_por_ha,
            cantidad_pasadas: data.cantidad_pasadas,
            hectareas: hectareas,
            precio_unitario: currentPrice,
            interes_mensual: data.interes_mensual,
            meses_financiacion: data.meses_financiacion
        })

        return prisma.ordenItemInsumo.create({
            data: {
                orden_item_id: data.orden_item_id,
                insumo_id: data.insumo_id,
                dosis_por_ha: data.dosis_por_ha,
                cantidad_pasadas: data.cantidad_pasadas,
                precio_unit_usado: currentPrice,
                moneda_usada: moneda,
                costo_por_ha: calcResult.costo_por_ha,
                costo_total: calcResult.costo_total,
                interes_mensual: data.interes_mensual,
                meses_financiacion: data.meses_financiacion,
                costo_total_financiado: calcResult.costo_total_financiado
            }
        })
    }

    static async deleteOrdenItemInsumo(id: string, empresaId: string) {
        const target = await prisma.ordenItemInsumo.findFirst({
            where: { id, orden_item: { orden: { empresa_id: empresaId } } }
        })

        if (!target) throw new Error('Insumo de orden no encontrado')

        return prisma.ordenItemInsumo.delete({ where: { id } })
    }
}
