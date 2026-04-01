'use client'


import { Badge } from "@/components/ui/badge"
import { Truck, FileText, Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { generateCartaPortePDF, PdfBranding } from '@/lib/pdf-generator'
import { Button } from '@/components/ui/button'
import { deleteCartaPorte } from '@/server/cartas-porte'
import { toast } from 'sonner'
import { CartaPorteFormDialog } from './carta-porte-form-dialog'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'

interface CartaPorteListProps {
    data: any[]
    clientes: any[]
    rol: string
    branding: PdfBranding
}

export function CartaPorteList({ data, clientes, rol, branding }: CartaPorteListProps) {
    const canDelete = hasPermission(rol, PERMISSIONS.CARTAS_PORTE, 'delete')
    const canEdit = hasPermission(rol, PERMISSIONS.CARTAS_PORTE, 'update')
    const handleDelete = async (id: string) => {
        if (!confirm('¿Está seguro de eliminar esta Carta de Porte?')) return;
        const result = await deleteCartaPorte(id);
        if (result.success) {
            toast.success('Carta de Porte eliminada');
        } else {
            toast.error(result.error);
        }
    }

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400 bg-white rounded-xl border border-dashed border-slate-200">
                <Truck className="h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-light">No hay cartas de porte registradas.</p>
                <p className="text-sm">Emita una para comenzar.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((cp: any) => (
                <div key={cp.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:border-emerald-100">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                                {format(new Date(cp.fecha_carga), 'dd MMM yyyy')}
                            </span>
                            <span className="font-bold text-slate-800 text-lg leading-tight">
                                {cp.cliente.razon_social}
                            </span>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${cp.estado === 'ACTIVA' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {cp.estado}
                        </span>
                    </div>

                    <div className="space-y-3 mb-5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">CTG</span>
                            <span className="font-mono font-medium text-slate-700 bg-slate-50 px-2 py-0.5 rounded">
                                {cp.ctg}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Chofer</span>
                            <span className="font-medium text-slate-700">{cp.chofer}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Patente</span>
                            <span className="font-medium text-slate-700">{cp.patente_camion}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-500">Kilos Estimados</span>
                            <span className="text-lg font-bold text-slate-800">
                                {Number(cp.kilos_estimados).toLocaleString('es-AR')} <span className="text-sm font-normal text-slate-400">kg</span>
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => generateCartaPortePDF(cp, branding)}
                            className="text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                            title="Descargar PDF"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            PDF
                        </Button>

                        <div className="w-px h-4 bg-slate-200 mx-1" />

                        {canEdit && (
                            <CartaPorteFormDialog
                                clientes={clientes}
                                initialData={cp}
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
                                onClick={() => handleDelete(cp.id)}
                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                title="Eliminar"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    )
}
