import { Suspense } from 'react'
import { getCuentasBancariasAction, getMovimientosAction } from '@/server/tesoreria'
import { getProveedoresAction } from '@/server/proveedores'
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react'
import { getUserContext } from '@/server/context'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'
import { NuevaCuentaDialog } from '@/components/tesoreria/nueva-cuenta-dialog'
import { RegistrarMovimientoDialog } from '@/components/tesoreria/registrar-movimiento-dialog'
import { MovimientosTable } from '@/components/tesoreria/movimientos-table'

export const dynamic = 'force-dynamic'

export default async function TesoreriaPage() {
    const cuentas = await getCuentasBancariasAction()
    const movimientos = await getMovimientosAction()
    const proveedores = await getProveedoresAction() // needed for select in movement dialog

    const { rol } = await getUserContext()
    const canCreate = hasPermission(rol, PERMISSIONS.TESORERIA, 'create')

    // Calculate totals
    const totalARS = cuentas.filter((c: any) => c.moneda === 'ARS').reduce((acc: number, c: any) => acc + Number(c.saldo_actual), 0)
    const totalUSD = cuentas.filter((c: any) => c.moneda === 'USD').reduce((acc: number, c: any) => acc + Number(c.saldo_actual), 0)

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Wallet className="h-8 w-8 text-emerald-600" />
                        Tesorería
                    </h1>
                    <p className="text-slate-500 font-light mt-1">
                        Control de caja, bancos y flujo de fondos de la empresa.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    {canCreate && (
                        <>
                            <NuevaCuentaDialog />
                            <RegistrarMovimientoDialog cuentas={cuentas} proveedores={proveedores} tipo="INGRESO" />
                            <RegistrarMovimientoDialog cuentas={cuentas} proveedores={proveedores} tipo="EGRESO" />
                        </>
                    )}
                </div>
            </div>

            {/* Cuentas Bancarias Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                    <p className="text-sm font-medium text-slate-500 mb-2">Total Consolidado ARS</p>
                    <p className="text-3xl font-light text-slate-800 tracking-tight">
                        $ {totalARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                    <p className="text-sm font-medium text-slate-500 mb-2">Total Consolidado USD</p>
                    <p className="text-3xl font-light text-slate-800 tracking-tight">
                        U$S {totalUSD.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                </div>

                {cuentas.map((cuenta: any) => (
                    <div key={cuenta.id} className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-6 shadow-sm group hover:border-emerald-200 transition-colors">
                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div>
                                <h3 className="font-semibold text-slate-700">{cuenta.nombre}</h3>
                                <p className="text-xs text-slate-500">{cuenta.cbu || 'Sin CBU'}</p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <CreditCard className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-2xl font-light text-slate-800">
                                {cuenta.moneda === 'USD' ? 'U$S' : '$'} {Number(cuenta.saldo_actual).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                            <CreditCard className="h-32 w-32" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Historial de Movimientos */}
            <div className="mt-4">
                <h2 className="text-xl font-light text-slate-800 mb-4">Últimos Movimientos</h2>
                <Suspense fallback={<div>Cargando movimientos...</div>}>
                    <MovimientosTable data={movimientos} />
                </Suspense>
            </div>
        </div>
    )
}
