'use server'

import { prisma } from "@/lib/prisma"
import { startOfMonth, endOfMonth } from "date-fns"
import { getCompanyId } from "@/server/context"
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"

export async function getDashboardStats(userId?: string) {
    const now = new Date()
    const firstDay = startOfMonth(now)
    const lastDay = endOfMonth(now)

    // Base filter for user-specific queries
    const { empresaId, rol } = await getUserContext()
    checkPermission(rol, PERMISSIONS.DASHBOARD, 'read')
    const userFilter = userId ? { created_by: userId } : {}
    const companyFilter = { empresa_id: empresaId }

    // 1. Trabajos del mes
    const trabajosMes = await prisma.ordenTrabajo.count({
        where: {
            fecha: {
                gte: firstDay,
                lte: lastDay,
            },
            ...companyFilter,
            ...userFilter // Spread user filter if present
        }
    })

    // 2. Facturación (Real vs Estimada)
    const facturacionReal = await prisma.ordenTrabajo.aggregate({
        _sum: { total: true },
        where: {
            fecha: { gte: firstDay, lte: lastDay },
            estado: { in: ['completada', 'facturada'] }, // Lowercase per Prisma Enum
            ...companyFilter,
            ...userFilter
        }
    })

    const facturacionEstimada = await prisma.ordenTrabajo.aggregate({
        _sum: { total: true },
        where: {
            fecha: { gte: firstDay, lte: lastDay },
            estado: { notIn: ['completada', 'facturada'] }, // Pending
            ...companyFilter,
            ...userFilter
        }
    })

    // 3. Clientes Activos (ALWAYS GLOBAL - as per strategy)
    const clientesActivos = await prisma.cliente.count({
        where: {
            deleted_at: null,
            ...companyFilter
        }
    })

    // 4. Recent Activity (Last 5 orders)
    const recentActivityRaw = await prisma.ordenTrabajo.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        where: {
            ...companyFilter,
            ...userFilter
        },
        include: {
            cliente: { select: { razon_social: true } },
            items: {
                include: {
                    servicio: { select: { nombre: true } }
                }
            }
        }
    })

    const recentActivity = recentActivityRaw.map(acc => ({
        ...acc,
        // Serialize dates to prevent RSC issues
        fecha: acc.fecha.toISOString(),
        created_at: acc.created_at.toISOString(),
        updated_at: acc.updated_at.toISOString(),
        servicio: {
            nombre: acc.items.length > 1
                ? `Varios (${acc.items.length})`
                : acc.items[0]?.servicio?.nombre || "Sin servicio"
        }
    }))

    // 5. Monthly Revenue for the Grid Chart (Current Year)
    const startOfYearDate = new Date(now.getFullYear(), 0, 1)
    const yearlyOrders = await prisma.ordenTrabajo.findMany({
        where: {
            fecha: {
                gte: startOfYearDate,
                lte: lastDay
            },
            ...companyFilter,
            ...userFilter
        },
        select: {
            fecha: true,
            total: true
        }
    })

    // Group by month
    const monthlyRevenue = Array.from({ length: 12 }, (_, i) => {
        const monthName = new Date(0, i).toLocaleString('es-AR', { month: 'short' })
        // Capitalize first letter
        const name = monthName.charAt(0).toUpperCase() + monthName.slice(1)
        return { name, total: 0, monthIndex: i }
    })

    yearlyOrders.forEach(order => {
        const month = order.fecha.getMonth()
        if (month >= 0 && month < 12) {
            monthlyRevenue[month].total += Number(order.total)
        }
    })

    // 6. Active Campaign
    let activeCampaign = null
    try {
        const campaign = await prisma.campana.findFirst({
            where: {
                activa: true,
                OR: [
                    companyFilter,
                    { empresa_id: null } // Fallback for legacy campaigns
                ]
            }
        })
        if (campaign) {
            activeCampaign = {
                ...campaign,
                fecha_inicio: campaign.fecha_inicio.toISOString(),
                fecha_fin: campaign.fecha_fin.toISOString(),
                created_at: campaign.created_at.toISOString()
            }
        }
    } catch (error) {
        console.warn("Could not fetch active campaign (DB sync pending?):", error)
    }

    return {
        trabajosMes,
        facturacionMes: facturacionReal._sum?.total ? Number(facturacionReal._sum.total) : 0,
        facturacionPendiente: facturacionEstimada._sum?.total ? Number(facturacionEstimada._sum.total) : 0,
        clientesActivos,
        recentActivity, // Serialized
        monthlyRevenue,
        activeCampaign // Serialized
    }
}
