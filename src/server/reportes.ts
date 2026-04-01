'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getUserContext } from "./context"

export type ReportFilters = {
    from: Date
    to: Date
    clienteId?: string
    campanaId?: string
    estado?: string
}

export async function getReportData(filters: ReportFilters) {
    try {
        const { empresaId } = await getUserContext()
        const where: any = {
            empresa_id: empresaId,
            fecha: {
                gte: filters.from,
                lte: filters.to
            }
        }

        if (filters.clienteId && filters.clienteId !== "all") where.cliente_id = filters.clienteId
        if (filters.campanaId && filters.campanaId !== "all") where.campana_id = filters.campanaId
        if (filters.estado && filters.estado !== "all") where.estado = filters.estado

        const orders = await prisma.ordenTrabajo.findMany({
            where,
            include: {
                cliente: {
                    select: { razon_social: true, cuit: true }
                },
                items: {
                    include: {
                        servicio: {
                            select: { nombre: true, unidad_medida: true }
                        }
                    }
                },

            },
            orderBy: {
                fecha: 'asc'
            }
        })

        return { success: true, data: orders }
    } catch (error) {
        console.error("Error fetching report data:", error)
        return { success: false, error: "Error al generar reporte" }
    }
}

export async function closePeriod(ids: string[]) {
    try {
        const { empresaId } = await getUserContext()
        await prisma.ordenTrabajo.updateMany({
            where: {
                id: { in: ids },
                empresa_id: empresaId
            },
            data: {
                estado: 'facturada' // Using standard status
            }
        })

        revalidatePath('/reportes')
        revalidatePath('/ordenes')
        revalidatePath('/dashboard')

        return { success: true }
    } catch (error) {
        console.error("Error closing period:", error)
        return { success: false, error: "Error al cerrar periodo" }
    }
}
