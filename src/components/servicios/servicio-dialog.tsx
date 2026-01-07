'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

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
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { servicioSchema, ServicioFormValues } from '@/lib/validations/servicio'
import { createServicio, updateServicio } from '@/server/servicios'

interface ServicioDialogProps {
    children?: React.ReactNode
    servicio?: any // If present, edit mode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function ServicioDialog({ children, servicio, open: controlledOpen, onOpenChange }: ServicioDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const isEdit = !!servicio
    const isControlled = controlledOpen !== undefined
    const isOpen = isControlled ? controlledOpen : internalOpen

    const handleOpenChange = (newOpen: boolean) => {
        if (!isControlled) {
            setInternalOpen(newOpen)
        }
        if (onOpenChange) {
            onOpenChange(newOpen)
        }
    }

    const form = useForm<ServicioFormValues>({
        resolver: zodResolver(servicioSchema) as any,
        defaultValues: {
            nombre: servicio?.nombre || "",
            unidad_medida: servicio?.unidad_medida || "",
            precio_base: servicio?.precio_base ? Number(servicio.precio_base) : 0,
            moneda: servicio?.moneda || "ARS",
        },
    })

    function onSubmit(data: ServicioFormValues) {
        startTransition(async () => {
            let result
            if (isEdit) {
                result = await updateServicio(servicio.id, data)
            } else {
                result = await createServicio(data.nombre, data.unidad_medida, data.precio_base, data.moneda)
            }

            if (result.success) {
                toast.success(isEdit ? 'Servicio actualizado' : 'Servicio creado')
                handleOpenChange(false)
                form.reset()
            } else {
                toast.error("Error al guardar servicio")
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Editar Servicio' : 'Nuevo Servicio'}</DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? 'Modifique el precio o detalles. Las órdenes anteriores no se verán afectadas.'
                            : 'Agregue un nuevo tipo de labor o servicio.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="nombre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej. Cosecha, Siembra..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-12 gap-4">
                            <FormField
                                control={form.control}
                                name="unidad_medida"
                                render={({ field }) => (
                                    <FormItem className="col-span-5">
                                        <FormLabel>Unidad</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccion..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Ha">Hectárea (Ha)</SelectItem>
                                                <SelectItem value="Ton">Tonelada (Ton)</SelectItem>
                                                <SelectItem value="Kg">Kilogramo (Kg)</SelectItem>
                                                <SelectItem value="Km">Kilómetro (Km)</SelectItem>
                                                <SelectItem value="Hora">Hora</SelectItem>
                                                <SelectItem value="Unidad">Unidad (Fijo)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="moneda"
                                render={({ field }) => (
                                    <FormItem className="col-span-3">
                                        <FormLabel>Moneda</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value || "ARS"}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="ARS" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ARS">ARS</SelectItem>
                                                <SelectItem value="USD">USD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="precio_base"
                                render={({ field }) => (
                                    <FormItem className="col-span-4">
                                        <FormLabel className="whitespace-nowrap">Precio Base</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isEdit ? 'Guardar Cambios' : 'Crear Servicio'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
