'use client'

import { useTransition } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Trash2, Pencil, Calendar, FileText, Download } from 'lucide-react'
import { deleteOrden } from '@/server/ordenes'
import { OrdenEditDialog } from './orden-edit-dialog'
import { FacturaDialog } from '@/components/facturacion/factura-dialog'
import { PDFDownloadButton } from './pdf-download-button'

import { hasPermission, PERMISSIONS } from '@/lib/permissions'

import { PdfBranding } from '@/lib/pdf-generator'

interface OrdenListProps {
    ordenes: any[]
    clientes: any[]
    servicios: any[]
    rol: string
    branding: PdfBranding
}

export function OrdenList({ ordenes, clientes, servicios, rol, branding }: OrdenListProps) {
    const [isPending, startTransition] = useTransition()
    const canDelete = hasPermission(rol, PERMISSIONS.ORDENES, 'delete')
    const canEdit = hasPermission(rol, PERMISSIONS.ORDENES, 'update')
    const canBill = hasPermission(rol, PERMISSIONS.FACTURACION, 'bill') // Assuming bill permission exists

    const handleDelete = (id: string) => {
        if (!confirm('¿Está seguro de eliminar esta orden?')) return

        startTransition(async () => {
            const result = await deleteOrden(id)
            if (result.success) {
                toast.success('Orden eliminada')
            } else {
                toast.error(result.error || 'Error al eliminar orden')
            }
        })
    }
    // ... (skip empty check for brevity in tool call, just replacing header props and returning early)

    if (ordenes.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-200">
                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <i className="lucide-clipboard-list w-6 h-6"></i>
                </div>
                <p className="text-slate-500 font-medium">No hay órdenes registradas.</p>
                <p className="text-xs text-slate-400 mt-1">Complete el formulario para crear la primera.</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead className="w-[280px]">Servicio</TableHead>
                        <TableHead className="hidden md:table-cell w-[200px]">Cliente</TableHead>
                        <TableHead className="hidden sm:table-cell w-[120px]">Fecha</TableHead>
                        <TableHead className="w-[100px] text-right">Cantidad</TableHead>
                        <TableHead className="w-[140px] text-right">Total</TableHead>
                        <TableHead className="w-[120px]">Estado</TableHead>
                        <TableHead className="text-right w-[100px]">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ordenes.map((orden) => (
                        <TableRow key={orden.id} className="group">
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                                        {orden.items?.[0]?.servicio?.nombre?.charAt(0) || "S"}
                                    </div>
                                    <div className="flex flex-col max-w-[180px] sm:max-w-[250px]">
                                        <span className="text-slate-700 group-hover:text-emerald-700 transition-colors truncate font-medium">
                                            {orden.items?.length > 1
                                                ? `Varios (${orden.items.length})`
                                                : orden.items?.[0]?.servicio?.nombre || "Sin servicio"}
                                        </span>
                                        {orden.items?.length > 1 && (
                                            <span className="text-[10px] text-slate-400 truncate">
                                                {orden.items.map((i: any) => i.servicio.nombre).join(", ")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="md:hidden text-xs text-slate-500 mt-1">
                                    {orden.cliente.razon_social}
                                </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-slate-600">
                                {orden.cliente.razon_social}
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-slate-500 text-sm">
                                {new Date(orden.fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant="secondary" className="font-normal text-slate-600">
                                    {orden.items?.length || 0} ítems
                                </Badge>
                            </TableCell>
                            <TableCell className="font-medium text-right">
                                ${Number(orden.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </TableCell>
                            <TableCell>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${orden.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                    orden.estado === 'COMPLETADA' ? 'bg-emerald-100 text-emerald-800' :
                                        'bg-slate-100 text-slate-800'
                                    }`}>
                                    {orden.estado}
                                </span>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-1">
                                    {orden.estado !== 'facturada' && canBill && (
                                        <FacturaDialog
                                            orden={orden}
                                            trigger={
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50" title="Facturar">
                                                    <FileText className="h-4 w-4" />
                                                </Button>
                                            }
                                        />
                                    )}

                                    <PDFDownloadButton
                                        orden={orden}
                                        variant="ghost"
                                        size="icon"
                                        className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                        branding={branding}
                                    />

                                    {canEdit && (
                                        <OrdenEditDialog
                                            orden={orden}
                                            clientes={clientes}
                                            servicios={servicios}
                                            trigger={
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="Editar">
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            }
                                        />
                                    )}

                                    {canDelete && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(orden.id)}
                                            className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                            title="Eliminar"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
