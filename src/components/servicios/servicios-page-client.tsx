'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Pencil, Search, Package } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteServicio } from '@/server/servicios'
import { ServicioDialog } from './servicio-dialog'

export default function ServiciosPage({ data = [] }: { data?: any[] }) {
    const [isPending, startTransition] = useTransition()

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            const result = await deleteServicio(id)
            if (result.success) {
                toast.success('Servicio eliminado')
            } else {
                toast.error('Error al eliminar servicio')
            }
        })
    }

    return (
        <div className="rounded-xl border-transparent bg-transparent shadow-none md:border-slate-100 md:bg-white md:shadow-sm overflow-hidden">
            <div className="hidden md:block overflow-x-auto w-full">
                <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="text-slate-500 font-medium">Nombre</TableHead>
                        <TableHead className="text-slate-500 font-medium">Unidad de Medida</TableHead>
                        <TableHead className="text-slate-500 font-medium">Precio Base</TableHead>
                        <TableHead className="text-right text-slate-500 font-medium">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-32 text-center text-slate-500">
                                No hay servicios registrados que coincidan con la búsqueda.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((servicio) => (
                            <TableRow key={servicio.id} className="hover:bg-slate-50/50 transition-colors group">
                                <TableCell className="font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">
                                    {servicio.nombre}
                                </TableCell>
                                <TableCell className="text-slate-600">
                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                        {servicio.unidad_medida}
                                    </span>
                                </TableCell>
                                <TableCell className="font-medium text-slate-800 whitespace-nowrap">
                                    {servicio.moneda === 'USD' ? 'US$ ' : '$ '}
                                    {Number(servicio.precio_base).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    <span className="text-xs text-slate-400 font-normal ml-1">{servicio.moneda || 'ARS'}</span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <ServicioDialog servicio={servicio}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </ServicioDialog>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar Servicio?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Se "archivará" el servicio "{servicio.nombre}". No se borrará el historial de órdenes pasadas.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => handleDelete(servicio.id)}>
                                                        Eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            </div>

                {/* VISTA MÓVIL (TARJETAS) */}
                <div className="block md:hidden space-y-4">
                    {data.length === 0 ? (
                        <div className="text-center py-8 text-slate-500 border rounded-lg">
                            No hay labores registradas.
                        </div>
                    ) : (
                        data.map((servicio) => (
                            <div key={servicio.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-slate-50">
                                    <h3 className="font-semibold text-slate-800 text-lg mb-1">{servicio.nombre}</h3>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                                        {servicio.unidad_medida}
                                    </span>
                                </div>
                                <div className="p-4 flex flex-col">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Precio Base</span>
                                    <div className="flex items-end gap-1">
                                        <span className="text-2xl font-bold text-slate-900">${Number(servicio.precio_base).toLocaleString('es-AR', {minimumFractionDigits: 2})}</span>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 flex justify-end gap-2 border-t border-slate-100">
                                    {canEdit && (
                                        <ServicioFormDialog
                                            servicio={servicio}
                                            trigger={
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            }
                                        />
                                    )}
                                    {canDelete && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteId(servicio.id)}
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

        </div>
    )
}
