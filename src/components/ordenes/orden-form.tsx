'use client'

import { useState, useTransition, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { CalendarIcon, Check, ChevronsUpDown, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { v4 as uuidv4 } from 'uuid'
import { getOfflineDB } from '@/lib/offline/db'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { Calendar } from "@/components/ui/calendar"
import { Input } from '@/components/ui/input'
import { cn } from "@/lib/utils"

import { OrdenFormValues, ordenSchema } from '@/lib/validations/orden'
import { createOrden, updateOrden } from '@/server/ordenes'

interface OrdenFormProps {
    clientes: { id: string, razon_social: string }[]
    servicios: { id: string, nombre: string, unidad_medida: string, precio_base: number, moneda?: string }[]
    initialData?: any
    onSuccess?: () => void
    mode?: "create" | "edit"
}

export function OrdenForm({ clientes, servicios, initialData, onSuccess, mode = "create" }: OrdenFormProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<OrdenFormValues>({
        resolver: zodResolver(ordenSchema) as any,
        defaultValues: {
            cliente_id: initialData?.cliente_id || "",
            fecha: initialData?.fecha ? new Date(initialData.fecha) : new Date(),
            observaciones: initialData?.observaciones || "",
            moneda: initialData?.moneda || "ARS",
            total: initialData?.total ? Number(initialData.total) : 0,
            items: initialData?.items?.map((item: any) => ({
                servicio_id: item.servicio_id,
                cantidad: Number(item.cantidad),
                precio_unit: Number(item.precio_unit),
                kilometros: item.kilometros ? Number(item.kilometros) : undefined,
                total: Number(item.total),
                observaciones: item.observaciones
            })) || [
                    {
                        servicio_id: "",
                        cantidad: 0,
                        precio_unit: 0,
                        total: 0
                    }
                ]
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    })

    // Watch for automatic totals
    const items = form.watch("items")
    const formMoneda = form.watch("moneda")

    useEffect(() => {
        const total = items.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
        form.setValue("total", total)
    }, [items, form])

    async function onSubmit(data: OrdenFormValues) {
        if (typeof window !== 'undefined' && !navigator.onLine) {
            const db = getOfflineDB();
            if (db) {
                await db.pendingActions.add({
                    idempotencyKey: uuidv4(),
                    action: mode === "edit" ? 'UPDATE_ORDEN' as any : 'CREATE_ORDEN',
                    payload: mode === "edit" ? { id: initialData?.id, data } : data,
                    status: 'pending',
                    createdAt: Date.now()
                });
                toast.warning("Sin conexión: La Orden se guardó en la Cola de Sincronización Local.", { duration: 5000 });
                if (mode === "create") form.reset()
                if (onSuccess) onSuccess()
            }
            return;
        }

        startTransition(async () => {
            let result;
            if (mode === "edit" && initialData?.id) {
                result = await updateOrden(initialData.id, data)
            } else {
                result = await createOrden(data)
            }

            if (result.success) {
                toast.success(mode === "edit" ? 'Orden actualizada' : 'Orden creada exitosamente')
                if (mode === "create") form.reset()
                if (onSuccess) onSuccess()
            } else {
                toast.error(typeof result.error === 'string' ? result.error : 'Error de validación')
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                {/* HEADER: CLIENTE + FECHA + MONEDA */}
                {/* TOP FIELDS: CLIENTE | FECHA | MONEDA */}
                {/* TOP FIELDS: CLIENTE | FECHA | MONEDA */}
                {/* HEADER: CLIENTE + FECHA + MONEDA */}
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 grid grid-cols-12 gap-4">
                    <div className="col-span-12 md:col-span-6">
                        <FormField
                            control={form.control}
                            name="cliente_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-1.5">
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase">Cliente</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={cn("justify-between bg-white w-full border-slate-200 rounded-sm h-9", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value
                                                        ? clientes.find((cliente) => cliente.id === field.value)?.razon_social
                                                        : "Seleccione cliente"}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[300px] p-0">
                                            <Command>
                                                <CommandInput placeholder="Buscar cliente..." />
                                                <CommandList>
                                                    <CommandEmpty>No se encontró cliente.</CommandEmpty>
                                                    <CommandGroup>
                                                        {clientes.map((cliente) => (
                                                            <CommandItem
                                                                value={cliente.razon_social}
                                                                key={cliente.id}
                                                                onSelect={() => form.setValue("cliente_id", cliente.id)}
                                                            >
                                                                <Check
                                                                    className={cn("mr-2 h-4 w-4", cliente.id === field.value ? "opacity-100" : "opacity-0")}
                                                                />
                                                                {cliente.razon_social}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <FormField
                            control={form.control}
                            name="fecha"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-1.5">
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase">Fecha</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn("w-full pl-3 text-left font-normal bg-white border-slate-200 rounded-sm h-9", !field.value && "text-muted-foreground")}
                                                >
                                                    {field.value ? format(field.value, "PP", { locale: es }) : <span>Seleccione fecha</span>}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="col-span-12 md:col-span-4">
                        <FormField
                            control={form.control}
                            name="moneda"
                            render={({ field }) => (
                                <FormItem className="flex flex-col space-y-1.5">
                                    <FormLabel className="text-xs font-bold text-slate-500 uppercase">Moneda</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-white w-full border-slate-200 rounded-sm h-9 px-3 text-left">
                                                <SelectValue placeholder="Moneda" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="ARS">ARS ($)</SelectItem>
                                            <SelectItem value="USD">USD (u$s)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                {/* ITEMS SECTION */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="font-semibold text-slate-700">Ítems de la Orden</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ servicio_id: "", cantidad: 0, precio_unit: 0, total: 0 })}
                            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Servicio
                        </Button>
                    </div>

                    <div className="hidden md:block rounded-md border border-slate-200 overflow-hidden overflow-x-auto">
                        <Table className="table-fixed min-w-[900px]">
                            <TableHeader className="bg-emerald-50/50">
                                <TableRow>
                                    <TableHead className="w-[30%] text-xs font-bold text-slate-500 uppercase">Servicio</TableHead>
                                    <TableHead className="w-[12%] text-xs font-bold text-slate-500 uppercase">Km</TableHead>
                                    <TableHead className="w-[12%] text-xs font-bold text-slate-500 uppercase">Cant.</TableHead>
                                    <TableHead className="w-[20%] text-xs font-bold text-slate-500 uppercase">Precio</TableHead>
                                    <TableHead className="w-[20%] text-right text-xs font-bold text-slate-500 uppercase">Total</TableHead>
                                    <TableHead className="w-[6%]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fields.map((field, index) => {
                                    const cantidad = form.watch(`items.${index}.cantidad`) || 0
                                    const precio = form.watch(`items.${index}.precio_unit`) || 0
                                    const subtotal = cantidad * precio
                                    const formMoneda = form.watch("moneda")

                                    const selectedServiceId = form.watch(`items.${index}.servicio_id`)
                                    const selectedService = servicios.find(s => s.id === selectedServiceId)
                                    const requiresKm = selectedService?.unidad_medida?.toLowerCase().includes('km') || selectedService?.nombre?.toLowerCase().includes('flete')

                                    return (
                                        <TableRow key={field.id}>
                                            <TableCell className="p-1">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.servicio_id`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <Select
                                                                onValueChange={(val) => {
                                                                    field.onChange(val)
                                                                    const s = servicios.find(srv => srv.id === val)
                                                                    if (s) {
                                                                        const price = Number(s.precio_base)
                                                                        form.setValue(`items.${index}.precio_unit`, price)
                                                                        const qty = form.getValues(`items.${index}.cantidad`) || 0
                                                                        form.setValue(`items.${index}.total`, qty * price)
                                                                    }
                                                                }}
                                                                defaultValue={field.value}
                                                            >
                                                                <FormControl>
                                                                    <SelectTrigger className="h-9 w-full bg-white border-slate-200 rounded-sm focus:ring-emerald-400 focus:ring-1 focus:ring-offset-0 px-3 text-left">
                                                                        <SelectValue placeholder="Seleccionar..." className="truncate" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {servicios.map((s) => (
                                                                        <SelectItem key={s.id} value={s.id}>
                                                                            {s.nombre} ({s.unidad_medida})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.kilometros`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    {...field}
                                                                    className={`h-9 border-slate-200 rounded-sm px-3 ${!requiresKm ? "bg-slate-100/50 text-slate-300 shadow-none border-dashed" : "bg-white"}`}
                                                                    disabled={!requiresKm}
                                                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.cantidad`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    {...field}
                                                                    className="h-9 bg-white font-medium text-slate-700 border-slate-200 rounded-sm focus-visible:ring-emerald-400 focus-visible:ring-1 focus-visible:ring-offset-0 px-3"
                                                                    onChange={(e) => {
                                                                        const val = Number(e.target.value)
                                                                        field.onChange(val)
                                                                        const p = form.getValues(`items.${index}.precio_unit`) || 0
                                                                        form.setValue(`items.${index}.total`, val * p)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="p-1">
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.precio_unit`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0.00"
                                                                    {...field}
                                                                    className="h-9 bg-white font-medium text-slate-700 border-slate-200 rounded-sm focus-visible:ring-emerald-400 focus-visible:ring-1 focus-visible:ring-offset-0 px-3"
                                                                    onChange={(e) => {
                                                                        const val = Number(e.target.value)
                                                                        field.onChange(val)
                                                                        const q = form.getValues(`items.${index}.cantidad`) || 0
                                                                        form.setValue(`items.${index}.total`, val * q)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </TableCell>
                                            <TableCell className="text-right font-medium text-emerald-700">
                                                {formMoneda === 'USD' ? 'u$s' : '$'} {subtotal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => remove(index)}
                                                    className="text-slate-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {fields.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-slate-500 text-sm">
                                            No hay servicios agregados. Haz click en "Agregar Servicio".
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* MOBILE VIEW: CARDS */}
                    <div className="md:hidden space-y-4">
                        {fields.map((field, index) => {
                            const cantidad = form.watch(`items.${index}.cantidad`) || 0
                            const precio = form.watch(`items.${index}.precio_unit`) || 0
                            const subtotal = cantidad * precio
                            const formMoneda = form.watch("moneda")
                            const selectedServiceId = form.watch(`items.${index}.servicio_id`)
                            const selectedService = servicios.find(s => s.id === selectedServiceId)
                            const requiresKm = selectedService?.unidad_medida?.toLowerCase().includes('km') || selectedService?.nombre?.toLowerCase().includes('flete')

                            return (
                                <Card key={field.id} className="bg-slate-50/50">
                                    <CardContent className="p-4 space-y-4">
                                        {/* Service Selection */}
                                        <div className="space-y-1.5">
                                            <span className="text-xs font-bold text-slate-500 uppercase">Servicio</span>
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.servicio_id`}
                                                render={({ field }) => (
                                                    <FormItem className="space-y-0">
                                                        <Select
                                                            onValueChange={(val) => {
                                                                field.onChange(val)
                                                                const s = servicios.find(srv => srv.id === val)
                                                                if (s) {
                                                                    const price = Number(s.precio_base)
                                                                    form.setValue(`items.${index}.precio_unit`, price)
                                                                    const qty = form.getValues(`items.${index}.cantidad`) || 0
                                                                    form.setValue(`items.${index}.total`, qty * price)
                                                                }
                                                            }}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="h-9 w-full bg-white border-slate-200 rounded-sm px-3 text-left">
                                                                    <SelectValue placeholder="Seleccionar..." className="truncate" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {servicios.map((s) => (
                                                                    <SelectItem key={s.id} value={s.id}>
                                                                        {s.nombre} ({s.unidad_medida})
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* Grid for Numbers */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Km</span>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.kilometros`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    {...field}
                                                                    className={`h-9 border-slate-200 rounded-sm px-2 ${!requiresKm ? "bg-slate-100/50 border-dashed" : "bg-white"}`}
                                                                    disabled={!requiresKm}
                                                                    onChange={e => field.onChange(e.target.valueAsNumber)}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Cant.</span>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.cantidad`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0"
                                                                    {...field}
                                                                    className="h-9 bg-white border-slate-200 rounded-sm px-2"
                                                                    onChange={(e) => {
                                                                        const val = Number(e.target.value)
                                                                        field.onChange(val)
                                                                        const p = form.getValues(`items.${index}.precio_unit`) || 0
                                                                        form.setValue(`items.${index}.total`, val * p)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Precio</span>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.precio_unit`}
                                                    render={({ field }) => (
                                                        <FormItem className="space-y-0">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    placeholder="0.00"
                                                                    {...field}
                                                                    className="h-9 bg-white border-slate-200 rounded-sm px-2"
                                                                    onChange={(e) => {
                                                                        const val = Number(e.target.value)
                                                                        field.onChange(val)
                                                                        const q = form.getValues(`items.${index}.cantidad`) || 0
                                                                        form.setValue(`items.${index}.total`, val * q)
                                                                    }}
                                                                />
                                                            </FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <span className="text-xs font-bold text-slate-500 uppercase">Total</span>
                                                <div className="h-9 flex items-center px-2 font-bold text-emerald-700 bg-emerald-50/50 rounded-sm border border-emerald-100">
                                                    {formMoneda === 'USD' ? 'u$s' : '$'} {subtotal.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action */}
                                        <div className="flex justify-end pt-2 border-t border-slate-200/60">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Eliminar Ítem
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                        {fields.length === 0 && (
                            <div className="text-center py-8 text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-lg">
                                No hay servicios agregados.
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <div className="text-right">
                        <span className="text-sm text-slate-500 mr-2">Total Estimado:</span>
                        <span className="text-lg font-bold text-emerald-700">
                            {formMoneda === 'USD' ? 'u$s' : '$'}
                            {form.watch("total")?.toLocaleString()}
                        </span>
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observaciones Generales</FormLabel>
                            <FormControl>
                                <Input placeholder="..." {...field} className="bg-white border-slate-200 rounded-sm h-9" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
                    {isPending ? 'Guardando...' : (mode === 'edit' ? 'Actualizar Orden' : 'Registrar Orden')}
                </Button>
            </form >
        </Form >
    )
}
