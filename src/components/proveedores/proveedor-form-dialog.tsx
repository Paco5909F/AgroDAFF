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
import { createProveedorAction, updateProveedorAction } from '@/server/proveedores'

const formSchema = z.object({
    razon_social: z.string().min(2, 'Requerido'),
    cuit: z.string().min(11, 'CUIT inválido'),
    condicion_iva: z.string().min(1, 'Requerido'),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
    telefono: z.string().optional().or(z.literal('')),
    observaciones: z.string().optional().or(z.literal('')),
})

interface ProveedorFormDialogProps {
    proveedor?: any
    trigger?: React.ReactNode
}

export function ProveedorFormDialog({ proveedor, trigger }: ProveedorFormDialogProps) {
    const [open, setOpen] = useState(false)
    const isEdit = !!proveedor

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            razon_social: proveedor?.razon_social || '',
            cuit: proveedor?.cuit || '',
            condicion_iva: proveedor?.condicion_iva || 'Responsable Inscripto',
            email: proveedor?.email || '',
            telefono: proveedor?.telefono || '',
            observaciones: proveedor?.observaciones || '',
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEdit) {
                await updateProveedorAction(proveedor.id, values)
                toast.success('Proveedor actualizado')
            } else {
                await createProveedorAction(values)
                toast.success('Proveedor creado')
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
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Proveedor
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Editar' : 'Nuevo'} Proveedor</DialogTitle>
                    <DialogDescription>
                        Ingrese los datos fiscales y de contacto del proveedor.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="razon_social"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Razón Social</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Agroinsumos S.A." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="cuit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CUIT</FormLabel>
                                        <FormControl>
                                            <Input placeholder="30123456789" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="condicion_iva"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Condición IVA</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Responsable Inscripto">Responsable Inscripto</SelectItem>
                                                <SelectItem value="Monotributo">Monotributo</SelectItem>
                                                <SelectItem value="Exento">Exento</SelectItem>
                                                <SelectItem value="Consumidor Final">Consumidor Final</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="ventas@empresa.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="telefono"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Teléfono (Opcional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+54 9 11..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="observaciones"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Observaciones</FormLabel>
                                        <FormControl>
                                            <textarea className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Notas sobre el proveedor..." {...field} />
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
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Guardando...' : 'Guardar Proveedor'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
