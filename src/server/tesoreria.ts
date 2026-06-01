'use server'

import { revalidatePath } from 'next/cache'
import { TesoreriaService } from './services/tesoreria.service'
import { getUserContextSafe } from './context'
import { checkPermission, PERMISSIONS } from '@/lib/permissions'
import { prisma } from '@/lib/prisma'

export async function getCuentasBancariasAction() {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.TESORERIA, PERMISSIONS.READ)

    return TesoreriaService.getCuentasBancarias(context.empresaId)
}

export async function createCuentaBancariaAction(data: { nombre: string, tipo: string, moneda: string, cbu?: string, alias?: string }) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.TESORERIA, PERMISSIONS.CREATE)

    const result = await TesoreriaService.createCuentaBancaria(context.empresaId, data)
    revalidatePath('/dashboard/tesoreria')
    return result
}

export async function registrarPagoProveedorAction(data: { cuenta_bancaria_id: string, proveedor_id: string, monto: number, concepto: string, fecha: Date }) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.TESORERIA, PERMISSIONS.CREATE)

    const result = await TesoreriaService.registrarPagoProveedor(context.empresaId, data)
    revalidatePath('/dashboard/tesoreria')
    return result
}

export async function registrarCobroFacturaAction(data: { cuenta_bancaria_id: string, monto: number, concepto: string, fecha: Date }) {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.TESORERIA, PERMISSIONS.CREATE)

    const result = await TesoreriaService.registrarCobroFactura(context.empresaId, data)
    revalidatePath('/dashboard/tesoreria')
    return result
}

export async function getMovimientosAction() {
    const context = await getUserContextSafe()
    if (!context) throw new Error("No autenticado")
    checkPermission(context.rol, PERMISSIONS.TESORERIA, PERMISSIONS.READ)

    return prisma.movimientoTesoreria.findMany({
        where: { cuenta: { empresa_id: context.empresaId } },
        include: { cuenta: true, proveedor: true },
        orderBy: { fecha: 'desc' },
        take: 100
    })
}
