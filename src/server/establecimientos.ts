'use server'

import { revalidatePath } from "next/cache"
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"
import { ProduccionService } from "./services/produccion.service"

export async function createEstablecimiento(clienteId: string, nombre: string, modalidad: string = 'PROPIO') {
    if (!nombre.trim()) return { success: false, error: "El nombre es requerido" }

    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.ESTABLECIMIENTOS, 'create')
        
        const establecimiento = await ProduccionService.createEstablecimiento(empresaId, {
            nombre: nombre.trim(),
            modalidad,
            cliente_id: clienteId
        })
        
        revalidatePath('/clientes')
        return { success: true, data: establecimiento }
    } catch (error) {
        return { success: false, error: "Error al crear establecimiento" }
    }
}

export async function deleteEstablecimiento(id: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.ESTABLECIMIENTOS, 'delete')
        
        await ProduccionService.deleteEstablecimiento(id, empresaId)
        
        revalidatePath('/clientes')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error al eliminar establecimiento" }
    }
}

export async function getAllEstablecimientos() {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.ESTABLECIMIENTOS, 'read')
        
        const establecimientos = await ProduccionService.getEstablecimientos(empresaId)
        return { success: true, data: establecimientos }
    } catch (error) {
        console.error("Error fetching establecimientos:", error)
        return { success: false, error: "Error al obtener establecimientos" }
    }
}
