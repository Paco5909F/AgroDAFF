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
    const [mobilePage, setMobilePage] = useState(1)
    
    const ITEMS_PER_PAGE = 8
    const totalPages = Math.ceil(lotesCampana.length / ITEMS_PER_PAGE)
    const paginatedLotes = lotesCampana.slice((mobilePage - 1) * ITEMS_PER_PAGE, mobilePage * ITEMS_PER_PAGE)
    
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

                    {/* VISTA MÓVIL (LIST ROWS) */}
                    <div className="block md:hidden">
                        <div className="bg-white border-t border-slate-200 flex flex-col">
                            {paginatedLotes.map((item, index) => (
                                <div key={item.id} className={`p-3 flex items-start gap-3 ${index !== paginatedLotes.length - 1 ? 'border-b border-slate-100' : ''}`}>
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <Sprout className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <h3 className="font-bold text-slate-800 text-sm truncate pr-2">{item.lote?.nombre}</h3>
                                            <span className="font-bold text-slate-700 text-[9px] bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0">{item.cultivo}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 mb-1">{item.lote?.establecimiento?.nombre}</p>
                                        
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <span className="font-medium text-slate-700">{Number(item.superficie).toLocaleString('es-AR')}</span>
                                                <span className="text-[10px]">ha</span>
                                            </div>
                                            <span>•</span>
                                            <div className="flex items-center gap-1">
                                                <span className="text-[10px] text-slate-400">Rinde Est:</span>
                                                <span className="font-medium text-slate-700">{item.rinde_estimado_qq ? Number(item.rinde_estimado_qq).toLocaleString('es-AR') : '-'}</span>
                                                <span className="text-[10px]">qq</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-end gap-2 mt-2">
                                            <LoteCampanaDialog 
                                                campanaId={campana.id} 
                                                disponiblesLotes={[]}
                                                loteCampana={item}
                                                trigger={
                                                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full">
                                                        <Tractor className="w-3.5 h-3.5" />
                                                    </Button>
                                                }
                                            />
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {/* Mobile Pagination Controls */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between p-3 border-t border-slate-100 bg-slate-50/50">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setMobilePage(p => Math.max(1, p - 1))}
                                        disabled={mobilePage === 1}
                                        className="h-8 text-xs bg-white"
                                    >
                                        Anterior
                                    </Button>
                                    <span className="text-xs text-slate-500 font-medium">
                                        {mobilePage} / {totalPages}
                                    </span>
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => setMobilePage(p => Math.min(totalPages, p + 1))}
                                        disabled={mobilePage === totalPages}
                                        className="h-8 text-xs bg-white"
                                    >
                                        Siguiente
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
