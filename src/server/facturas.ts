'use server'

import { prisma } from '@/lib/prisma'
import { getUserContext } from '@/server/context'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'

export async function getFacturas() {
    try {
        const context = await getUserContext()
        checkPermission(context.rol, PERMISSIONS.FACTURACION, 'read')
        
        const facturas = await prisma.factura.findMany({
            where: {
                empresa_id: context.empresaId
            },
            include: {
                orden: {
                    include: {
                        cliente: true
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        })
        
        return { success: true, data: facturas }
    } catch (error: any) {
        console.error("Error fetching facturas:", error)
        return { success: false, error: error.message }
    }
}
