'use client'

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Trash2, Warehouse, MapPin, AlertCircle, Pencil } from "lucide-react"
import { deleteSilo, type Silo } from "@/server/silos"
import { SiloDialog } from "./silo-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { hasPermission, PERMISSIONS } from "@/lib/permissions"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface SiloListProps {
    silos: Silo[]
    rol: string
}

export function SiloList({ silos, rol }: SiloListProps) {
    const router = useRouter()
    const canDelete = hasPermission(rol, PERMISSIONS.SILOS, 'delete')
    const canEdit = hasPermission(rol, PERMISSIONS.SILOS, 'update')

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro de eliminar este silo?")) return
        const res = await deleteSilo(id)
        if (res.success) {
            toast.success("Silo eliminado")
            router.refresh()
        } else {
            toast.error(res.error as string)
        }
    }

    if (!silos || silos.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed rounded-lg bg-slate-50">
                <Warehouse className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No hay silos registrados.</p>
                <p className="text-sm text-slate-400">Agregue silos fijos, celdas o silobolsas para gestionar su stock.</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border-transparent bg-transparent shadow-none md:border-slate-100 md:bg-white md:shadow-sm overflow-hidden">
            <div className="hidden md:block overflow-x-auto w-full">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="hover:bg-transparent border-slate-100">
                            <TableHead className="font-medium text-slate-500">Nombre</TableHead>
                            <TableHead className="font-medium text-slate-500">Tipo</TableHead>
                            <TableHead className="font-medium text-slate-500">Campaña</TableHead>
                            <TableHead className="font-medium text-slate-500 text-right">Capacidad (Tn)</TableHead>
                            <TableHead className="font-medium text-slate-500 text-right">Stock (Tn)</TableHead>
                            <TableHead className="font-medium text-slate-500">Grano</TableHead>
                            <TableHead className="font-medium text-slate-500 text-right">Humedad</TableHead>
                            <TableHead className="font-medium text-slate-500">Establecimiento</TableHead>
                            <TableHead className="font-medium text-slate-500">Estado</TableHead>
                            <TableHead className="font-medium text-slate-500 text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {silos.map((silo) => (
                            <TableRow key={silo.id} className="hover:bg-slate-50/50">
                                <TableCell className="font-medium text-slate-900">{silo.nombre}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-normal bg-slate-50 text-slate-600 border-slate-200">
                                        {silo.tipo}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-slate-600 text-sm">
                                    {silo.campana?.nombre || '-'}
                                </TableCell>
                                <TableCell className="text-right text-slate-600 font-medium">
                                    {Number(silo.capacidad_max).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-slate-900 font-bold">
                                    {Number(silo.stock_actual).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-slate-600 text-sm font-medium">
                                    {silo.grano || '-'}
                                </TableCell>
                                <TableCell className="text-right text-slate-600 text-sm">
                                    {silo.humedad ? `${Number(silo.humedad)}%` : '-'}
                                </TableCell>
                                <TableCell className="text-slate-500 text-sm">
                                    {silo.establecimiento?.nombre || '-'}
                                </TableCell>
                                <TableCell>
                                    <Badge className={`font-normal ${silo.estado === 'DISPONIBLE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200' :
                                        silo.estado === 'LLENO' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' :
                                            silo.estado === 'EN_USO' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' :
                                                'bg-slate-100 text-slate-600 border-slate-200'
                                        }`}>
                                        {silo.estado?.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end items-center gap-1">
                                        {canEdit && (
                                            <SiloDialog
                                                siloToEdit={silo}
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
                                                onClick={() => handleDelete(silo.id)}
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

                {/* VISTA MÓVIL (TARJETAS) */}
                <div className="block md:hidden space-y-4">
                    {silos.map((silo) => (
                        <div key={silo.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-slate-50">
                                <div>
                                    <h3 className="font-semibold text-slate-800">{silo.nombre}</h3>
                                    <span className="text-xs text-slate-500 font-medium">{silo.tipo}</span>
                                </div>
                                <Badge className={`font-normal ${silo.estado === 'DISPONIBLE' ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200' :
                                    silo.estado === 'LLENO' ? 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200' :
                                        silo.estado === 'EN_USO' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' :
                                            'bg-slate-100 text-slate-600 border-slate-200'
                                    }`}>
                                    {silo.estado?.replace('_', ' ')}
                                </Badge>
                            </div>
                            
                            <div className="p-4 grid grid-cols-2 gap-3 text-sm">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Stock Actual</span>
                                    <span className="text-slate-900 font-bold text-lg">{Number(silo.stock_actual).toLocaleString()} Tn</span>
                                </div>
                                <div className="flex flex-col items-end text-right">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Capacidad</span>
                                    <span className="text-slate-700 font-medium">{Number(silo.capacidad_max).toLocaleString()} Tn</span>
                                </div>
                                
                                <div className="col-span-2 pt-2 mt-1 border-t border-slate-50 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <span className="text-slate-500 text-xs">Grano / Humedad</span>
                                        <span className="font-medium text-slate-700">{silo.grano || '-'} <span className="text-slate-400 font-normal">({silo.humedad ? `${Number(silo.humedad)}%` : '-'})</span></span>
                                    </div>
                                    <div className="flex flex-col text-right">
                                        <span className="text-slate-500 text-xs">Establecimiento</span>
                                        <span className="text-slate-600">{silo.establecimiento?.nombre || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 flex justify-end gap-2 border-t border-slate-100">
                                {canEdit && (
                                    <SiloDialog
                                        siloToEdit={silo}
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
                                        onClick={() => handleDelete(silo.id)}
                                        className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

        </div>
    )
}
