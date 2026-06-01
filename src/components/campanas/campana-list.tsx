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
import { Button } from "@/components/ui/button"
import { Calendar, Trash2, CheckCircle2, Circle, Pencil, LayoutDashboard } from "lucide-react"
import { deleteCampana, toggleCampanaActiva } from "@/server/campanas"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { CampanaDialog } from "./campana-dialog"

interface CampanaListProps {
    campanas: any[]
}

export function CampanaList({ campanas }: CampanaListProps) {
    const router = useRouter()

    const handleToggleActiva = async (id: string, currentStatus: boolean) => {
        const res = await toggleCampanaActiva(id)
        if (res.success) {
            toast.success("Campaña activada")
            router.refresh()
        } else {
            toast.error(res.error as string)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("¿Está seguro? Esto fallará si tiene órdenes asociadas.")) return
        const res = await deleteCampana(id)
        if (res.success) {
            toast.success("Campaña eliminada")
            router.refresh()
        } else {
            toast.error(res.error as string)
        }
    }

    if (campanas.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed rounded-lg bg-slate-50">
                <p className="text-slate-500">No hay campañas registradas.</p>
                <p className="text-sm text-slate-400">Cree la primera para comenzar a organizar sus temporadas.</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border-transparent bg-transparent shadow-none md:border-slate-100 md:bg-white md:shadow-sm overflow-hidden">
            <div className="hidden md:block overflow-x-auto w-full">
            <Table>
                <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-slate-100">
                        <TableHead>Ciclo</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Fechas</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {campanas.map((campana) => (
                        <TableRow key={campana.id}>
                            <TableCell className="font-medium text-slate-600">
                                {(campana as any).ciclo || '-'}
                            </TableCell>
                            <TableCell className="font-medium">
                                {campana.nombre}
                            </TableCell>
                            <TableCell>
                                {campana.activa ? (
                                    <Badge className="bg-emerald-600 hover:bg-emerald-700">ACTIVA</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-slate-500">INACTIVA</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-sm text-slate-500">
                                {new Date(campana.fecha_inicio).toLocaleDateString('es-AR', { timeZone: 'UTC' })} - {new Date(campana.fecha_fin).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
                            </TableCell>
                            <TableCell>
                                {campana.tipo === 'GRUESA' && (
                                    <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 gap-1 rounded-sm">
                                        <span className="text-xs">☀️</span> Gruesa
                                    </Badge>
                                )}
                                {campana.tipo === 'FINA' && (
                                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 gap-1 rounded-sm">
                                        <span className="text-xs">❄️</span> Fina
                                    </Badge>
                                )}
                                {(!campana.tipo || campana.tipo === 'GENERAL') && (
                                    <Badge variant="outline" className="text-slate-500 rounded-sm">General</Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleToggleActiva(campana.id, campana.activa)}
                                        className={`h-8 w-8 ${campana.activa ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                        title={campana.activa ? "Desactivar" : "Activar"}
                                    >
                                        {campana.activa ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                    </Button>

                                    <Link href={`/campanas/${campana.id}`}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50" title="Planificar Lotes">
                                            <LayoutDashboard className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <CampanaDialog
                                        campana={campana}
                                        trigger={
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50" title="Editar">
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        }
                                    />

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(campana.id)}
                                        className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        title="Eliminar"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>

                {/* VISTA MÓVIL (TARJETAS) */}
                <div className="block md:hidden space-y-4">
                    {campanas.map((campana) => (
                        <div key={campana.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="flex items-center justify-between p-4 border-b border-slate-50">
                                <div>
                                    <h3 className="font-semibold text-slate-800">{campana.nombre}</h3>
                                    <span className="text-xs text-slate-500 font-medium">Ciclo: {(campana as any).ciclo || '-'}</span>
                                </div>
                                {campana.activa ? (
                                    <Badge className="bg-emerald-600 hover:bg-emerald-700">ACTIVA</Badge>
                                ) : (
                                    <Badge variant="outline" className="text-slate-500">INACTIVA</Badge>
                                )}
                            </div>
                            
                            <div className="p-4 flex flex-col gap-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium flex items-center gap-1"><Calendar className="w-3 h-3"/> Fechas</span>
                                    <span className="text-slate-700">{new Date(campana.fecha_inicio).toLocaleDateString('es-AR', { timeZone: 'UTC' })} - {new Date(campana.fecha_fin).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Tipo</span>
                                    <span>
                                        {campana.tipo === 'GRUESA' && (
                                            <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 gap-1 rounded-sm">
                                                <span className="text-xs">☀️</span> Gruesa
                                            </Badge>
                                        )}
                                        {campana.tipo === 'FINA' && (
                                            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 gap-1 rounded-sm">
                                                <span className="text-xs">❄️</span> Fina
                                            </Badge>
                                        )}
                                        {(!campana.tipo || campana.tipo === 'GENERAL') && (
                                            <Badge variant="outline" className="text-slate-500 rounded-sm">General</Badge>
                                        )}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-3 flex justify-end gap-2 border-t border-slate-100">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleActiva(campana.id, campana.activa)}
                                    className={`h-8 gap-1 ${campana.activa ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                >
                                    {campana.activa ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                                    <span className="sr-only sm:not-sr-only">Activar</span>
                                </Button>

                                <Link href={`/campanas/${campana.id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-indigo-600">
                                        <LayoutDashboard className="h-4 w-4" />
                                    </Button>
                                </Link>

                                <CampanaDialog
                                    campana={campana}
                                    trigger={
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    }
                                />

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(campana.id)}
                                    className="h-8 w-8 p-0 text-slate-500 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

        </div>
    )
}
