'use server'

import { revalidatePath } from 'next/cache'
import { ProveedorService } from './services/proveedor.service'
import { getUserContextSafe } from './context'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

export async function getProveedoresAction(query?: string) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.PROVEEDORES, PERMISSIONS.READ)

    return ProveedorService.getProveedores(context.empresaId, query)
}

export async function createProveedorAction(data: any) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.PROVEEDORES, PERMISSIONS.CREATE)

    const result = await ProveedorService.createProveedor(context.empresaId, data)
    revalidatePath('/dashboard/proveedores')
    return result
}

export async function updateProveedorAction(id: string, data: any) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.PROVEEDORES, PERMISSIONS.UPDATE)

    const result = await ProveedorService.updateProveedor(id, context.empresaId, data)
    revalidatePath('/dashboard/proveedores')
    return result
}

export async function deleteProveedorAction(id: string) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.PROVEEDORES, PERMISSIONS.DELETE)

    const result = await ProveedorService.deleteProveedor(id, context.empresaId)
    revalidatePath('/dashboard/proveedores')
    return result
}
