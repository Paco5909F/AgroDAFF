import { prisma } from '@/lib/prisma'

export class ProduccionService {
    // --- LOTES ---
    static async getLotes(empresaId: string, query?: string) {
        return prisma.lote.findMany({
            where: {
                empresa_id: empresaId,
                deleted_at: null,
                ...(query ? { nombre: { contains: query, mode: 'insensitive' } } : {})
            },
            include: {
                establecimiento: {
                    include: { cliente: true }
                }
            },
            orderBy: { created_at: 'desc' }
        })
    }

    static async createLote(empresaId: string, data: any) {
        return prisma.lote.create({
            data: {
                nombre: data.nombre,
                hectareas: data.hectareas,
                establecimiento_id: data.establecimiento_id,
                empresa_id: empresaId
            }
        })
    }

    static async updateLote(id: string, empresaId: string, data: any) {
        return prisma.lote.update({
            where: { id, empresa_id: empresaId },
            data: {
                nombre: data.nombre,
                hectareas: data.hectareas,
                establecimiento_id: data.establecimiento_id
            }
        })
    }

    static async deleteLote(id: string, empresaId: string) {
        return prisma.lote.update({
            where: { id, empresa_id: empresaId },
            data: { deleted_at: new Date() }
        })
    }

    // --- ESTABLECIMIENTOS ---
    static async getEstablecimientos(empresaId: string) {
        return prisma.establecimiento.findMany({
            where: {
                empresa_id: empresaId,
                deleted_at: null
            },
            include: {
                cliente: true,
                _count: {
                    select: { lotes: { where: { deleted_at: null } } }
                }
            },
            orderBy: { nombre: 'asc' }
        })
    }

    static async createEstablecimiento(empresaId: string, data: any) {
        return prisma.establecimiento.create({
            data: {
                nombre: data.nombre,
                modalidad: data.modalidad,
                cliente_id: data.cliente_id,
                empresa_id: empresaId
            }
        })
    }

    static async updateEstablecimiento(id: string, empresaId: string, data: any) {
        return prisma.establecimiento.update({
            where: { id, empresa_id: empresaId },
            data: {
                nombre: data.nombre,
                modalidad: data.modalidad,
                cliente_id: data.cliente_id
            }
        })
    }

    static async deleteEstablecimiento(id: string, empresaId: string) {
        return prisma.establecimiento.update({
            where: { id, empresa_id: empresaId },
            data: { deleted_at: new Date() }
        })
    }
}
