'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Pencil, Trash2, Map } from 'lucide-react'
import { toast } from 'sonner'
import { deleteLote } from '@/server/lotes'
import { LoteFormDialog } from './lote-form-dialog'

interface LoteListTableProps {
    data: any[]
    establecimientos: any[]
    rol: string
}

export function LoteListTable({ data, establecimientos, rol }: LoteListTableProps) {
    const canDelete = rol === 'ADMIN'

    const handleDelete = async (id: string) => {
        if (!confirm('¿Está seguro de eliminar este lote?')) return
        const result = await deleteLote(id)
        if (result.success) {
            toast.success('Lote eliminado')
        } else {
            toast.error(result.error as string)
        }
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl border-dashed bg-slate-50/50">
                <Map className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">No hay lotes registrados</h3>
                <p className="text-sm text-slate-500 max-w-sm mt-1">
                    Cree su primer lote para asignarlo a los campos y utilizarlo en sus presupuestos y órdenes de trabajo.
                </p>
                <div className="mt-6">
                    <LoteFormDialog establecimientos={establecimientos} />
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto w-full">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="font-semibold text-slate-700">Nombre del Lote</TableHead>
                            <TableHead className="font-semibold text-slate-700">Hectáreas</TableHead>
                            <TableHead className="font-semibold text-slate-700">Establecimiento</TableHead>
                            <TableHead className="font-semibold text-slate-700">Cliente</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((lote) => (
                            <TableRow key={lote.id} className="group hover:bg-slate-50/80 transition-colors">
                                <TableCell className="font-medium text-slate-900">
                                    {lote.nombre}
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
                                        {Number(lote.hectareas).toLocaleString('es-AR')} ha
                                    </span>
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    {lote.establecimiento?.nombre || '-'}
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    {lote.establecimiento?.cliente?.razon_social || '-'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="sr-only">Abrir menú</span>
                                                <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-[160px]">
                                            <LoteFormDialog 
                                                lote={lote} 
                                                establecimientos={establecimientos}
                                                trigger={
                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                        <Pencil className="mr-2 h-4 w-4 text-slate-500" />
                                                        Editar
                                                    </DropdownMenuItem>
                                                }
                                            />
                                            {canDelete && (
                                                <DropdownMenuItem
                                                    onClick={() => handleDelete(lote.id)}
                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
