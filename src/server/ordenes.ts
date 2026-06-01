'use server'

import { ordenSchema, OrdenFormValues } from "@/lib/validations/orden"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { checkPlanLimits } from "@/server/billing-limits"
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"
import { OrdenesService } from "./services/ordenes.service"

export async function getOrdenes(page: number = 1, limit: number = 10, query?: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.ORDENES, 'read')
        
        const result = await OrdenesService.getOrdenes(empresaId, page, limit, query)

        return {
            success: true,
            data: result.ordenes,
            meta: {
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                hasNextPage: result.hasNextPage,
                hasPrevPage: result.hasPrevPage
            }
        }
    } catch (error) {
        console.error("Error fetching ordenes:", error)
        return { success: false, data: [] }
    }
}

export async function createOrden(data: OrdenFormValues) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const validated = ordenSchema.safeParse(data)
    if (!validated.success) {
        console.error("Validation error:", validated.error.flatten())
        return { success: false, error: validated.error.flatten() }
    }

    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.ORDENES, 'create')

        const limitCheck = await checkPlanLimits(empresaId, 'ORDEN')
        if (!limitCheck.allowed) {
            return { success: false, error: limitCheck.message }
        }

        await OrdenesService.createOrden(empresaId, user?.id, validated.data)
        
        revalidatePath('/ordenes')
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false, error: "Error al crear orden" }
    }
}

export async function updateOrden(id: string, data: OrdenFormValues) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.ORDENES, 'update')

        await OrdenesService.updateOrden(id, empresaId, data)

        revalidatePath('/ordenes')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Error updating orden:", error)
        return { success: false, error: "Failed to update orden" }
    }
}

export async function deleteOrden(id: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.ORDENES, 'delete')

        await OrdenesService.deleteOrden(id, empresaId)
        
        revalidatePath('/ordenes')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error) {
        console.error("Error deleting orden:", error)
        return { success: false, error: "Error al eliminar la orden" }
    }
}

export async function completeOrden(id: string, cotizacionUsd: number) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.ORDENES, 'update')

        await OrdenesService.completeOrden(id, empresaId, cotizacionUsd)

        revalidatePath('/ordenes')
        revalidatePath('/dashboard')
        return { success: true }
    } catch (error: any) {
        console.error("Error completing orden:", error)
        return { success: false, error: error.message || "Error al completar la orden" }
    }
}
