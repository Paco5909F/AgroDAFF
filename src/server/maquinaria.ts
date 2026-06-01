'use server'

import { revalidatePath } from 'next/cache'
import { MaquinariaService } from './services/maquinaria.service'
import { getUserContextSafe } from './context'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export async function getMaquinariasAction() {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.MAQUINARIA, PERMISSIONS.READ)

    return MaquinariaService.getMaquinarias(context.empresaId)
}

export async function createMaquinariaAction(data: any) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.MAQUINARIA, PERMISSIONS.CREATE)

    const result = await MaquinariaService.createMaquinaria(context.empresaId, data)
    revalidatePath('/dashboard/maquinaria')
    return result
}

export async function registrarMantenimientoAction(data: any) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.MAQUINARIA, PERMISSIONS.UPDATE)

    const result = await MaquinariaService.registrarMantenimiento(context.empresaId, data)
    revalidatePath('/dashboard/maquinaria')
    return result
}

export async function getMantenimientosAction(maquinariaId?: string) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.MAQUINARIA, PERMISSIONS.READ)

    const where: any = { maquinaria: { empresa_id: context.empresaId } }
    if (maquinariaId) {
        where.maquinaria_id = maquinariaId
    }

    return prisma.mantenimiento.findMany({
        where,
        include: { maquinaria: true },
        orderBy: { fecha: 'desc' }
    })
}
