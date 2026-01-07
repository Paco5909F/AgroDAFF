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
import { createMovimiento } from '@/server/stock'
import { getLotes } from '@/server/lotes'
import { getSilos } from '@/server/silos'

const movimientoSchema = z.object({
    fecha: z.string(),
    tipo: z.enum(['INGRESO', 'EGRESO']),
    producto: z.string().min(1, 'Producto requerido'),
    cantidad: z.coerce.number().min(0.01, 'Cantidad debe ser positiva'),
    lote_id: z.string().optional(),
    silo_id: z.string().optional(),
    observaciones: z.string().optional()
})

type MovimientoFormValues = z.infer<typeof movimientoSchema>

interface MovimientoDialogProps {
    trigger?: React.ReactNode
    onSuccess?: () => void
    defaultSiloId?: string
}

export function MovimientoDialog({ trigger, onSuccess, defaultSiloId }: MovimientoDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [lotes, setLotes] = useState<any[]>([])
    const [silos, setSilos] = useState<any[]>([])

    const form = useForm<MovimientoFormValues>({
        resolver: zodResolver(movimientoSchema) as any,
        defaultValues: {
            fecha: new Date().toISOString().split('T')[0],
            tipo: 'INGRESO',
            producto: 'Soja',
            cantidad: 0,
            silo_id: defaultSiloId || '',
            lote_id: '',
            observaciones: ''
        }
    })

    const tipo = form.watch('tipo')

    useEffect(() => {
        if (open) {
            getLotes().then(res => { if (res.success) setLotes(res.data || []) })
            getSilos().then(res => { if (res.success) setSilos(res.data || []) })
        }
    }, [open])

    function onSubmit(data: MovimientoFormValues) {
        if (!data.silo_id) {
            form.setError('silo_id', { message: 'Seleccione un silo' })
            return
        }
        if (data.tipo === 'INGRESO' && !data.lote_id) {
            form.setError('lote_id', { message: 'Seleccione un lote de origen' })
            return
        }

        startTransition(async () => {
            const result = await createMovimiento(data)
            if (result.success) {
                toast.success('Movimiento registrado')
                setOpen(false)
                form.reset()
                if (onSuccess) onSuccess()
            } else {
                toast.error(result.error as string)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline">Registrar Movimiento</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Registrar Movimiento de Stock</DialogTitle>
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
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="INGRESO">INGRESO (Cosecha)</SelectItem>
                                                <SelectItem value="EGRESO">EGRESO (Venta/Carga)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="producto"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cultivo / Producto</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Soja">Soja</SelectItem>
                                            <SelectItem value="Maiz">Maíz</SelectItem>
                                            <SelectItem value="Trigo">Trigo</SelectItem>
                                            <SelectItem value="Girasol">Girasol</SelectItem>
                                            <SelectItem value="Cebada">Cebada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="cantidad"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cantidad (Toneladas)</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="silo_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Silo / Almacenaje</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!defaultSiloId}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccione Silo..." />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {silos.map((s) => (
                                                <SelectItem key={s.id} value={s.id}>{s.nombre} ({s.establecimiento?.nombre})</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {tipo === 'INGRESO' && (
                            <FormField
                                control={form.control}
                                name="lote_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Origen (Lote)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione Lote..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {lotes.map((l) => (
                                                    <SelectItem key={l.id} value={l.id}>{l.nombre} ({l.establecimiento?.nombre})</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isPending}>
                                {isPending ? 'Guardando...' : 'Confirmar Movimiento'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
