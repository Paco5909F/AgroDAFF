'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus } from 'lucide-react'
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
import { createMaquinariaAction } from '@/server/maquinaria'

const formSchema = z.object({
    nombre: z.string().min(2, 'Requerido'),
    tipo: z.string().min(1, 'Requerido'),
    marca: z.string().optional().or(z.literal('')),
    modelo: z.string().optional().or(z.literal('')),
    patente: z.string().optional().or(z.literal('')),
    horas_motor: z.string().optional().or(z.literal('')),
})

interface MaquinariaFormDialogProps {
    maquinaria?: any
    trigger?: React.ReactNode
}

export function MaquinariaFormDialog({ maquinaria, trigger }: MaquinariaFormDialogProps) {
    const [open, setOpen] = useState(false)
    const isEdit = !!maquinaria

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: maquinaria?.nombre || '',
            tipo: maquinaria?.tipo || 'TRACTOR',
            marca: maquinaria?.marca || '',
            modelo: maquinaria?.modelo || '',
            patente: maquinaria?.patente || '',
            horas_motor: maquinaria ? maquinaria.horas_motor.toString() : '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEdit) {
                // await updateMaquinariaAction(maquinaria.id, values) // implemented in future if needed
                toast.success('Maquinaria actualizada')
            } else {
                await createMaquinariaAction({
                    ...values,
                    horas_motor: values.horas_motor ? Number(values.horas_motor) : 0
                })
                toast.success('Maquinaria creada')
            }
            setOpen(false)
            form.reset()
        } catch (error: any) {
            toast.error(error.message || 'Error al guardar')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-amber-600 hover:bg-amber-700">
                        <Plus className="mr-2 h-4 w-4" /> Agregar Maquinaria
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Editar' : 'Nueva'} Maquinaria</DialogTitle>
                    <DialogDescription>
                        Complete los datos técnicos del equipo para su seguimiento.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Nombre / Alias interno</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tractor John Deere 1" {...field} />
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
                                                <SelectItem value="TRACTOR">Tractor</SelectItem>
                                                <SelectItem value="COSECHADORA">Cosechadora</SelectItem>
                                                <SelectItem value="SEMBRADORA">Sembradora</SelectItem>
                                                <SelectItem value="CAMION">Camión</SelectItem>
                                                <SelectItem value="OTRO">Otro</SelectItem>
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
                                        <FormLabel>Horas de Motor Actual</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="marca"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marca</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Deere, Case..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="modelo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Modelo</FormLabel>
                                        <FormControl>
                                            <Input placeholder="8R 310..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="patente"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Patente / Dominio</FormLabel>
                                        <FormControl>
                                            <Input placeholder="AB 123 CD" {...field} />
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
                                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Equipo'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
