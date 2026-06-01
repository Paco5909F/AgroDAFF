'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Wrench } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { registrarMantenimientoAction } from '@/server/maquinaria'

const formSchema = z.object({
    fecha: z.string().min(1, 'Requerido'),
    tipo: z.string().min(1, 'Requerido'),
    descripcion: z.string().min(2, 'Requerido'),
    costo: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Debe ser mayor a 0'),
    horas_motor: z.string().optional().or(z.literal('')),
})

export function MantenimientoFormDialog({ maquinariaId, trigger }: { maquinariaId: string, trigger: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fecha: new Date().toISOString().split('T')[0],
            tipo: 'PREVENTIVO',
            descripcion: '',
            costo: '',
            horas_motor: '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            await registrarMantenimientoAction({
                ...values,
                costo: Number(values.costo),
                horas_motor: values.horas_motor ? Number(values.horas_motor) : 0,
                maquinaria_id: maquinariaId,
                moneda: 'ARS', // default
                fecha: new Date(values.fecha)
            })
            toast.success('Mantenimiento registrado')
            setOpen(false)
            form.reset()
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Mantenimiento</DialogTitle>
                    <DialogDescription>
                        Complete los datos del servicio realizado al equipo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="fecha"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fecha</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="tipo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PREVENTIVO">Preventivo (Service)</SelectItem>
                                                <SelectItem value="CORRECTIVO">Correctivo (Rotura)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="horas_motor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Horas de Motor Actuales</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="costo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Costo ($)</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="descripcion"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Descripción / Repuestos</FormLabel>
                                        <FormControl>
                                            <textarea className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Cambio de aceite, filtros..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="bg-amber-600 hover:bg-amber-700">
                                {form.formState.isSubmitting ? 'Registrando...' : 'Guardar'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
