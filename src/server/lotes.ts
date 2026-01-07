'use server'

import { prisma } from '@/lib/prisma'
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"

export async function getLotes() {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.LOTES, 'read')
        const lotes = await prisma.lote.findMany({
            where: { empresa_id: empresaId },
            include: {
                establecimiento: {
                    select: { nombre: true }
                }
            },
            orderBy: { nombre: 'asc' }
        })

        const serialized = lotes.map(l => ({
            ...l,
            hectareas: Number(l.hectareas)
        }))

        return { success: true, data: serialized }
    } catch (error) {
        console.error('Error fetching lotes:', error)
        return { success: false, error: 'Error al obtener lotes' }
    }
}
