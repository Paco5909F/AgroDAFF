'use server'

import { clienteSchema, ClienteFormValues } from "@/lib/validations/cliente"
import { revalidatePath } from "next/cache"
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"
import { checkPlanLimits } from "@/server/billing-limits"
import { CatalogosService } from "./services/catalogos.service"

export async function getClientes(query?: string) {
    const { empresaId, rol } = await getUserContext()
    checkPermission(rol, PERMISSIONS.CLIENTES, 'read')
    return CatalogosService.getClientes(empresaId, query)
}

export async function createCliente(data: ClienteFormValues) {
    const validated = clienteSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten() }
    }

    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CLIENTES, 'create')

        const limitCheck = await checkPlanLimits(empresaId, 'CLIENTE')
        if (!limitCheck.allowed) {
            return { success: false, error: limitCheck.message }
        }
        
        await CatalogosService.createCliente(empresaId, validated.data)

        revalidatePath('/clientes')
        return { success: true }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: "El CUIT ya existe en el sistema." }
        }
        return { success: false, error: "Error al crear cliente" }
    }
}

export async function updateCliente(id: string, data: ClienteFormValues) {
    const validated = clienteSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten() }
    }

    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CLIENTES, 'update')

        const { establecimiento_inicial, modalidad_inicial, ...dbData } = validated.data

        await CatalogosService.updateCliente(id, empresaId, dbData)
        
        revalidatePath('/clientes')
        return { success: true }
    } catch (error) {
        console.error("Error updating cliente:", error)
        return { success: false, error: "Error al actualizar cliente" }
    }
}

export async function deleteCliente(id: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CLIENTES, 'delete')

        await CatalogosService.deleteCliente(id, empresaId)
        
        revalidatePath('/clientes')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error al eliminar cliente" }
    }
}
