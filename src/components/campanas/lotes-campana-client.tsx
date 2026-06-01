'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Sprout, Tractor, DollarSign, Target } from "lucide-react"
import { toast } from "sonner"
import { removeLoteFromCampana } from "@/server/produccion"
import { useRouter } from "next/navigation"

import { LoteCampanaDialog } from "./lote-campana-dialog"

interface LotesCampanaClientProps {
    campana: any
    lotesCampana: any[]
    disponiblesLotes: any[]
}

export function LotesCampanaClient({ campana, lotesCampana, disponiblesLotes }: LotesCampanaClientProps) {
    const router = useRouter()
    
    // KPIs
    const totalHa = lotesCampana.reduce((acc, l) => acc + Number(l.superficie), 0)
    const estimacionTn = lotesCampana.reduce((acc, l) => acc + (Number(l.superficie) * (Number(l.rinde_estimado_qq || 0) / 10)), 0)

    const handleDelete = async (id: string) => {
        if (!confirm("¿Quitar este lote de la campaña?")) return
        const res = await removeLoteFromCampana(id)
        if (res.success) {
            toast.success("Lote removido de la campaña")
            router.refresh()
        } else {
            toast.error(res.error as string)
        }
    }

    return (
        <div className="space-y-6">
            {/* KPIs */}
            <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-100 rounded-full blur-2xl opacity-50 transition-opacity" />
                    <div className="relative">
                        <p className="text-sm font-medium text-slate-500">Superficie Total</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">
                            {totalHa.toLocaleString('es-AR', { maximumFractionDigits: 1 })} <span className="text-lg font-normal text-slate-500">ha</span>
                        </h3>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full blur-2xl opacity-50 transition-opacity" />
                    <div className="relative">
                        <p className="text-sm font-medium text-slate-500">Estimación de Cosecha</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">
                            {estimacionTn.toLocaleString('es-AR', { maximumFractionDigits: 0 })} <span className="text-lg font-normal text-slate-500">tn</span>
                        </h3>
                    </div>
                </div>
                
                <div className="rounded-2xl border border-slate-200/60 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100 rounded-full blur-2xl opacity-50 transition-opacity" />
                    <div className="relative">
                        <p className="text-sm font-medium text-slate-500">Lotes Asignados</p>
                        <h3 className="text-3xl font-bold text-slate-900 mt-2">
                            {lotesCampana.length}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Acciones */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-slate-800">Planificación por Lote</h3>
                <LoteCampanaDialog 
                    campanaId={campana.id} 
                    disponiblesLotes={disponiblesLotes}
                    trigger={
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="w-4 h-4 mr-2" /> Asignar Lote a Campaña
                        </Button>
                    }
                />
            </div>

            {/* Listado */}
            {lotesCampana.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <Target className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No hay lotes planificados</h3>
                    <p className="text-sm text-slate-500 max-w-sm mt-1">
                        Asigne lotes a esta campaña para comenzar a planificar siembras, costos y estimar rindes.
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border-transparent md:border-slate-200/60 bg-transparent md:bg-white md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="hidden md:block overflow-x-auto w-full">
                        <Table>
                            <TableHeader className="bg-slate-50/50">
                                <TableRow className="border-slate-100">
                                    <TableHead>Lote</TableHead>
                                    <TableHead>Establecimiento</TableHead>
                                    <TableHead>Cultivo</TableHead>
                                    <TableHead className="text-right">Ha Sembradas</TableHead>
                                    <TableHead className="text-right">Rinde Est. (qq/ha)</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lotesCampana.map(item => (
                                    <TableRow key={item.id} className="border-slate-100">
                                        <TableCell className="font-medium text-slate-700">{item.lote?.nombre}</TableCell>
                                        <TableCell className="text-slate-500">{item.lote?.establecimiento?.nombre}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded bg-emerald-100 flex items-center justify-center">
                                                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                                                </div>
                                                <span className="font-medium text-slate-700">{item.cultivo}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-slate-700">
                                            {Number(item.superficie).toLocaleString('es-AR')}
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-slate-700">
                                            {item.rinde_estimado_qq ? Number(item.rinde_estimado_qq).toLocaleString('es-AR') : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <LoteCampanaDialog 
                                                    campanaId={campana.id} 
                                                    disponiblesLotes={[]} // Edición no cambia lote
                                                    loteCampana={item}
                                                    trigger={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                                                            <Tractor className="w-4 h-4" />
                                                        </Button>
                                                    }
                                                />
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
                        {lotesCampana.map(item => (
                            <div key={item.id} className="bg-white rounded-xl border border-slate-100 p-4 flex flex-col shadow-sm">
                                <div className="flex justify-between items-start mb-3 border-b border-slate-50 pb-3">
                                    <div className="flex gap-3">
                                        <div className="w-10 h-10 rounded bg-emerald-100 flex items-center justify-center shrink-0">
                                            <Sprout className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800 leading-tight">{item.lote?.nombre}</h3>
                                            <p className="text-xs text-slate-500 mt-1">{item.lote?.establecimiento?.nombre}</p>
                                        </div>
                                    </div>
                                    <span className="font-medium text-slate-700 text-sm bg-slate-50 px-2 py-1 rounded">{item.cultivo}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Superficie</span>
                                        <span className="font-medium text-slate-700 text-lg">{Number(item.superficie).toLocaleString('es-AR')} <span className="text-xs text-slate-500 font-normal">ha</span></span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">Rinde Est.</span>
                                        <span className="font-medium text-slate-700 text-lg">{item.rinde_estimado_qq ? Number(item.rinde_estimado_qq).toLocaleString('es-AR') : '-'} <span className="text-xs text-slate-500 font-normal">qq</span></span>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                                    <LoteCampanaDialog 
                                        campanaId={campana.id} 
                                        disponiblesLotes={[]}
                                        loteCampana={item}
                                        trigger={
                                            <Button variant="outline" size="sm" className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                                                <Tractor className="w-3.5 h-3.5 mr-1.5" />
                                                Editar
                                            </Button>
                                        }
                                    />
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100"
                                        onClick={() => handleDelete(item.id)}
                                    >
                                        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                                        Quitar
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
