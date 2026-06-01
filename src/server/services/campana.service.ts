import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export class CampanaService {
    /**
     * Gets all campanas for a specific company
     */
    static async findAll(empresaId: string | null) {
        return prisma.campana.findMany({
            where: {
                OR: [
                    { empresa_id: empresaId },
                    { empresa_id: null }
                ]
            },
            orderBy: {
                fecha_inicio: 'desc'
            }
        })
    }

    /**
     * Gets a single campana by ID, validating company access
     */
    static async findById(id: string, empresaId: string | null) {
        return prisma.campana.findFirst({
            where: {
                id,
                OR: [
                    { empresa_id: empresaId },
                    { empresa_id: null }
                ]
            }
        })
    }

    /**
     * Gets the currently active campana
     */
    static async findActive(empresaId: string | null) {
        return prisma.campana.findFirst({
            where: {
                activa: true,
                OR: [
                    { empresa_id: empresaId },
                    { empresa_id: null }
                ]
            }
        })
    }

    /**
     * Creates a new campana
     */
    static async create(data: {
        nombre: string
        fecha_inicio: Date
        fecha_fin: Date
        activa: boolean
        tipo: string
        ciclo?: string
        empresa_id: string | null
    }) {
        return prisma.$transaction(async (tx) => {
            if (data.activa) {
                await tx.campana.updateMany({
                    where: {
                        activa: true,
                        OR: [
                            { empresa_id: data.empresa_id },
                            { empresa_id: null }
                        ]
                    },
                    data: { activa: false }
                })
            }

            return tx.campana.create({
                data
            })
        })
    }

    /**
     * Updates an existing campana
     */
    static async update(id: string, empresaId: string | null, data: {
        nombre: string
        fecha_inicio: Date
        fecha_fin: Date
        activa: boolean
        tipo: string
        ciclo?: string
    }) {
        return prisma.$transaction(async (tx) => {
            if (data.activa) {
                await tx.campana.updateMany({
                    where: {
                        activa: true,
                        id: { not: id },
                        OR: [
                            { empresa_id: empresaId },
                            { empresa_id: null }
                        ]
                    },
                    data: { activa: false }
                })
            }

            const result = await tx.campana.updateMany({
                where: { 
                    id,
                    OR: [
                        { empresa_id: empresaId },
                        { empresa_id: null }
                    ]
                },
                data
            })
            
            return result.count > 0
        })
    }

    /**
     * Toggles a campana to be the active one
     */
    static async setAsActive(id: string, empresaId: string | null) {
        return prisma.$transaction(async (tx) => {
            await tx.campana.updateMany({
                where: {
                    activa: true,
                    OR: [
                        { empresa_id: empresaId },
                        { empresa_id: null }
                    ]
                },
                data: { activa: false }
            })

            const result = await tx.campana.updateMany({
                where: { 
                    id,
                    OR: [
                        { empresa_id: empresaId },
                        { empresa_id: null }
                    ]
                },
                data: { activa: true }
            })

            return result.count > 0
        })
    }

    /**
     * Deletes a campana
     */
    static async delete(id: string, empresaId: string | null) {
        const result = await prisma.campana.deleteMany({
            where: { 
                id,
                empresa_id: empresaId
            }
        })
        return result.count > 0
    }
}
