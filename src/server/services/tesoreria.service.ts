import { prisma } from '@/lib/prisma'

export class TesoreriaService {
    // --- Cuentas Bancarias ---
    static async getCuentasBancarias(empresaId: string) {
        return prisma.cuentaBancaria.findMany({
            where: { empresa_id: empresaId, active: true },
            orderBy: { nombre: 'asc' }
        })
    }

    static async createCuentaBancaria(empresaId: string, data: { nombre: string, tipo: string, moneda: string, cbu?: string, alias?: string }) {
        return prisma.cuentaBancaria.create({
            data: {
                empresa_id: empresaId,
                nombre: data.nombre,
                tipo: data.tipo,
                moneda: data.moneda,
                cbu: data.cbu,
                alias: data.alias
            }
        })
    }

    // --- Movimientos / Pagos ---
    static async registrarPagoProveedor(empresaId: string, data: { cuenta_bancaria_id: string, proveedor_id: string, monto: number, concepto: string, fecha: Date }) {
        // Enforce that account belongs to empresa
        const cuenta = await prisma.cuentaBancaria.findUnique({ where: { id: data.cuenta_bancaria_id } })
        if (!cuenta || cuenta.empresa_id !== empresaId) {
            throw new Error("Cuenta bancaria no encontrada o no pertenece a la empresa")
        }

        return prisma.$transaction(async (tx) => {
            const mov = await tx.movimientoTesoreria.create({
                data: {
                    cuenta_bancaria_id: data.cuenta_bancaria_id,
                    fecha: data.fecha,
                    tipo: 'EGRESO',
                    monto: data.monto,
                    concepto: data.concepto,
                    proveedor_id: data.proveedor_id
                }
            })

            // Update saldo
            await tx.cuentaBancaria.update({
                where: { id: data.cuenta_bancaria_id },
                data: {
                    saldo_actual: { decrement: data.monto }
                }
            })

            return mov
        })
    }

    static async registrarCobroFactura(empresaId: string, data: { cuenta_bancaria_id: string, monto: number, concepto: string, fecha: Date }) {
        const cuenta = await prisma.cuentaBancaria.findUnique({ where: { id: data.cuenta_bancaria_id } })
        if (!cuenta || cuenta.empresa_id !== empresaId) {
            throw new Error("Cuenta bancaria no encontrada o no pertenece a la empresa")
        }

        return prisma.$transaction(async (tx) => {
            const mov = await tx.movimientoTesoreria.create({
                data: {
                    cuenta_bancaria_id: data.cuenta_bancaria_id,
                    fecha: data.fecha,
                    tipo: 'INGRESO',
                    monto: data.monto,
                    concepto: data.concepto,
                }
            })

            // Update saldo
            await tx.cuentaBancaria.update({
                where: { id: data.cuenta_bancaria_id },
                data: {
                    saldo_actual: { increment: data.monto }
                }
            })

            return mov
        })
    }

    // --- Compras de Insumos (Cuentas a Pagar) ---
    static async registrarCompraInsumo(empresaId: string, data: { proveedor_id: string, numero_factura?: string, moneda: string, items: any[] }) {
        // Calculate total
        const total = data.items.reduce((acc, item) => acc + (item.cantidad * item.precio_unitario), 0)

        return prisma.compraInsumo.create({
            data: {
                empresa_id: empresaId,
                proveedor_id: data.proveedor_id,
                numero_factura: data.numero_factura,
                moneda: data.moneda,
                total: total,
                items: {
                    create: data.items.map(item => ({
                        insumo_id: item.insumo_id,
                        cantidad: item.cantidad,
                        precio_unitario: item.precio_unitario,
                        subtotal: item.cantidad * item.precio_unitario
                    }))
                }
            }
        })
    }
}
