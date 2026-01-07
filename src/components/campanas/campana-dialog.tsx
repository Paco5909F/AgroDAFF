'use client'

import { useState, useTransition, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createCampana, updateCampana, type Campana } from '@/server/campanas'
import { Sparkles, Pencil, Plus } from 'lucide-react'

const campanaSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    fecha_inicio: z.string().min(1, 'Fecha inicio requerida'),
    fecha_fin: z.string().min(1, 'Fecha fin requerida'),
    activa: z.boolean(),
    tipo: z.string(),
    ciclo: z.string().optional()
})

type CampanaFormValues = z.infer<typeof campanaSchema>

interface CampanaDialogProps {
    trigger?: React.ReactNode
    onSuccess?: () => void
    campana?: Campana
}

export function CampanaDialog({ trigger, onSuccess, campana }: CampanaDialogProps) {
    const isEdit = !!campana
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [smartMode, setSmartMode] = useState(!isEdit) // Default smart mode off if editing

    // Helper for Smart Mode
    const [selectedCycle, setSelectedCycle] = useState("24/25")
    const [selectedType, setSelectedType] = useState("GRUESA")

    const form = useForm<CampanaFormValues>({
        resolver: zodResolver(campanaSchema),
        defaultValues: {
            nombre: campana?.nombre || '',
            fecha_inicio: campana?.fecha_inicio ? new Date(campana.fecha_inicio).toISOString().split('T')[0] : '',
            fecha_fin: campana?.fecha_fin ? new Date(campana.fecha_fin).toISOString().split('T')[0] : '',
            activa: campana?.activa || false,
            tipo: (campana as any)?.tipo || 'GENERAL',
            ciclo: (campana as any)?.ciclo || ''
        }
    })

    // Smart Auto-Fill Logic
    useEffect(() => {
        if (!smartMode) return

        let name = ""
        let start = ""
        let end = ""

        const [startYearShort, endYearShort] = selectedCycle.split('/')
        const startYearFull = `20${startYearShort}`
        const endYearFull = `20${endYearShort}`

        if (selectedType === 'GRUESA') {
            name = `Campaña ${selectedCycle} - Gruesa`
            start = `${startYearFull}-09-01`
            end = `${endYearFull}-06-30`
        } else if (selectedType === 'FINA') {
            name = `Campaña ${startYearFull} - Fina`
            start = `${startYearFull}-05-01`
            end = `${startYearFull}-12-31`
        }

        form.setValue('nombre', name)
        form.setValue('fecha_inicio', start)
        form.setValue('fecha_fin', end)
        form.setValue('tipo', selectedType)
        form.setValue('ciclo', selectedCycle) // Bind cycle to form

    }, [smartMode, selectedCycle, selectedType, form])

    function onSubmit(data: CampanaFormValues) {
        startTransition(async () => {
            const result = isEdit
                ? await updateCampana(campana.id, data)
                : await createCampana(data)

            if (result.success) {
                toast.success(isEdit ? 'Campaña actualizada' : 'Campaña creada exitosamente')
                setOpen(false)
                if (!isEdit) form.reset()
                if (onSuccess) onSuccess()
            } else {
                toast.error(result.error as string)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4" />
                        Nueva Campaña
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Sparkles className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle>{isEdit ? 'Editar Campaña' : 'Nueva Campaña'}</DialogTitle>
                            {!isEdit && (
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-xs text-slate-500">Modo Inteligente</span>
                                    <Switch
                                        checked={smartMode}
                                        onCheckedChange={setSmartMode}
                                        className="scale-75"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </DialogHeader>

                {smartMode && (
                    <div className="bg-slate-50 p-4 rounded-lg mb-4 grid grid-cols-2 gap-4 border border-slate-100">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Ciclo</label>
                            <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                                <SelectTrigger className="h-9 bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="23/24">2023 / 2024</SelectItem>
                                    <SelectItem value="24/25">2024 / 2025</SelectItem>
                                    <SelectItem value="25/26">2025 / 2026</SelectItem>
                                    <SelectItem value="26/27">2026 / 2027</SelectItem>
                                    <SelectItem value="27/28">2027 / 2028</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Tipo</label>
                            <Select value={selectedType} onValueChange={setSelectedType}>
                                <SelectTrigger className="h-9 bg-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GRUESA">Gruesa (Soja/Maíz)</SelectItem>
                                    <SelectItem value="FINA">Fina (Trigo/Cebada)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="col-span-2 text-[10px] text-slate-400 text-center">
                            * Fechas sugeridas automáticamente según ciclo argentino.
                        </div>
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fecha_inicio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Inicio</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fecha_fin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fin</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="activa"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">
                                            Campaña Activa
                                        </FormLabel>
                                        <FormDescription>
                                            Establecer como la campaña actual.
                                        </FormDescription>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700">
                                {isPending ? (isEdit ? 'Guardando...' : 'Creando...') : (isEdit ? 'Guardar Cambios' : 'Crear Campaña')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}
