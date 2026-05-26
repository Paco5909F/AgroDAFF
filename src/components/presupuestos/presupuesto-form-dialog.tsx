'use client'

import { useState, useTransition, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, CalendarIcon, Check, ChevronsUpDown, Trash2 } from 'lucide-react'
import { format } from "date-fns"
import { es } from "date-fns/locale"

import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
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
    SelectGroup,
    SelectLabel
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
import { cn } from "@/lib/utils"

import { PresupuestoFormValues, presupuestoSchema } from '@/lib/validations/presupuesto'
import { createPresupuesto, updatePresupuesto } from '@/server/presupuestos'

interface PresupuestoFormDialogProps {
    clientes: any[]
    servicios: any[]
    insumos: any[]
    lotes: any[]
    presupuesto?: any // Optional budget to edit
    trigger?: React.ReactNode // Optional custom trigger
}

export function PresupuestoFormDialog({ clientes, servicios, insumos, lotes, presupuesto, trigger }: PresupuestoFormDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<PresupuestoFormValues>({
        resolver: zodResolver(presupuestoSchema) as any,
        defaultValues: {
            cliente_id: presupuesto?.cliente_id || "",
            lote_id: presupuesto?.lote_id || undefined,
            hectareas: presupuesto ? Number(presupuesto.hectareas) : 1,
            fecha: presupuesto?.fecha ? new Date(presupuesto.fecha) : new Date(),
            valido_hasta: presupuesto?.valido_hasta ? new Date(presupuesto.valido_hasta) : undefined,
            items: presupuesto?.items ? presupuesto.items.map((i: any) => ({
                tipo: i.tipo,
                referencia_id: i.referencia_id,
                nombre: i.nombre,
                unidad: i.unidad,
                cantidad: Number(i.cantidad),
                precio_unit: Number(i.precio_unit),
                subtotal: Number(i.subtotal),
                detalle: i.detalle || ""
            })) : [],
            total: presupuesto ? Number(presupuesto.total) : 0,
            total_final: presupuesto ? Number(presupuesto.total_final) : 0,
            observaciones: presupuesto?.observaciones || "",
        },
    })

    // Reset form when dialog opens/closes or presupuesto changes
    useEffect(() => {
        if (open) {
            form.reset({
                cliente_id: presupuesto?.cliente_id || "",
                lote_id: presupuesto?.lote_id || undefined,
                hectareas: presupuesto ? Number(presupuesto.hectareas) : 1,
                fecha: presupuesto?.fecha ? new Date(presupuesto.fecha) : new Date(),
                valido_hasta: presupuesto?.valido_hasta ? new Date(presupuesto.valido_hasta) : undefined,
                items: presupuesto?.items ? presupuesto.items.map((i: any) => ({
                    tipo: i.tipo,
                    referencia_id: i.referencia_id,
                    nombre: i.nombre,
                    unidad: i.unidad,
                    cantidad: Number(i.cantidad),
                    precio_unit: Number(i.precio_unit),
                    subtotal: Number(i.subtotal),
                    detalle: i.detalle || ""
                })) : [],
                total: presupuesto ? Number(presupuesto.total) : 0,
                total_final: presupuesto ? Number(presupuesto.total_final) : 0,
                observaciones: presupuesto?.observaciones || "",
            })
        }
    }, [open, presupuesto, form])

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    // Watch items to calculate totals
    const items = form.watch("items")
    const hectareas = form.watch("hectareas") || 1

    // Update Totals when items or hectareas change
    useEffect(() => {
        if (!items) return

        let newTotal = 0
        items.forEach((item, index) => {
            const qty = Number(item.cantidad) || 0
            const price = Number(item.precio_unit) || 0
            const sub = qty * price
            newTotal += sub
            if (form.getValues(`items.${index}.subtotal`) !== sub) {
                 form.setValue(`items.${index}.subtotal`, sub, { shouldValidate: false })
            }
        })
        form.setValue("total", Number(newTotal.toFixed(2)))
        form.setValue("total_final", Number((newTotal * hectareas).toFixed(2)))
    }, [JSON.stringify(items), hectareas, form])

    const handleItemChange = (index: number, itemId: string) => {
        // Try to find in servicios first, then insumos
        const service = servicios.find(s => s.id === itemId)
        if (service) {
            form.setValue(`items.${index}.tipo`, "servicio")
            form.setValue(`items.${index}.referencia_id`, service.id)
            form.setValue(`items.${index}.nombre`, service.nombre)
            form.setValue(`items.${index}.unidad`, service.unidad_medida || "unidad")
            form.setValue(`items.${index}.precio_unit`, Number(service.precio_base))
            return
        }

        const insumo = insumos.find(i => i.id === itemId)
        if (insumo) {
            form.setValue(`items.${index}.tipo`, "insumo")
            form.setValue(`items.${index}.referencia_id`, insumo.id)
            form.setValue(`items.${index}.nombre`, insumo.nombre)
            form.setValue(`items.${index}.unidad`, insumo.unidad_medida || "unidad")
            form.setValue(`items.${index}.precio_unit`, Number(insumo.precio_actual))
        }
    }

    async function onSubmit(data: PresupuestoFormValues) {
        const formattedData = {
            ...data,
            items: data.items.map(item => ({
                ...item,
                subtotal: (Number(item.cantidad) || 0) * (Number(item.precio_unit) || 0)
            }))
        }

        startTransition(async () => {
            let result;
            if (presupuesto) {
                result = await updatePresupuesto(presupuesto.id, formattedData)
            } else {
                result = await createPresupuesto(formattedData)
            }

            if (result.success) {
                toast.success(presupuesto ? 'Presupuesto actualizado' : 'Presupuesto creado con éxito')
                setOpen(false)
                if (!presupuesto) {
                    form.reset()
                }
            } else {
                toast.error(typeof result.error === 'string' ? result.error : 'Error al guardar')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-100 transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Presupuesto
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-light text-slate-700">Nuevo Presupuesto</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">

                        {/* HEADERS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* CLIENTE */}
                            <FormField
                                control={form.control}
                                name="cliente_id"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Cliente</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant="outline"
                                                        role="combobox"
                                                        className={cn(
                                                            "w-full justify-between",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value
                                                            ? clientes.find(
                                                                (cliente) => cliente.id === field.value
                                                            )?.razon_social
                                                            : "Seleccione cliente"}
                                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                                <Command>
                                                    <CommandInput placeholder="Buscar cliente..." />
                                                    <CommandList>
                                                        <CommandEmpty>No se encontró cliente.</CommandEmpty>
                                                        <CommandGroup>
                                                            {clientes.map((cliente) => (
                                                                <CommandItem
                                                                    value={cliente.razon_social}
                                                                    key={cliente.id}
                                                                    onSelect={() => {
                                                                        form.setValue("cliente_id", cliente.id)
                                                                    }}
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            cliente.id === field.value
                                                                                ? "opacity-100"
                                                                                : "opacity-0"
                                                                        )}
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

                            {/* FECHA */}
                            <FormField
                                control={form.control}
                                name="fecha"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha Emisión</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione fecha</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* VALIDO HASTA */}
                            <FormField
                                control={form.control}
                                name="valido_hasta"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Válido Hasta (Opcional)</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                        {field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione fecha</span>}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value || undefined}
                                                    onSelect={field.onChange}
                                                    disabled={(date) => date < new Date("1900-01-01")}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* LOTE Y HECTAREAS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="lote_id"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Lote (Opcional)</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccione un lote" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {lotes.map((lote) => (
                                                    <SelectItem key={lote.id} value={lote.id}>
                                                        {lote.nombre} {lote.establecimiento ? `(${lote.establecimiento.nombre})` : ''}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="hectareas"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Hectáreas</FormLabel>
                                        <FormControl>
                                            <Input type="number" step="0.01" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* ITEMS SECTION */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-slate-700">Ítems del Presupuesto</h4>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ tipo: "servicio", referencia_id: "", nombre: "", unidad: "unidad", cantidad: 1, precio_unit: 0, subtotal: 0, detalle: "" })}
                                    className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Agregar Ítem
                                </Button>
                            </div>

                            <div className="rounded-xl border border-slate-100 bg-white shadow-sm overflow-hidden divide-y divide-slate-100">
                                {fields.length === 0 && (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        No hay ítems. Agregue uno para comenzar.
                                    </div>
                                )}
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-3 bg-white hover:bg-slate-50/50 transition-colors grid grid-cols-12 gap-2 items-end">
                                        {/* ITEM SELECT */}
                                        <div className="col-span-12 md:col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.referencia_id`}
                                                render={({ field }) => (
                                                    <FormItem className="mb-2">
                                                        <FormLabel className="text-xs text-slate-500">Ítem (Servicio o Insumo)</FormLabel>
                                                        <Select
                                                            onValueChange={(val) => {
                                                                field.onChange(val);
                                                                handleItemChange(index, val);
                                                            }}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="h-9">
                                                                    <SelectValue placeholder="Seleccione..." />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectGroup>
                                                                    <SelectLabel>Servicios</SelectLabel>
                                                                    {servicios.map((s) => (
                                                                        <SelectItem key={s.id} value={s.id}>
                                                                            {s.nombre} ({s.unidad_medida})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                                <SelectGroup>
                                                                    <SelectLabel>Insumos</SelectLabel>
                                                                    {insumos.map((i) => (
                                                                        <SelectItem key={i.id} value={i.id}>
                                                                            {i.nombre} ({i.unidad_medida})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectGroup>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.detalle`}
                                                render={({ field }) => (
                                                    <FormItem className="mb-0">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Detalle (opcional)"
                                                                className="h-8 text-xs"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        {/* QUANTITY */}
                                        <div className="col-span-4 md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.cantidad`}
                                                render={({ field }) => {
                                                    const unitLower = form.watch(`items.${index}.unidad`)?.toLowerCase() || "";
                                                    let quantityLabel = "Cant.";

                                                    if (unitLower.includes("km")) quantityLabel = "Kms";
                                                    else if (unitLower.includes("ha")) quantityLabel = "Has";
                                                    else if (unitLower === "tn" || unitLower.includes("ton")) quantityLabel = "Tns";

                                                    return (
                                                        <FormItem className="mb-0">
                                                            <FormLabel className="text-xs text-slate-500">{quantityLabel}</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    className="h-9"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    );
                                                }}
                                            />
                                        </div>

                                        {/* PRICE */}
                                        <div className="col-span-4 md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.precio_unit`}
                                                render={({ field }) => {
                                                    const currentId = form.watch(`items.${index}.referencia_id`);
                                                    const selectedService = servicios.find(s => s.id === currentId);
                                                    const selectedInsumo = insumos.find(i => i.id === currentId);
                                                    const basePrice = selectedService ? Number(selectedService.precio_base) : (selectedInsumo ? Number(selectedInsumo.precio_actual) : null);
                                                    const isModified = basePrice !== null && Math.abs(Number(field.value) - basePrice) > 0.01;

                                                    return (
                                                        <FormItem className="mb-0">
                                                            <div className="flex justify-between items-baseline">
                                                                <FormLabel className="text-xs text-slate-500">Precio</FormLabel>
                                                                {basePrice !== null && isModified && (
                                                                    <span className="text-[10px] text-amber-600 font-medium">
                                                                        Lista: ${basePrice}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    step="0.01"
                                                                    className={cn(
                                                                        "h-9",
                                                                        isModified && "border-amber-300 bg-amber-50/30 text-amber-900"
                                                                    )}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )
                                                }}
                                            />
                                        </div>

                                        {/* SUBTOTAL (Read only visual) */}
                                        <div className="col-span-3 md:col-span-2 pb-[5px]">
                                            <label className="text-xs font-medium text-slate-500 block mb-2">Subtotal</label>
                                            <div className="h-9 flex items-center px-3 text-sm font-medium text-slate-700 bg-slate-100 rounded-md">
                                                ${((Number(form.watch(`items.${index}.cantidad`)) || 0) * (Number(form.watch(`items.${index}.precio_unit`)) || 0)).toFixed(2)}
                                            </div>
                                        </div>

                                        {/* REMOVE */}
                                        <div className="col-span-1 flex justify-end pb-1">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {form.formState.errors.items && (
                                <p className="text-sm font-medium text-red-500">{form.formState.errors.items.message}</p>
                            )}
                        </div>

                        {/* TOTAL */}
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <FormField
                                control={form.control}
                                name="observaciones"
                                render={({ field }) => (
                                    <FormItem className="col-span-1">
                                        <FormLabel>Observaciones</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Notas..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="total"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-emerald-700">Total Estimado</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="bg-emerald-50 text-xl font-bold text-emerald-800 text-right" {...field} readOnly />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="total_final"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold text-emerald-700">Total Final (x Ha)</FormLabel>
                                        <FormControl>
                                            <Input type="number" className="bg-emerald-100 text-xl font-bold text-emerald-900 text-right" {...field} readOnly />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full md:w-auto" disabled={isPending}>
                                {isPending ? 'Guardando...' : 'Guardar Presupuesto'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
