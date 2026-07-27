'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
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
import { registrarCobroFacturaAction, registrarPagoProveedorAction } from '@/server/tesoreria'

const formSchema = z.object({
    cuenta_bancaria_id: z.string().min(1, 'Requerido'),
    proveedor_id: z.string().optional().or(z.literal('')),
    monto: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, 'Debe ser mayor a 0'),
    concepto: z.string().min(2, 'Requerido'),
    fecha: z.string().min(1, 'Requerido'),
})

interface RegistrarMovimientoDialogProps {
    tipo: 'INGRESO' | 'EGRESO'
    cuentas: any[]
    proveedores: any[]
}

export function RegistrarMovimientoDialog({ tipo, cuentas, proveedores }: RegistrarMovimientoDialogProps) {
    const [open, setOpen] = useState(false)
    const isEgreso = tipo === 'EGRESO'

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cuenta_bancaria_id: '',
            proveedor_id: '',
            monto: '',
            concepto: isEgreso ? 'Pago a Proveedor' : 'Cobro de Factura',
            fecha: new Date().toISOString().split('T')[0],
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            if (isEgreso) {
                await registrarPagoProveedorAction({
                    cuenta_bancaria_id: values.cuenta_bancaria_id,
                    proveedor_id: values.proveedor_id!, // optional but usually required for pago
                    monto: Number(values.monto),
                    concepto: values.concepto,
                    fecha: new Date(values.fecha)
                })
                toast.success('Pago registrado correctamente')
            } else {
                await registrarCobroFacturaAction({
                    cuenta_bancaria_id: values.cuenta_bancaria_id,
                    monto: Number(values.monto),
                    concepto: values.concepto,
                    fecha: new Date(values.fecha)
                })
                toast.success('Cobro registrado correctamente')
            }
            setOpen(false)
            form.reset()
        } catch (error: any) {
            toast.error(error.message || 'Error al registrar movimiento')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={isEgreso ? "bg-amber-600 hover:bg-amber-700 w-full sm:w-auto" : "bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"}>
                    {isEgreso ? <ArrowUpRight className="mr-2 h-4 w-4" /> : <ArrowDownRight className="mr-2 h-4 w-4" />}
                    {isEgreso ? 'Registrar Pago' : 'Registrar Cobro'}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEgreso ? 'Nuevo Pago (Egreso)' : 'Nuevo Cobro (Ingreso)'}</DialogTitle>
                    <DialogDescription>
                        Complete los datos para impactar en el saldo de la cuenta.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="cuenta_bancaria_id"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Cuenta / Origen de Fondos</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione una cuenta..." />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {cuentas.map(c => (
                                                    <SelectItem key={c.id} value={c.id}>
                                                        {c.nombre} ({c.moneda})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {isEgreso && (
                                <FormField
                                    control={form.control}
                                    name="proveedor_id"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Proveedor</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Seleccione un proveedor..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {proveedores.map(p => (
                                                        <SelectItem key={p.id} value={p.id}>
                                                            {p.razon_social} ({p.cuit})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <FormField
                                control={form.control}
                                name="monto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Monto</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                name="concepto"
                                render={({ field }) => (
                                    <FormItem className="col-span-2">
                                        <FormLabel>Concepto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Detalle del movimiento..." {...field} />
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
                                {form.formState.isSubmitting ? 'Registrando...' : 'Registrar Movimiento'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
