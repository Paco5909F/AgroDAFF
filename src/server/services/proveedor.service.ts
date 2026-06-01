import { prisma } from '@/lib/prisma'

export class ProveedorService {
    static async getProveedores(empresaId: string, query?: string) {
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

        return prisma.proveedor.findMany({
            where,
            orderBy: { razon_social: 'asc' },
        })
    }

    static async createProveedor(empresaId: string, data: any) {
        return prisma.proveedor.create({
            data: {
                empresa_id: empresaId,
                razon_social: data.razon_social,
                cuit: data.cuit,
                condicion_iva: data.condicion_iva,
                email: data.email || null,
                telefono: data.telefono || null,
                observaciones: data.observaciones || null,
            },
        })
    }

    static async updateProveedor(id: string, empresaId: string, data: any) {
        return prisma.proveedor.update({
            where: { id, empresa_id: empresaId },
            data: {
                razon_social: data.razon_social,
                cuit: data.cuit,
                condicion_iva: data.condicion_iva,
                email: data.email || null,
                telefono: data.telefono || null,
                observaciones: data.observaciones || null,
            },
        })
    }

    static async deleteProveedor(id: string, empresaId: string) {
        return prisma.proveedor.update({
            where: { id, empresa_id: empresaId },
            data: { deleted_at: new Date() },
        })
    }
}
