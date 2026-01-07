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
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createSilo, updateSilo, type Silo } from '@/server/silos'
import { getAllEstablecimientos } from '@/server/establecimientos'
import { getCampanas } from '@/server/campanas'

const siloSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    tipo: z.string().min(1, 'El tipo es requerido'),
    capacidad_max: z.coerce.number().min(0, 'La capacidad debe ser positiva'),
    stock_actual: z.coerce.number().min(0),
    humedad: z.coerce.number().optional(),
    grano: z.string().optional(),
    estado: z.string().default('DISPONIBLE'),
    establecimiento_id: z.string().min(1, 'Seleccione un establecimiento'),
    campana_id: z.string().optional(),
})

type SiloFormValues = z.infer<typeof siloSchema>

interface SiloDialogProps {
    trigger?: React.ReactNode
    onSuccess?: () => void
    siloToEdit?: Silo
}

export function SiloDialog({ trigger, onSuccess, siloToEdit }: SiloDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [establecimientos, setEstablecimientos] = useState<any[]>([])
    const [campanas, setCampanas] = useState<any[]>([])

    // Load data when dialog opens
    useEffect(() => {
        if (open) {
            getAllEstablecimientos().then(res => {
                if (res.success) setEstablecimientos(res.data || [])
            })
            getCampanas().then(res => {
                if (res.data) setCampanas(res.data)
            })
        }
    }, [open])

    const form = useForm<SiloFormValues>({
        resolver: zodResolver(siloSchema) as any,
        defaultValues: {
            nombre: siloToEdit?.nombre || '',
            tipo: siloToEdit?.tipo || 'FIJO',
            capacidad_max: Number(siloToEdit?.capacidad_max || 0),
            stock_actual: Number(siloToEdit?.stock_actual || 0),
            humedad: Number(siloToEdit?.humedad || 0),
            grano: siloToEdit?.grano || 'SOJA',
            estado: siloToEdit?.estado || 'DISPONIBLE',
            establecimiento_id: siloToEdit?.establecimiento_id || '',
            campana_id: siloToEdit?.campana_id || ''
        }
    })

    // Reset form when siloToEdit changes or dialog opens (if needed for re-initialization)
    useEffect(() => {
        if (siloToEdit) {
            form.reset({
                nombre: siloToEdit.nombre,
                tipo: siloToEdit.tipo,
                capacidad_max: siloToEdit.capacidad_max,
                stock_actual: siloToEdit.stock_actual,
                humedad: siloToEdit.humedad || 0,
                grano: siloToEdit.grano || 'SOJA',
                estado: siloToEdit.estado,
                establecimiento_id: siloToEdit.establecimiento_id,
                campana_id: siloToEdit.campana_id || ''
            })
        } else {
            if (!open) form.reset({
                nombre: '',
                tipo: 'FIJO',
                capacidad_max: 0,
                stock_actual: 0,
                humedad: 0,
                grano: 'SOJA',
                estado: 'DISPONIBLE',
                establecimiento_id: '',
                campana_id: ''
            })
        }
    }, [siloToEdit, form, open])


    function onSubmit(data: SiloFormValues) {
        startTransition(async () => {
            let result;
            const payload = {
                ...data,
                campana_id: data.campana_id || undefined
            }

            if (siloToEdit) {
                result = await updateSilo(siloToEdit.id, payload)
            } else {
                result = await createSilo(payload)
            }

            if (result.success) {
                toast.success(siloToEdit ? 'Silo actualizado' : 'Silo creado exitosamente')
                setOpen(false)
                if (!siloToEdit) form.reset() // Only reset on create, keep values on edit if user wants to edit again immediately (though dialog closes)
                if (onSuccess) onSuccess()
            } else {
                toast.error(result.error as string)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button>Nuevo Silo</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{siloToEdit ? 'Editar Silo' : 'Nuevo Silo / Depósito'}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Silo Principal" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="establecimiento_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Establecimiento</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione campo..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {establecimientos.map((est) => (
                                                    <SelectItem key={est.id} value={est.id}>
                                                        {est.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="tipo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tipo" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="FIJO">Silo Fijo (Chapa)</SelectItem>
                                                <SelectItem value="SILOBOLSA">Silobolsa</SelectItem>
                                                <SelectItem value="CELDA">Celda / Galpón</SelectItem>
                                                <SelectItem value="PLANTA">Planta de Acopio</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="campana_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Campaña (Opcional)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione campaña" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">Sin campaña específica</SelectItem>
                                                {campanas.map((c) => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="capacidad_max"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacidad Total (Tn)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="stock_actual"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Stock Actual (Tn)</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                control={form.control}
                                name="grano"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Grano</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Grano" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="SOJA">Soja</SelectItem>
                                                <SelectItem value="MAIZ">Maíz</SelectItem>
                                                <SelectItem value="TRIGO">Trigo</SelectItem>
                                                <SelectItem value="GIRASOL">Girasol</SelectItem>
                                                <SelectItem value="CEBADA">Cebada</SelectItem>
                                                <SelectItem value="SORGO">Sorgo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="humedad"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Humedad (%)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="estado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Estado" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="DISPONIBLE">Disponible</SelectItem>
                                                <SelectItem value="EN_USO">En Uso</SelectItem>
                                                <SelectItem value="LLENO">Lleno</SelectItem>
                                                <SelectItem value="EN_DESCARGA">En Descarga</SelectItem>
                                                <SelectItem value="CERRADO">Cerrado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700">
                                {isPending ? 'Guardando...' : (siloToEdit ? 'Actualizar Silo' : 'Guardar Silo')}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
