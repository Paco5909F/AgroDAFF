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
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface MovimientosTableProps {
    data: any[]
}

export function MovimientosTable({ data }: MovimientosTableProps) {
    const [mobilePage, setMobilePage] = useState(1)
    
    const ITEMS_PER_PAGE = 8
    const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE)
    const paginatedData = data.slice((mobilePage - 1) * ITEMS_PER_PAGE, mobilePage * ITEMS_PER_PAGE)

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

            {/* VISTA MÓVIL (LIST ROWS) */}
            <div className="block md:hidden">
                {data.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 border rounded-xl bg-white m-3">
                        No hay movimientos registrados.
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col m-3">
                        {paginatedData.map((mov, index) => {
                            const isIngreso = mov.tipo === 'INGRESO'
                            return (
                                <div key={mov.id} className={`p-3 flex items-start gap-3 ${index !== paginatedData.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                    {isIngreso ? (
                                        <div className="bg-emerald-100 p-2 rounded-lg shrink-0 mt-0.5"><ArrowDownRight className="w-4 h-4 text-emerald-600" /></div>
                                    ) : (
                                        <div className="bg-amber-100 p-2 rounded-lg shrink-0 mt-0.5"><ArrowUpRight className="w-4 h-4 text-amber-600" /></div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-bold text-slate-800 text-sm truncate pr-2">{mov.concepto}</h3>
                                            <div className={`text-right font-bold text-sm shrink-0 ${isIngreso ? 'text-emerald-600' : 'text-amber-600'}`}>
                                                {isIngreso ? '+' : '-'}{mov.cuenta?.moneda === 'USD' ? 'U$S' : '$'}{Number(mov.monto).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span className="font-medium text-[10px]">{format(new Date(mov.fecha), 'dd/MM/yy')}</span>
                                            <span>•</span>
                                            <span className="truncate">{mov.cuenta?.nombre}</span>
                                        </div>
                                        {mov.proveedor && (
                                            <div className="mt-1 flex items-center gap-1.5">
                                                <span className="text-[10px] uppercase font-bold text-slate-400">Entidad:</span>
                                                <span className="text-xs text-slate-600 truncate">{mov.proveedor.razon_social}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        
                        {/* Mobile Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between p-3 border-t border-slate-100 bg-slate-50/50">
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setMobilePage(p => Math.max(1, p - 1))}
                                    disabled={mobilePage === 1}
                                    className="h-8 text-xs bg-white"
                                >
                                    Anterior
                                </Button>
                                <span className="text-xs text-slate-500 font-medium">
                                    {mobilePage} / {totalPages}
                                </span>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={() => setMobilePage(p => Math.min(totalPages, p + 1))}
                                    disabled={mobilePage === totalPages}
                                    className="h-8 text-xs bg-white"
                                >
                                    Siguiente
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
