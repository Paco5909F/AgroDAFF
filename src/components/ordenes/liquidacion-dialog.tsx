'use client'

import { useState, useTransition, useEffect } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cerrarOrdenTrabajo } from '@/server/liquidaciones'
import { toast } from 'sonner'
import { Loader2, DollarSign, CalendarIcon } from 'lucide-react'

interface LiquidacionDialogProps {
    orden: any
    trigger: React.ReactNode
}

export function LiquidacionDialog({ orden, trigger }: LiquidacionDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [itemsReales, setItemsReales] = useState<Record<string, number>>({})
    const [insumosReales, setInsumosReales] = useState<Record<string, number>>({})
    const [cotizacionUsd, setCotizacionUsd] = useState(1)
    
    useEffect(() => {
        if (open && orden) {
            const initialItems: Record<string, number> = {}
            const initialInsumos: Record<string, number> = {}
            orden.items.forEach((item: any) => {
                initialItems[item.id] = Number(item.cantidad)
                item.insumos.forEach((insumo: any) => {
                    // Calculamos la cantidad total presupuestada para el insumo = dosis * hectareas
                    const hectareas = Number(item.cantidad)
                    const dosis = Number(insumo.dosis_por_ha)
                    initialInsumos[insumo.id] = hectareas * dosis
                })
            })
            setItemsReales(initialItems)
            setInsumosReales(initialInsumos)
            setCotizacionUsd(1) // Todo: Fetch today's cotizacion if needed
        }
    }, [open, orden])

    const handleItemChange = (id: string, value: string) => {
        setItemsReales(prev => ({ ...prev, [id]: Number(value) }))
    }

    const handleInsumoChange = (id: string, value: string) => {
        setInsumosReales(prev => ({ ...prev, [id]: Number(value) }))
    }

    const calculateTotals = () => {
        let total = 0
        orden.items.forEach((item: any) => {
            const cantidad = itemsReales[item.id] || 0
            const precio = Number(item.precio_unit)
            total += cantidad * precio

            item.insumos.forEach((insumo: any) => {
                const cantIns = insumosReales[insumo.id] || 0
                const precioIns = Number(insumo.precio_unit_usado)
                total += cantIns * precioIns
            })
        })
        return total
    }

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        startTransition(async () => {
            const total_final = calculateTotals()
            const payload = {
                cotizacion_usd: cotizacionUsd,
                fecha_cierre: new Date(),
                total_final,
                items: orden.items.map((item: any) => ({
                    id: item.id,
                    cantidad_real: itemsReales[item.id] || 0,
                    precio_unit: Number(item.precio_unit)
                })),
                insumos: orden.items.flatMap((item: any) => 
                    item.insumos.map((ins: any) => ({
                        id: ins.id,
                        cantidad_real: insumosReales[ins.id] || 0,
                        precio_unit: Number(ins.precio_unit_usado)
                    }))
                )
            }

            const result = await cerrarOrdenTrabajo(orden.id, payload)
            
            if (result.success) {
                toast.success('Liquidación generada con éxito', {
                    description: 'La orden ha sido cerrada y los consumos congelados.'
                })
                setOpen(false)
            } else {
                toast.error('Error al generar liquidación', {
                    description: result.error
                })
            }
        })
    }

    const currentTotal = calculateTotals()

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2 text-indigo-700">
                        <DollarSign className="h-5 w-5" />
                        Cierre de Orden y Liquidación
                    </DialogTitle>
                    <DialogDescription>
                        Ingrese las cantidades <strong>reales</strong> ejecutadas en el campo. Los precios y el tipo de cambio quedarán congelados para emitir el reporte final.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6 mt-4">
                    {/* Header Info */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 flex flex-wrap gap-4 justify-between items-center">
                        <div>
                            <p className="text-xs text-slate-500 font-medium">Cotización Dólar (Opcional)</p>
                            <div className="relative mt-1">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                <Input 
                                    type="number" 
                                    step="0.01"
                                    value={cotizacionUsd}
                                    onChange={(e) => setCotizacionUsd(Number(e.target.value))}
                                    className="pl-7 h-9 w-32"
                                />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-500 font-medium">Total Liquidación Estimado</p>
                            <p className="text-2xl font-bold text-slate-800">
                                ${currentTotal.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>
                    </div>

                    {/* Tareas y Consumos */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-slate-700 border-b pb-2">Desglose de Trabajos Realizados</h4>
                        {orden.items.map((item: any, idx: number) => (
                            <div key={item.id} className="bg-white border rounded-xl overflow-hidden shadow-sm">
                                {/* Tarea Principal */}
                                <div className="bg-slate-50 p-3 border-b flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="font-medium text-sm text-slate-800">
                                            {idx + 1}. {item.servicio.nombre}
                                        </div>
                                        <div className="text-xs text-slate-500 mt-0.5">
                                            Planificado: {item.cantidad} {item.servicio.unidad_medida} | Precio: ${Number(item.precio_unit).toFixed(2)}
                                        </div>
                                    </div>
                                    <div className="w-32">
                                        <Label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Real ({item.servicio.unidad_medida})</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={itemsReales[item.id] || ''}
                                            onChange={(e) => handleItemChange(item.id, e.target.value)}
                                            className="h-8 bg-white"
                                            required
                                        />
                                    </div>
                                    <div className="w-24 text-right">
                                        <Label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Subtotal</Label>
                                        <div className="text-sm font-semibold text-slate-700 h-8 flex items-center justify-end">
                                            ${((itemsReales[item.id] || 0) * Number(item.precio_unit)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                        </div>
                                    </div>
                                </div>

                                {/* Insumos de la tarea */}
                                {item.insumos && item.insumos.length > 0 && (
                                    <div className="p-3 bg-white space-y-3">
                                        {item.insumos.map((insumo: any) => {
                                            const originalEstimado = Number(item.cantidad) * Number(insumo.dosis_por_ha)
                                            return (
                                                <div key={insumo.id} className="flex items-center justify-between gap-4 pl-4 border-l-2 border-indigo-100 py-1">
                                                    <div className="flex-1">
                                                        <div className="text-sm text-slate-600 flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-300"></div>
                                                            {insumo.insumo.nombre}
                                                        </div>
                                                        <div className="text-xs text-slate-400 pl-3.5 mt-0.5">
                                                            Est: {originalEstimado.toFixed(2)} {insumo.insumo.unidad_medida} (a ${Number(insumo.precio_unit_usado).toFixed(2)})
                                                        </div>
                                                    </div>
                                                    <div className="w-32">
                                                        <Input
                                                            type="number"
                                                            step="0.01"
                                                            value={insumosReales[insumo.id] || ''}
                                                            onChange={(e) => handleInsumoChange(insumo.id, e.target.value)}
                                                            className="h-8 bg-slate-50 text-sm"
                                                            required
                                                        />
                                                    </div>
                                                    <div className="w-24 text-right">
                                                        <div className="text-sm text-slate-600 h-8 flex items-center justify-end">
                                                            ${((insumosReales[insumo.id] || 0) * Number(insumo.precio_unit_usado)).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Cerrar y Liquidar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
