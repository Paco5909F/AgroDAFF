'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Pencil, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { LoteFormValues, loteSchema } from '@/lib/validations/lote'
import { createLote, updateLote } from '@/server/lotes'

interface LoteFormDialogProps {
    lote?: any
    establecimientos: any[] // Lista para el select
    trigger?: React.ReactNode
}

export function LoteFormDialog({ lote, establecimientos, trigger }: LoteFormDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const isEditing = !!lote

    const form = useForm({
        resolver: zodResolver(loteSchema),
        defaultValues: {
            nombre: lote?.nombre || '',
            hectareas: lote?.hectareas ? Number(lote.hectareas) : 0,
            establecimiento_id: lote?.establecimiento_id || '',
        },
    })

    function onSubmit(data: LoteFormValues) {
        startTransition(async () => {
            const result = isEditing
                ? await updateLote(lote.id, data)
                : await createLote(data)

            if (result.success) {
                toast.success(isEditing ? 'Lote actualizado' : 'Lote creado exitosamente')
                setOpen(false)
                if (!isEditing) form.reset()
            } else {
                toast.error(result.error as string)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Lote
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Lote' : 'Nuevo Lote'}</DialogTitle>
                    <DialogDescription>
                        Ingrese el nombre y la cantidad de hectáreas del lote.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="establecimiento_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Establecimiento / Campo</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar establecimiento" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {establecimientos.map(est => (
                                                <SelectItem key={est.id} value={est.id}>
                                                    {est.nombre} {est.cliente ? `(${est.cliente.razon_social})` : ''}
                                                </SelectItem>
                                            ))}
                                            {establecimientos.length === 0 && (
                                                <SelectItem value="empty" disabled>No hay establecimientos</SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre del Lote</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Lote 1 - Norte" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="hectareas"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hectáreas (ha)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="0.00" value={field.value as number} onChange={field.onChange} name={field.name} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEditing ? 'Guardar Cambios' : 'Crear Lote'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
