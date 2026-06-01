'use server'

import { getUserContext } from '@/server/context'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'
import { FinanzasService } from './services/finanzas.service'

export async function getFacturas() {
    try {
        const context = await getUserContext()
        checkPermission(context.rol, PERMISSIONS.FACTURACION, 'read')
        
        const facturas = await FinanzasService.getFacturas(context.empresaId)
        
        return { success: true, data: facturas }
    } catch (error: any) {
        console.error("Error fetching facturas:", error)
        return { success: false, error: error.message }
    }
}
