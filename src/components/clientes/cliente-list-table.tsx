'use client'

import { useState, useTransition } from 'react'
import { MoreHorizontal, Trash, Pencil } from 'lucide-react'
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
import { ClienteFormDialog } from './cliente-form-dialog'
import { deleteCliente } from '@/server/clientes'

import { hasPermission, PERMISSIONS } from '@/lib/permissions'

// Define interface matching Prisma result
interface Cliente {
    id: string
    razon_social: string
    cuit: string
    condicion_iva: string
    email: string | null
    telefono: string | null
    created_at: Date
    establecimientos?: { id: string; nombre: string }[]
}

interface ClienteListTableProps {
    data: Cliente[]
    rol: string
}

export function ClienteListTable({ data, rol }: ClienteListTableProps) {
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const canEdit = hasPermission(rol, PERMISSIONS.CLIENTES, 'update')
    const canDelete = hasPermission(rol, PERMISSIONS.CLIENTES, 'delete')

    const handleDelete = async () => {
        if (!deleteId) return
        startTransition(async () => {
            const result = await deleteCliente(deleteId)
            if (result.success) {
                toast.success('Cliente eliminado')
            } else {
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
                                <TableHead className="text-slate-500 font-medium hidden lg:table-cell">Establecimientos</TableHead>
                                <TableHead className="text-slate-500 font-medium hidden md:table-cell">CUIT</TableHead>
                                <TableHead className="text-slate-500 font-medium hidden xl:table-cell">Condición IVA</TableHead>
                                <TableHead className="text-slate-500 font-medium hidden sm:table-cell">Contacto</TableHead>
                                <TableHead className="text-right text-slate-500 font-medium">Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                                        No hay clientes registrados que coincidan con la búsqueda.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                data.map((cliente) => (
                                    <TableRow key={cliente.id} className="group hover:bg-slate-50/50">
                                        <TableCell className="font-medium text-slate-700 group-hover:text-emerald-700 transition-colors">
                                            {cliente.razon_social}
                                        </TableCell>
                                        <TableCell className="text-slate-600 hidden lg:table-cell">
                                            {cliente.establecimientos && cliente.establecimientos.length > 0 ? (
                                                <div className="flex flex-wrap gap-1">
                                                    {cliente.establecimientos.slice(0, 2).map(e => (
                                                        <span key={e.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-amber-50 text-amber-700 border border-amber-100">
                                                            {e.nombre}
                                                        </span>
                                                    ))}
                                                    {cliente.establecimientos.length > 2 && (
                                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-slate-50 text-slate-500">
                                                            +{cliente.establecimientos.length - 2}
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">Sin asignar</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-600 hidden md:table-cell">{cliente.cuit}</TableCell>
                                        <TableCell className="hidden xl:table-cell">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                                                {cliente.condicion_iva}
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <div className="flex flex-col text-sm">
                                                <span className="text-slate-700">{cliente.email || '-'}</span>
                                                <span className="text-slate-400 text-xs">{cliente.telefono}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {canEdit && (
                                                    <ClienteFormDialog
                                                        cliente={cliente}
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
                                                        onClick={() => setDeleteId(cliente.id)}
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
                            No hay clientes registrados.
                        </div>
                    ) : (
                        data.map((cliente) => (
                            <div key={cliente.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-slate-50">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-slate-800 text-lg">{cliente.razon_social}</h3>
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-wider">
                                            {cliente.condicion_iva}
                                        </span>
                                    </div>
                                    <div className="text-sm text-slate-600 font-medium font-mono">
                                        CUIT: {cliente.cuit}
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col gap-2 bg-slate-50/30">
                                    <div className="text-sm">
                                        <span className="text-slate-500 block text-xs uppercase tracking-wider font-bold mb-0.5">Contacto</span>
                                        <div className="text-slate-700">{cliente.email || 'Sin email'}</div>
                                        <div className="text-slate-500">{cliente.telefono || 'Sin teléfono'}</div>
                                    </div>
                                    {cliente.establecimientos && cliente.establecimientos.length > 0 && (
                                        <div className="mt-2">
                                            <span className="text-slate-500 block text-xs uppercase tracking-wider font-bold mb-1">Establecimientos ({cliente.establecimientos.length})</span>
                                            <div className="flex flex-wrap gap-1">
                                                {cliente.establecimientos.slice(0, 3).map(e => (
                                                    <span key={e.id} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-amber-50 text-amber-700 border border-amber-100">
                                                        {e.nombre}
                                                    </span>
                                                ))}
                                                {cliente.establecimientos.length > 3 && (
                                                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-slate-50 text-slate-500">
                                                        +{cliente.establecimientos.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="bg-slate-50 p-3 flex justify-end gap-2 border-t border-slate-100">
                                    {canEdit && (
                                        <ClienteFormDialog
                                            cliente={cliente}
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
                                            onClick={() => setDeleteId(cliente.id)}
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
                            Esta acción eliminará lógicamente al cliente. Podrá ser recuperado por un administrador.
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
