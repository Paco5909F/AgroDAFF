'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Plus, X, Calculator, Info } from 'lucide-react'

// Utility function to avoid missing import
const formatCurrency = (val: number, cur: string) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: cur }).format(val)
}

// Types
type InsumoSummary = {
    id: string
    nombre: string
    unidad_medida: string
    precio_actual: number
    moneda: string
    es_global?: boolean
}

type FormProps = {
    ordenItemId: string
    catalog: InsumoSummary[]
    hectareasAplicadas: number
    onAddInsumoAction: (data: any) => Promise<{ success: boolean; error?: string }>
}

export function ActivityInsumosForm({ ordenItemId, catalog, hectareasAplicadas, onAddInsumoAction }: FormProps) {
    const [isPending, startTransition] = useTransition()
    const [isOpen, setIsOpen] = useState(false)
    
    const [selectedInsumoId, setSelectedInsumoId] = useState<string>('')
    const [dosis, setDosis] = useState('')
    const [pasadas, setPasadas] = useState('1')
    
    // Financing optionals
    const [interes, setInteres] = useState('')
    const [meses, setMeses] = useState('')

    const selectedInsumo = catalog.find(i => i.id === selectedInsumoId)

    // Real-time calculation preview
    const previewCalc = () => {
        if (!selectedInsumo || !dosis || !pasadas) return null
        
        const px = selectedInsumo.precio_actual
        const d = Number(dosis) || 0
        const p = Number(pasadas) || 1
        const ha = hectareasAplicadas || 1

        const costoHa = px * d * p
        const costoTotal = costoHa * ha
        
        let financiado = null
        if (interes && meses) {
            const intDec = (Number(interes) || 0) / 100
            const m = Number(meses) || 0
            if (intDec > 0 && m > 0) {
                financiado = costoTotal * (1 + (intDec * m))
            }
        }

        return { costoHa, costoTotal, financiado, moneda: selectedInsumo.moneda }
    }

    const calc = previewCalc()

    const handleSubmit = () => {
        if (!selectedInsumoId || !dosis) {
            return toast.error("Debe seleccionar un insumo y especificar la dosis")
        }

        startTransition(async () => {
            const res = await onAddInsumoAction({
                orden_item_id: ordenItemId,
                insumo_id: selectedInsumoId,
                dosis_por_ha: Number(dosis),
                cantidad_pasadas: Number(pasadas) || 1,
                interes_mensual: interes ? Number(interes) : undefined,
                meses_financiacion: meses ? Number(meses) : undefined
            })

            if (res.success) {
                toast.success("Insumo agregado a la actividad")
                setIsOpen(false)
                setSelectedInsumoId('')
                setDosis('')
                setPasadas('1')
                setInteres('')
                setMeses('')
            } else {
                toast.error(res.error || "Error al agregar insumo")
            }
        })
    }

    if (!isOpen) {
        return (
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)} className="w-full border-dashed border-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                <Plus className="h-4 w-4 mr-2" /> Agregar Receta / Insumo
            </Button>
        )
    }

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-4 relative mt-4">
            <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 h-6 w-6 text-slate-400 hover:text-slate-600"
                onClick={() => setIsOpen(false)}
            >
                <X className="h-4 w-4" />
            </Button>

            <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-600" />
                Nueva Asignación de Insumo
            </h4>

            <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 col-span-full md:col-span-1">
                    <Label className="text-xs">Insumo del Catálogo</Label>
                    <Select value={selectedInsumoId} onValueChange={setSelectedInsumoId}>
                        <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Seleccione un insumo..." />
                        </SelectTrigger>
                        <SelectContent className="max-h-[200px]">
                            <SelectGroup>
                                <SelectLabel className="text-blue-700 bg-blue-50 py-1">🌍 Insumos del Sistema</SelectLabel>
                                {catalog.filter(i => i.es_global).map(item => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.nombre} ({formatCurrency(item.precio_actual, item.moneda)}/{item.unidad_medida})
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                            <SelectGroup>
                                <SelectLabel className="text-emerald-700 bg-emerald-50 py-1 mt-2">🏢 Mis Insumos Particulares</SelectLabel>
                                {catalog.filter(i => !i.es_global).map(item => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.nombre} ({formatCurrency(item.precio_actual, item.moneda)}/{item.unidad_medida})
                                    </SelectItem>
                                ))}
                                {catalog.filter(i => !i.es_global).length === 0 && (
                                    <div className="text-xs text-slate-400 p-2 italic text-center">No tiene insumos propios aún.</div>
                                )}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <Label className="text-xs">Dosis por Ha {selectedInsumo ? `(${selectedInsumo.unidad_medida})` : ''}</Label>
                        <Input 
                            type="number" 
                            placeholder="0.00" 
                            className="bg-white"
                            value={dosis} 
                            onChange={e => setDosis(e.target.value)} 
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs">Cant. Pasadas</Label>
                        <Input 
                            type="number" 
                            min="1" 
                            className="bg-white"
                            value={pasadas} 
                            onChange={e => setPasadas(e.target.value)} 
                        />
                    </div>
                </div>
            </div>

            {/* Optional Financing Section */}
            <div className="pt-2 border-t border-slate-200">
                <Label className="text-xs text-slate-500 mb-2 block">Financiación (Opcional - Interés Simple Mns)</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                        <Input 
                            type="number" 
                            placeholder="Tasa ej: 2.5" 
                            className="bg-white pr-8"
                            value={interes}
                            onChange={e => setInteres(e.target.value)}
                        />
                        <span className="absolute right-3 top-2.5 text-sm font-medium text-slate-400">%</span>
                    </div>
                    <div className="relative">
                        <Input 
                            type="number" 
                            placeholder="Meses ej: 6" 
                            className="bg-white pr-10"
                            value={meses}
                            onChange={e => setMeses(e.target.value)}
                        />
                        <span className="absolute right-3 top-2.5 text-sm font-medium text-slate-400">mss</span>
                    </div>
                </div>
            </div>

            {/* Live Preview Panel */}
            {calc && (
                <div className="bg-emerald-50 rounded-md p-3 text-sm">
                    <div className="flex justify-between items-center mb-1 text-emerald-800">
                        <span className="flex items-center gap-1"><Info className="h-3.5 w-3.5" />Costo Estimado</span>
                        <span className="font-medium">{hectareasAplicadas} Has</span>
                    </div>
                    <div className="flex justify-between text-emerald-700 text-xs">
                        <span>Costo por Hectárea:</span>
                        <span>{formatCurrency(calc.costoHa, calc.moneda)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-900 mt-1 pt-1 border-t border-emerald-100">
                        <span>Costo Total Base:</span>
                        <span>{formatCurrency(calc.costoTotal, calc.moneda)}</span>
                    </div>
                    {calc.financiado && (
                        <div className="flex justify-between font-bold text-amber-700 mt-1 pt-1 border-t border-amber-200">
                            <span>Total Financiado a Cosecha:</span>
                            <span>{formatCurrency(calc.financiado, calc.moneda)}</span>
                        </div>
                    )}
                </div>
            )}

            <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white" 
                disabled={isPending || !selectedInsumo || !dosis}
                onClick={handleSubmit}
            >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Confirmar Insumo a la Labor
            </Button>
        </div>
    )
}
