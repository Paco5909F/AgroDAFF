'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { addLoteToCampana, updateLoteCampana } from "@/server/produccion"
import { toast } from "sonner"
import { Sprout } from "lucide-react"

interface LoteCampanaDialogProps {
    campanaId: string
    disponiblesLotes: any[]
    loteCampana?: any
    trigger: React.ReactNode
}

export function LoteCampanaDialog({ campanaId, disponiblesLotes, loteCampana, trigger }: LoteCampanaDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    
    // Form state
    const [loteId, setLoteId] = useState(loteCampana?.lote_id || '')
    const [cultivo, setCultivo] = useState(loteCampana?.cultivo || '')
    const [superficie, setSuperficie] = useState(loteCampana?.superficie?.toString() || '')
    const [rindeEst, setRindeEst] = useState(loteCampana?.rinde_estimado_qq?.toString() || '')
    
    const isEdit = !!loteCampana

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen)
        if (newOpen && !isEdit) {
            setLoteId('')
            setCultivo('')
            setSuperficie('')
            setRindeEst('')
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!cultivo || !superficie) return toast.error("Debe especificar cultivo y superficie")
        if (!isEdit && !loteId) return toast.error("Debe seleccionar un lote")

        setLoading(true)
        
        try {
            if (isEdit) {
                const res = await updateLoteCampana(loteCampana.id, {
                    cultivo,
                    superficie: parseFloat(superficie),
                    rinde_estimado_qq: rindeEst ? parseFloat(rindeEst) : undefined
                })
                if (res.success) {
                    toast.success("Lote actualizado en la campaña")
                    setOpen(false)
                } else {
                    toast.error(res.error as string)
                }
            } else {
                const res = await addLoteToCampana({
                    campana_id: campanaId,
                    lote_id: loteId,
                    cultivo,
                    superficie: parseFloat(superficie),
                    rinde_estimado_qq: rindeEst ? parseFloat(rindeEst) : undefined
                })
                if (res.success) {
                    toast.success("Lote asignado a la campaña")
                    setOpen(false)
                } else {
                    toast.error(res.error as string)
                }
            }
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-white/95 backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-light text-slate-800">
                        <Sprout className="h-5 w-5 text-indigo-500" />
                        {isEdit ? 'Editar Planificación' : 'Planificar Lote'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    {!isEdit && (
                        <div className="space-y-2">
                            <Label className="text-slate-600">Lote Físico</Label>
                            <Select value={loteId} onValueChange={(val) => {
                                setLoteId(val)
                                const lote = disponiblesLotes.find(l => l.id === val)
                                if (lote) setSuperficie(lote.hectareas.toString())
                            }}>
                                <SelectTrigger className="bg-slate-50/50 border-slate-200">
                                    <SelectValue placeholder="Seleccione un lote..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {disponiblesLotes.length === 0 && (
                                        <SelectItem value="none" disabled>No hay lotes disponibles</SelectItem>
                                    )}
                                    {disponiblesLotes.map(l => (
                                        <SelectItem key={l.id} value={l.id}>
                                            {l.nombre} ({l.establecimiento?.nombre}) - {l.hectareas} ha
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <Label className="text-slate-600">Cultivo a Sembrar</Label>
                        <Select value={cultivo} onValueChange={setCultivo}>
                            <SelectTrigger className="bg-slate-50/50 border-slate-200">
                                <SelectValue placeholder="Ej: Soja, Maíz..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="SOJA">Soja</SelectItem>
                                <SelectItem value="MAIZ">Maíz</SelectItem>
                                <SelectItem value="TRIGO">Trigo</SelectItem>
                                <SelectItem value="GIRASOL">Girasol</SelectItem>
                                <SelectItem value="SORGO">Sorgo</SelectItem>
                                <SelectItem value="CEBADA">Cebada</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-600">Superficie (Ha)</Label>
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={superficie}
                                onChange={(e) => setSuperficie(e.target.value)}
                                className="bg-slate-50/50 border-slate-200"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-600">Rinde Est. (qq/ha)</Label>
                            <Input
                                type="number"
                                step="0.1"
                                placeholder="Ej: 35"
                                value={rindeEst}
                                onChange={(e) => setRindeEst(e.target.value)}
                                className="bg-slate-50/50 border-slate-200"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-2">
                        <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto rounded-xl">
                            {loading ? "Guardando..." : "Guardar Planificación"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
