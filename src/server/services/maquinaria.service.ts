import { prisma } from '@/lib/prisma'

export class MaquinariaService {
    static async getMaquinarias(empresaId: string) {
        return prisma.maquinaria.findMany({
            where: { empresa_id: empresaId },
            orderBy: { nombre: 'asc' }
        })
    }

    static async createMaquinaria(empresaId: string, data: { nombre: string, tipo: string, marca?: string, modelo?: string, patente?: string, horas_motor?: number }) {
        return prisma.maquinaria.create({
            data: {
                empresa_id: empresaId,
                nombre: data.nombre,
                tipo: data.tipo,
                marca: data.marca,
                modelo: data.modelo,
                patente: data.patente,
                horas_motor: data.horas_motor || 0
            }
        })
    }

    static async updateMaquinaria(id: string, empresaId: string, data: any) {
        return prisma.maquinaria.update({
            where: { id, empresa_id: empresaId },
            data: {
                nombre: data.nombre,
                tipo: data.tipo,
                marca: data.marca,
                modelo: data.modelo,
                patente: data.patente,
                estado: data.estado
            }
        })
    }

    static async deleteMaquinaria(id: string, empresaId: string) {
        // Soft delete (estado = BAJA)
        return prisma.maquinaria.update({
            where: { id, empresa_id: empresaId },
            data: { estado: 'BAJA' }
        })
    }

    // --- Mantenimientos ---
    static async registrarMantenimiento(empresaId: string, data: { maquinaria_id: string, fecha: Date, tipo: string, descripcion: string, costo: number, moneda: string, horas_motor?: number, proveedor_id?: string }) {
        // Enforce that machinery belongs to company
        const maq = await prisma.maquinaria.findUnique({ where: { id: data.maquinaria_id } })
        if (!maq || maq.empresa_id !== empresaId) {
            throw new Error("Maquinaria no encontrada o no pertenece a la empresa")
        }

        return prisma.$transaction(async (tx) => {
            const mant = await tx.mantenimiento.create({
                data: {
                    maquinaria_id: data.maquinaria_id,
                    fecha: data.fecha,
                    tipo: data.tipo,
                    descripcion: data.descripcion,
                    costo: data.costo,
                    moneda: data.moneda,
                    horas_motor: data.horas_motor,
                    proveedor_id: data.proveedor_id
                }
            })

            // Update machine hours if the maintenance reports higher hours
            if (data.horas_motor && data.horas_motor > maq.horas_motor.toNumber()) {
                await tx.maquinaria.update({
                    where: { id: data.maquinaria_id },
                    data: { horas_motor: data.horas_motor }
                })
            }

            return mant
        })
    }

    static async updateHorasMotor(id: string, empresaId: string, horas: number) {
        return prisma.maquinaria.update({
            where: { id, empresa_id: empresaId },
            data: { horas_motor: horas }
        })
    }
}
