import { prisma } from '@/lib/prisma'

export class CatalogosService {
    // --- INSUMOS ---
    static async getInsumos(empresaId: string) {
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

        return insumos.map(insumo => {
            const { precios, ...rest } = insumo
            return {
                ...rest,
                precio_actual: Number(precios[0]?.precio || 0),
                moneda: precios[0]?.moneda || 'USD'
            }
        })
    }

    static async createInsumo(empresaId: string, data: { nombre: string, tipo: string, unidad_medida: string, precio: number, moneda?: string }) {
        return prisma.$transaction(async (tx) => {
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
    }

    static async appendPrecioInsumo(empresaId: string, insumoId: string, precio: number, moneda: string = 'USD') {
        const insumo = await prisma.insumo.findFirst({
            where: { id: insumoId, empresa_id: empresaId }
        })

        if (!insumo) throw new Error('Insumo no encontrado o es de sistema (no editable)')
        if (insumo.es_global) throw new Error('No se puede modificar precio de un insumo global. Clónelo primero.')

        return prisma.$transaction(async (tx) => {
            await tx.precioInsumo.updateMany({
                where: { insumo_id: insumoId, fecha_hasta: null },
                data: { fecha_hasta: new Date() }
            })

            await tx.precioInsumo.create({
                data: {
                    insumo_id: insumoId,
                    precio,
                    moneda
                }
            })
        })
    }

    static async cloneGlobalInsumo(empresaId: string, globalId: string, customPrice: number = 0) {
        const globalInsumo = await prisma.insumo.findFirst({
            where: { id: globalId, es_global: true }
        })

        if (!globalInsumo) throw new Error('Insumo global no encontrado')

        return prisma.$transaction(async (tx) => {
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
    }

    // --- SERVICIOS ---
    static async getServicios(empresaId: string, query?: string) {
        const servicios = await prisma.servicio.findMany({
            where: {
                active: true,
                empresa_id: empresaId,
                ...(query ? { nombre: { contains: query, mode: 'insensitive' } } : {})
            },
            orderBy: { nombre: 'asc' },
        })

        return servicios.map(s => ({
            ...s,
            precio_base: s.precio_base.toNumber()
        }))
    }

    static async createServicio(empresaId: string, data: { nombre: string, unidad: string, precio: number, moneda?: string }) {
        return prisma.servicio.create({
            data: {
                nombre: data.nombre,
                unidad_medida: data.unidad,
                precio_base: data.precio,
                moneda: data.moneda || 'ARS',
                active: true,
                empresa_id: empresaId
            }
        })
    }

    static async deleteServicio(id: string, empresaId: string) {
        const s = await prisma.servicio.findFirst({ where: { id, empresa_id: empresaId } })
        if (!s) throw new Error('Service not found or unauthorized')

        return prisma.servicio.update({
            where: { id },
            data: { active: false }
        })
    }

    static async updateServicio(id: string, empresaId: string, data: any) {
        const s = await prisma.servicio.findFirst({ where: { id, empresa_id: empresaId } })
        if (!s) throw new Error('Service not found or unauthorized')

        return prisma.servicio.update({
            where: { id },
            data: {
                nombre: data.nombre,
                unidad_medida: data.unidad_medida,
                precio_base: data.precio_base,
                moneda: data.moneda,
            }
        })
    }

    // --- CLIENTES ---
    static async getClientes(empresaId: string, query?: string) {
        const where: any = {
            empresa_id: empresaId,
            deleted_at: null,
        }

        if (query) {
            where.OR = [
                { razon_social: { contains: query, mode: 'insensitive' } },
                { cuit: { contains: query } },
            ]
        }

        return prisma.cliente.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                establecimientos: {
                    where: { deleted_at: null },
                    select: {
                        id: true,
                        nombre: true,
                        modalidad: true
                    }
                }
            }
        })
    }

    static async createCliente(empresaId: string, data: any) {
        // Create client first
        const cliente = await prisma.cliente.create({
            data: {
                empresa_id: empresaId,
                razon_social: data.razon_social,
                cuit: data.cuit,
                condicion_iva: data.condicion_iva,
                email: data.email || null,
                telefono: data.telefono || null,
                persona_contacto: data.persona_contacto || null,
                tipo_cliente: data.tipo_cliente || null,
                localidad: data.localidad || null,
                provincia: data.provincia || null,
                observaciones: data.observaciones || null,
            },
        })

        // If initial establishment provided, create it
        if (data.establecimiento_inicial?.trim()) {
            await prisma.establecimiento.create({
                data: {
                    empresa_id: empresaId,
                    nombre: data.establecimiento_inicial.trim(),
                    cliente_id: cliente.id,
                    modalidad: data.modalidad_inicial
                }
            })
        }
        return cliente
    }

    static async updateCliente(id: string, empresaId: string, data: any) {
        return prisma.cliente.update({
            where: { id, empresa_id: empresaId },
            data: {
                razon_social: data.razon_social,
                cuit: data.cuit,
                condicion_iva: data.condicion_iva,
                email: data.email || null,
                telefono: data.telefono || null,
                persona_contacto: data.persona_contacto || null,
                tipo_cliente: data.tipo_cliente || null,
                localidad: data.localidad || null,
                provincia: data.provincia || null,
                observaciones: data.observaciones || null,
            },
        })
    }

    static async deleteCliente(id: string, empresaId: string) {
        return prisma.cliente.update({
            where: { id, empresa_id: empresaId },
            data: { deleted_at: new Date() },
        })
    }
}
