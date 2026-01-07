'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"

export async function createEstablecimiento(clienteId: string, nombre: string, modalidad: string = 'PROPIO') {
    if (!nombre.trim()) return { success: false, error: "El nombre es requerido" }

    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.ESTABLECIMIENTOS, 'create')
        const establecimiento = await prisma.establecimiento.create({
            data: {
                empresa_id: empresaId,
                nombre: nombre.trim(),
                cliente_id: clienteId,
                modalidad
            }
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
        await prisma.establecimiento.update({
            where: { id, empresa_id: empresaId },
            data: { deleted_at: new Date() }
        })
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
        const establecimientos = await prisma.establecimiento.findMany({
            where: {
                empresa_id: empresaId,
                deleted_at: null
            },
            include: {
                cliente: {
                    select: { razon_social: true }
                }
            },
            orderBy: { nombre: 'asc' }
        })
        return { success: true, data: establecimientos }
    } catch (error) {
        console.error("Error fetching establecimientos:", error)
        return { success: false, error: "Error al obtener establecimientos" }
    }
}
