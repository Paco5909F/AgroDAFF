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
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto w-full">
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
        </div>
    )
}
