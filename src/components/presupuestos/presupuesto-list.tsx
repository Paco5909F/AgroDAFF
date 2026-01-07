'use client'

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
import { FileText, Download, CheckCircle2, XCircle, Loader2, Pencil, Trash2, AlertTriangle } from 'lucide-react'
import { generatePresupuestoPDF } from '@/lib/pdf-generator'
import { format } from 'date-fns'
import { updatePresupuestoStatus, deletePresupuesto } from '@/server/presupuestos'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { PresupuestoFormDialog } from './presupuesto-form-dialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"

interface PresupuestosListProps {
    data: any[]
    clientes: any[]
    servicios: any[]
    rol: string
}

export function PresupuestosList({ data, clientes, servicios, rol }: PresupuestosListProps) {
    const [loadingMap, setLoadingMap] = useState<Record<string, string | null>>({})
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [isDeleting, startDeleteTransition] = useTransition()

    const canChangeStatus = hasPermission(rol, PERMISSIONS.PRESUPUESTOS, 'change_status') // Aprobar/Rechazar
    const canDelete = hasPermission(rol, PERMISSIONS.PRESUPUESTOS, 'delete')
    const canEdit = hasPermission(rol, PERMISSIONS.PRESUPUESTOS, 'update')

    const handleDownloadPDF = (presupuesto: any) => {
        generatePresupuestoPDF(presupuesto)
    }

    const handleStatusUpdate = async (id: string, status: 'APROBADO' | 'RECHAZADO') => {
        setLoadingMap(prev => ({ ...prev, [id]: status }))
        try {
            const result = await updatePresupuestoStatus(id, status)
            if (result.success) {
                if (status === 'APROBADO') {
                    toast.success("Presupuesto Aprobado", {
                        description: "Se han generado órdenes de trabajo automáticamente."
                    })
                } else {
                    toast.error("Presupuesto Rechazado", {
                        description: "El presupuesto ha sido marcado como rechazado."
                    })
                }
            } else {
                toast.error("Error", {
                    description: "No se pudo actualizar el estado.",
                })
            }
        } catch (error) {
            console.error(error)
            toast.error("Error", {
                description: "Ocurrió un error inesperado.",
            })
        } finally {
            setLoadingMap(prev => ({ ...prev, [id]: null }))
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        startDeleteTransition(async () => {
            const result = await deletePresupuesto(deleteId)
            if (result.success) {
                toast.success("Presupuesto eliminado")
            } else {
                toast.error("Error al eliminar")
            }
            setDeleteId(null)
        })
    }

    if (!data || data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                <FileText className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-light">No hay presupuestos registrados.</p>
                <p className="text-sm">Cree uno nuevo para comenzar.</p>
            </div>
        )
    }

    return (
        <>
            <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((presupuesto) => (
                            <TableRow key={presupuesto.id} className="group hover:bg-slate-50/50 transition-colors">
                                <TableCell className="text-slate-500">
                                    {format(new Date(presupuesto.fecha), 'dd/MM/yyyy')}
                                </TableCell>
                                <TableCell className="font-medium text-slate-700">
                                    {presupuesto.cliente.razon_social}
                                </TableCell>
                                <TableCell className="font-medium text-slate-900">
                                    ${Number(presupuesto.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                                    ${presupuesto.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                                            presupuesto.estado === 'APROBADO' ? 'bg-emerald-100 text-emerald-800' :
                                                'bg-red-100 text-red-800'}`}>
                                        {presupuesto.estado}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        {/* Action Buttons */}
                                        {presupuesto.estado === 'PENDIENTE' && canChangeStatus && (
                                            <>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleStatusUpdate(presupuesto.id, 'APROBADO')}
                                                    disabled={!!loadingMap[presupuesto.id]}
                                                    className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                                                    title="Aprobar"
                                                >
                                                    {loadingMap[presupuesto.id] === 'APROBADO' ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <CheckCircle2 className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleStatusUpdate(presupuesto.id, 'RECHAZADO')}
                                                    disabled={!!loadingMap[presupuesto.id]}
                                                    className="h-8 w-8 text-red-500 hover:bg-red-50"
                                                    title="Rechazar"
                                                >
                                                    {loadingMap[presupuesto.id] === 'RECHAZADO' ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </>
                                        )}

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDownloadPDF(presupuesto)}
                                            className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                            title="Descargar PDF"
                                        >
                                            <FileText className="h-4 w-4" />
                                        </Button>

                                        {canEdit && (
                                            <PresupuestoFormDialog
                                                clientes={clientes}
                                                servicios={servicios}
                                                presupuesto={presupuesto}
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
                                                onClick={() => setDeleteId(presupuesto.id)}
                                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
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

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará el presupuesto permanentemente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? "Eliminando..." : "Eliminar"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
