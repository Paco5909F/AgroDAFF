'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

interface MovimientosTableProps {
    data: any[]
}

export function MovimientosTable({ data }: MovimientosTableProps) {
    return (
        <div className="rounded-xl border-transparent md:border-slate-100 bg-transparent md:bg-white shadow-none md:shadow-sm overflow-hidden">
            <div className="hidden md:block overflow-x-auto w-full">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="text-slate-500 font-medium">Fecha</TableHead>
                            <TableHead className="text-slate-500 font-medium">Concepto</TableHead>
                            <TableHead className="text-slate-500 font-medium">Cuenta / Origen</TableHead>
                            <TableHead className="text-slate-500 font-medium hidden md:table-cell">Entidad</TableHead>
                            <TableHead className="text-right text-slate-500 font-medium">Monto</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                    No hay movimientos registrados.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((mov) => {
                                const isIngreso = mov.tipo === 'INGRESO'
                                return (
                                    <TableRow key={mov.id} className="group hover:bg-slate-50/50">
                                        <TableCell className="text-slate-600">
                                            {format(new Date(mov.fecha), 'dd/MM/yyyy')}
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-800">
                                            <div className="flex items-center gap-2">
                                                {isIngreso ? (
                                                    <div className="bg-emerald-100 p-1 rounded-full"><ArrowDownRight className="w-3 h-3 text-emerald-600" /></div>
                                                ) : (
                                                    <div className="bg-amber-100 p-1 rounded-full"><ArrowUpRight className="w-3 h-3 text-amber-600" /></div>
                                                )}
                                                {mov.concepto}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-600">
                                            {mov.cuenta?.nombre} <span className="text-xs text-slate-400">({mov.cuenta?.moneda})</span>
                                        </TableCell>
                                        <TableCell className="hidden md:table-cell text-slate-600">
                                            {mov.proveedor ? mov.proveedor.razon_social : '-'}
                                        </TableCell>
                                        <TableCell className={`text-right font-medium ${isIngreso ? 'text-emerald-600' : 'text-amber-600'}`}>
                                            {isIngreso ? '+' : '-'} {mov.cuenta?.moneda === 'USD' ? 'U$S' : '$'} {Number(mov.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* VISTA MÓVIL (TARJETAS) */}
            <div className="block md:hidden space-y-3 p-4 bg-slate-50">
                {data.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border rounded-lg bg-white">
                        No hay movimientos registrados.
                    </div>
                ) : (
                    data.map((mov) => {
                        const isIngreso = mov.tipo === 'INGRESO'
                        return (
                            <div key={mov.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-3">
                                        {isIngreso ? (
                                            <div className="bg-emerald-100 p-2 rounded-full mt-1"><ArrowDownRight className="w-4 h-4 text-emerald-600" /></div>
                                        ) : (
                                            <div className="bg-amber-100 p-2 rounded-full mt-1"><ArrowUpRight className="w-4 h-4 text-amber-600" /></div>
                                        )}
                                        <div>
                                            <h3 className="font-medium text-slate-800">{mov.concepto}</h3>
                                            <p className="text-xs text-slate-500">{format(new Date(mov.fecha), 'dd/MM/yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className={`text-right font-bold text-lg ${isIngreso ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {isIngreso ? '+' : '-'}{mov.cuenta?.moneda === 'USD' ? 'U$S' : '$'}{Number(mov.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 text-sm grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Cuenta</span>
                                        <span className="text-slate-700">{mov.cuenta?.nombre}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Entidad</span>
                                        <span className="text-slate-700">{mov.proveedor ? mov.proveedor.razon_social : '-'}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    )
}
