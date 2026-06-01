'use client'

import { useState, useTransition } from 'react'
import { Trash, Pencil } from 'lucide-react'
import { toast } from 'sonner'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ProveedorFormDialog } from './proveedor-form-dialog'
import { deleteProveedorAction } from '@/server/proveedores'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'

interface Proveedor {
    id: string
    razon_social: string
    cuit: string
    condicion_iva: string | null
    email: string | null
    telefono: string | null
    created_at: Date
}

interface ProveedorListTableProps {
    data: Proveedor[]
    rol: string
}

export function ProveedorListTable({ data, rol }: ProveedorListTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const canEdit = hasPermission(rol, PERMISSIONS.PROVEEDORES, 'update')
    const canDelete = hasPermission(rol, PERMISSIONS.PROVEEDORES, 'delete')

    const handleDelete = async () => {
        if (!deleteId) return
        startTransition(async () => {
            try {
                await deleteProveedorAction(deleteId)
                toast.success('Proveedor eliminado')
            } catch (error: any) {
                toast.error('Error al eliminar')
            }
            setDeleteId(null)
        })
    }

    return (
        <>
            <div className="rounded-xl border-transparent bg-transparent shadow-none md:border-slate-100 md:bg-white md:shadow-sm overflow-hidden">
                <div className="hidden md:block overflow-x-auto w-full">
                    <Table>
                        <TableHeader className="bg-slate-50/50">
                            <TableRow className="hover:bg-transparent border-slate-100">
                                <TableHead className="text-slate-500 font-medium">Razón Social</TableHead>
                                <TableHead className="text-slate-500 font-medium hidden md:table-cell">CUIT</TableHead>
                                <TableHead className="text-slate-500 font-medium hidden xl:table-cell">Condición IVA</TableHead>
                                <TableHead className="text-slate-500 font-medium hidden sm:table-cell">Contacto</TableHead>
                                <TableHead className="text-right text-slate-500 font-medium">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-slate-500">
                                        No hay proveedores registrados.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((prov) => (
                                    <TableRow key={prov.id} className="group hover:bg-slate-50/50">
                                        <TableCell className="font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">
                                            {prov.razon_social}
                                        </TableCell>
                                        <TableCell className="text-slate-600 hidden md:table-cell">{prov.cuit}</TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                {prov.condicion_iva || 'No especificada'}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-slate-700">{prov.email || '-'}</span>
                                                <span className="text-slate-400 text-xs">{prov.telefono}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {canEdit && (
                                                    <ProveedorFormDialog
                                                        proveedor={prov}
                                                        trigger={
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="Editar">
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        }
                                                    />
                                                )}
                                                {canDelete && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                        title="Eliminar"
                                                        onClick={() => setDeleteId(prov.id)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                )}
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
                        <div className="text-center py-8 text-slate-500">
                            No hay proveedores registrados.
                        </div>
                    ) : (
                        data.map((prov) => (
                            <div key={prov.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-slate-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-slate-800 text-lg">{prov.razon_social}</h3>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                                            {prov.condicion_iva || 'S/E'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600 font-medium font-mono">
                                        CUIT: {prov.cuit}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-2 bg-slate-50/30">
                                    <div className="text-sm">
                                        <span className="text-slate-500 block text-xs uppercase tracking-wider font-bold mb-0.5">Contacto</span>
                                        <div className="text-slate-700">{prov.email || 'Sin email'}</div>
                                        <div className="text-slate-500">{prov.telefono || 'Sin teléfono'}</div>
                                    </div>
                                </div>
                                <div className="bg-slate-50 p-3 flex justify-end gap-2 border-t border-slate-100">
                                    {canEdit && (
                                        <ProveedorFormDialog
                                            proveedor={prov}
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
                                            className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                                            onClick={() => setDeleteId(prov.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción eliminará lógicamente al proveedor.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isPending}
                        >
                            {isPending ? 'Eliminando...' : 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
