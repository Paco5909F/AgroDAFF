'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, CalendarIcon, Check, ChevronsUpDown, Truck } from 'lucide-react'
import { format } from "date-fns"
import { es } from "date-fns/locale"
import * as z from "zod"

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

import { createCartaPorte, updateCartaPorte } from '@/server/cartas-porte'

// Zod Schema inline for speed as it's specific here
const cartaPorteSchema = z.object({
    cliente_id: z.string().min(1, "Seleccione un cliente"),
    ctg: z.string().min(1, "El CTG es obligatorio"),
    fecha_carga: z.date(),
    origen: z.string().min(1, "El origen es obligatorio"),
    destino: z.string().min(1, "El destino es obligatorio"),
    destinatario: z.string().optional(),
    corredor: z.string().optional(),
    chofer: z.string().min(1, "El chofer es obligatorio"),
    cuit_chofer: z.string().optional(),
    patente_camion: z.string().min(1, "Patente camión obligatoria"),
    patente_acoplado: z.string().optional(),
    kilos_estimados: z.coerce.number().positive("Kilos inválidos"),
    peso_tara: z.coerce.number().optional(),
    peso_bruto: z.coerce.number().optional(),
    observaciones: z.string().optional()
})

// Fix: use any for the form values to bypass strict resolver type mismatch
type CartaPorteFormValues = any


interface CartaPorteFormDialogProps {
    clientes: any[]
    initialData?: any // For editing
    trigger?: React.ReactNode // Custom trigger
    onClose?: () => void
}

export function CartaPorteFormDialog({ clientes, initialData, trigger, onClose }: CartaPorteFormDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<CartaPorteFormValues>({
        resolver: zodResolver(cartaPorteSchema) as any,
        defaultValues: {
            ctg: initialData?.ctg || "",
            origen: initialData?.origen || "Planta Principal - O'Higgins",
            destino: initialData?.destino || "",
            corredor: initialData?.corredor || "",
            destinatario: initialData?.destinatario || "",
            chofer: initialData?.chofer || "",
            cuit_chofer: initialData?.cuit_chofer || "",
            patente_camion: initialData?.patente_camion || "",
            patente_acoplado: initialData?.patente_acoplado || "",
            kilos_estimados: initialData?.kilos_estimados ? Number(initialData.kilos_estimados) : 0,
            peso_tara: initialData?.peso_tara ? Number(initialData.peso_tara) : 0,
            peso_bruto: initialData?.peso_bruto ? Number(initialData.peso_bruto) : 0,
            fecha_carga: initialData?.fecha_carga ? new Date(initialData.fecha_carga) : new Date(),
            cliente_id: initialData?.cliente_id || "",
            observaciones: initialData?.observaciones || "",
        },
    })

    async function onSubmit(data: CartaPorteFormValues) {
        startTransition(async () => {
            let result;
            if (initialData) {
                result = await updateCartaPorte(initialData.id, data)
            } else {
                result = await createCartaPorte(data)
            }

            if (result.success) {
                toast.success(initialData ? 'Carta de Porte actualizada' : 'Carta de Porte emitida')
                setOpen(false)
                if (onClose) onClose()
                if (!initialData) form.reset()
            } else {
                toast.error(result.error || 'Error al procesar')
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={(val) => {
            setOpen(val)
            if (!val && onClose) onClose()
        }}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg shadow-emerald-100 transition-all hover:scale-105">
                        <Truck className="mr-2 h-4 w-4" />
                        Nueva C.P.
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-light text-slate-700">
                        {initialData ? 'Editar Carta de Porte' : 'Emisión de Carta de Porte'}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">

                        {/* CLIENTE */}
                        <FormField
                            control={form.control}
                            name="cliente_id"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Titular / Cliente</FormLabel>
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
                                                        : "Seleccione titular"}
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

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="ctg"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CTG (Código Trazabilidad)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="12345678" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fecha_carga"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fecha Carga</FormLabel>
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
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date("1900-01-01")} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="origen"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Origen</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destino"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destino</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Punta Alvear..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="corredor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Corredor</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Sin Intervención" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="destinatario"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Destinatario</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nombre del Destinatario" {...field} value={field.value || ''} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="border-t border-slate-100 my-2 pt-4">
                            <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Datos del Transporte</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="chofer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Chofer</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nombre Completo" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="cuit_chofer"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CUIT Chofer</FormLabel>
                                            <FormControl>
                                                <Input placeholder="20-12345678-9" {...field} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="patente_camion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Patente Camión</FormLabel>
                                            <FormControl>
                                                <Input placeholder="AA 123 BB" className="uppercase" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="patente_acoplado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Patente Acoplado</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Opcional" className="uppercase" {...field} value={field.value || ''} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <FormField
                                control={form.control}
                                name="kilos_estimados"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kilos Estimados</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    field.onChange(val === '' ? 0 : Number(val))
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="peso_tara"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peso Tara</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    field.onChange(val === '' ? 0 : Number(val))
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="peso_bruto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Peso Bruto</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    field.onChange(val === '' ? 0 : Number(val))
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="observaciones"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observaciones</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Notas adicionales..." {...field} value={field.value || ''} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end pt-4">
                            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
                                {isPending ? 'Emitiendo...' : 'Emitir Carta de Porte'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
