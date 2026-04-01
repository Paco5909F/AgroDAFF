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
import { ActivityInsumosForm } from '@/components/insumos/activity-insumos-form'
import { addInsumoToOrdenItem, deleteOrdenItemInsumo } from '@/server/orden-insumos'
import { getInsumos } from '@/server/insumos'
import { useState, useEffect } from 'react'

interface OrdenListProps {
    ordenes: any[]
    clientes: any[]
    servicios: any[]
    rol: string
    branding: PdfBranding
}

export function OrdenList({ ordenes, clientes, servicios, rol, branding }: OrdenListProps) {
    const [isPending, startTransition] = useTransition()
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
    const [insumoCatalog, setInsumoCatalog] = useState<any[]>([])

    // Load catalog for the forms
    useEffect(() => {
        getInsumos().then(res => {
            if (res.success && res.insumos) {
                setInsumoCatalog(res.insumos)
            }
        })
    }, [])

    const toggleRow = (id: string) => {
        const newSet = new Set(expandedRows)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setExpandedRows(newSet)
    }

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
                        <>
                        <TableRow 
                            key={orden.id} 
                            className={`group cursor-pointer ${expandedRows.has(orden.id) ? 'bg-slate-50/80 border-l-4 border-l-emerald-500' : ''}`}
                            onClick={() => toggleRow(orden.id)}
                        >
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
                        
                        {/* Expandable Content for Items and Insumos */}
                        {expandedRows.has(orden.id) && (
                            <TableRow className="bg-slate-50 border-b border-slate-200">
                                <TableCell colSpan={7} className="p-0">
                                    <div className="p-4 pl-12 border-l-4 border-emerald-500 my-2 mx-4 rounded-md bg-white shadow-sm">
                                        <h4 className="font-semibold text-slate-800 mb-3 text-sm flex items-center gap-2">
                                            <i className="lucide-list-checks w-4 h-4 text-emerald-600"></i>
                                            Detalle de Labores ({orden.items.length})
                                        </h4>
                                        <div className="space-y-6">
                                            {orden.items.map((item: any) => (
                                                <div key={item.id} className="border border-slate-100 rounded-lg p-3">
                                                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-50">
                                                        <div className="font-medium text-slate-700">
                                                            {item.servicio?.nombre}
                                                            <span className="text-slate-400 text-sm font-normal ml-2">
                                                                ({item.cantidad} {item.servicio?.unidad_medida})
                                                            </span>
                                                        </div>
                                                        <div className="font-semibold text-emerald-700">
                                                            ${Number(item.total).toLocaleString('es-AR', {minimumFractionDigits: 2})}
                                                        </div>
                                                    </div>

                                                    {/* Insumos List for this Item */}
                                                    {item.insumos && item.insumos.length > 0 && (
                                                        <div className="mt-3 pl-4 border-l-2 border-amber-200">
                                                            <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Insumos Aplicados</h5>
                                                            <div className="space-y-2">
                                                                {item.insumos.map((ins: any) => (
                                                                    <div key={ins.id} className="flex items-center justify-between text-sm bg-amber-50/50 p-2 rounded">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="font-medium text-slate-700">{ins.insumo?.nombre}</span>
                                                                            <span className="text-slate-500 text-xs">
                                                                                ({Number(ins.dosis_por_ha)} {ins.insumo?.unidad_medida}/ha x {ins.cantidad_pasadas} pasadas)
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-4">
                                                                            <span className="text-amber-700 font-medium">
                                                                                ${Number(ins.costo_total).toLocaleString('es-AR')}
                                                                            </span>
                                                                            {canDelete && (
                                                                                <Button 
                                                                                    variant="ghost" 
                                                                                    size="icon" 
                                                                                    className="h-6 w-6 text-slate-400 hover:text-red-600"
                                                                                    onClick={async () => {
                                                                                        if(confirm('¿Remover insumo?')) {
                                                                                            await deleteOrdenItemInsumo(ins.id)
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <Trash2 className="h-3 w-3" />
                                                                                </Button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Add Insumo Form */}
                                                    {canEdit && (
                                                        <ActivityInsumosForm 
                                                            ordenItemId={item.id}
                                                            catalog={insumoCatalog}
                                                            hectareasAplicadas={Number(item.cantidad)}
                                                            onAddInsumoAction={addInsumoToOrdenItem}
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
