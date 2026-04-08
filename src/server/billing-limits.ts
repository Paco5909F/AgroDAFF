import { prisma } from "@/lib/prisma"

const PLAN_LIMITS = {
    FREE: {
        maxUsers: 2,
        maxLotes: 5,
        maxOrdenes: 5,
        maxClientes: 15
    },
    PRO: {
        maxUsers: 9999,
        maxLotes: 9999,
        maxOrdenes: 9999,
        maxClientes: 9999
    }
}

export type ResourceType = 'USER' | 'LOTE' | 'ORDEN' | 'CLIENTE'

export async function checkPlanLimits(
    empresaId: string, 
    resource: ResourceType
): Promise<{ allowed: boolean; message?: string }> {
    try {
        const empresa = await prisma.empresa.findUnique({
            where: { id: empresaId },
            select: { plan_status: true, is_lifetime: true }
        })

        if (!empresa) return { allowed: false, message: "Empresa no encontrada" }

        // "Amigos AgroDAFF" bypass (LIFETIME)
        if (empresa.is_lifetime) return { allowed: true }

        // Block PAST_DUE
        if (empresa.plan_status === 'PAST_DUE') {
            return { allowed: false, message: "Tu suscripción está vencida. Actualiza tu método de pago." }
        }

        const isPro = empresa.plan_status === 'PRO'
        const limits = isPro ? PLAN_LIMITS.PRO : PLAN_LIMITS.FREE

        if (isPro) return { allowed: true } // Pro practically unlimited

        // Count current resource for FREE tier checking
        let count = 0
        switch (resource) {
            case 'USER':
                count = await prisma.miembro.count({ where: { empresa_id: empresaId } })
                if (count >= limits.maxUsers) return { allowed: false, message: `Límite de usuarios (${limits.maxUsers}) alcanzado en plan FREE. Actualiza a PRO.` }
                break
            case 'LOTE':
                count = await prisma.lote.count({ where: { empresa_id: empresaId, deleted_at: null } })
                if (count >= limits.maxLotes) return { allowed: false, message: `Límite de lotes (${limits.maxLotes}) alcanzado en plan FREE. Actualiza a PRO.` }
                break
            case 'ORDEN':
                count = await prisma.ordenTrabajo.count({ where: { empresa_id: empresaId } })
                if (count >= limits.maxOrdenes) return { allowed: false, message: `Límite de órdenes (${limits.maxOrdenes}) alcanzado en plan FREE. Actualiza a PRO.` }
                break
            case 'CLIENTE':
                count = await prisma.cliente.count({ where: { empresa_id: empresaId, deleted_at: null } })
                if (count >= limits.maxClientes) return { allowed: false, message: `Límite de clientes (${limits.maxClientes}) alcanzado en plan FREE. Actualiza a PRO.` }
                break
        }

        return { allowed: true }
    } catch (e) {
        console.error("Error checking plan limits:", e)
        return { allowed: false, message: "Error crítico al validar la suscripción." }
    }
}
