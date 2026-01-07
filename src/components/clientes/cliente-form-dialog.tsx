'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, MapPin } from 'lucide-react'

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
import { ClienteFormValues, clienteSchema } from '@/lib/validations/cliente'
import { createCliente, updateCliente } from '@/server/clientes'
import { createEstablecimiento, deleteEstablecimiento } from '@/server/establecimientos'
import { Separator } from '@/components/ui/separator'

interface ClienteFormDialogProps {
    cliente?: any // TODO: Type properly with Prisma types
    trigger?: React.ReactNode
}

export function ClienteFormDialog({ cliente, trigger }: ClienteFormDialogProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [newEstabl, setNewEstabl] = useState('')
    const [newModality, setNewModality] = useState('PROPIO')
    const isEditing = !!cliente

    const form = useForm<ClienteFormValues>({
        resolver: zodResolver(clienteSchema),
        defaultValues: {
            razon_social: cliente?.razon_social || '',
            cuit: cliente?.cuit || '',
            condicion_iva: cliente?.condicion_iva || '',
            email: cliente?.email || '',
            telefono: cliente?.telefono || '',
            persona_contacto: cliente?.persona_contacto || '',
            tipo_cliente: cliente?.tipo_cliente || '',
            localidad: cliente?.localidad || '',
            provincia: cliente?.provincia || '',
            observaciones: cliente?.observaciones || '',
            establecimiento_inicial: '',
            modalidad_inicial: 'PROPIO',
        },
    })

    async function onSubmit(data: ClienteFormValues) {
        startTransition(async () => {
            try {
                const result = isEditing
                    ? await updateCliente(cliente.id, data)
                    : await createCliente(data)

                if (result.success) {
                    toast.success(isEditing ? 'Cliente actualizado' : 'Cliente creado exitosamente')
                    setOpen(false)
                    form.reset()
                } else {
                    // Handle error properly (string or object)
                    const errorMsg = typeof result.error === 'string' ? result.error : 'Error en la operación'
                    toast.error(errorMsg)
                }
            } catch (error) {
                toast.error('Ocurrió un error inesperado')
            }
        })
    }

    const handleAddEstablecimiento = async () => {
        if (!newEstabl.trim() || !cliente?.id) return

        const result = await createEstablecimiento(cliente.id, newEstabl, newModality)
        if (result.success) {
            toast.success('Campo agregado')
            setNewEstabl('')
            // The list will update via revalidatePath from server action, 
            // but for immediate UI feedback we rely on parent refresh or just Optimistic UI? 
            // Since this is a server component child, revalidatePath should refresh the page prop 'data'.
        } else {
            toast.error(result.error || 'Error')
        }
    }

    const handleDeleteEstablecimiento = async (id: string) => {
        const result = await deleteEstablecimiento(id)
        if (result.success) {
            toast.success('Campo eliminado')
        } else {
            toast.error(result.error || 'Error')
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Cliente
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}</DialogTitle>
                    <DialogDescription>
                        {isEditing ? 'Modifica los datos y campos del cliente.' : 'Ingresa los datos personales y el campo principal.'}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="razon_social"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre y Apellido / Razón Social</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ej: Carlos Gómez" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="cuit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CUIT</FormLabel>
                                        <FormControl>
                                            <Input placeholder="20123456789" {...field} />
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
                                        <FormLabel>Cond. IVA</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Resp. Inscripto" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>

                        <Separator />

                        {/* Contacto & Operativo */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="persona_contacto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Persona de Contacto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Juan Pérez (Gerente)" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="tipo_cliente"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo de Cliente</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Productor, Acopio..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="localidad"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Localidad</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: O'Higgins" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="provincia"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provincia</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Buenos Aires" {...field} />
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
                                        <Input placeholder="Notas adicionales..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="contacto@ejemplo.com" {...field} />
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
                                        <FormLabel>Teléfono</FormLabel>
                                        <FormControl>
                                            <Input placeholder="+54 9 11..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Establishments Section */}
                        {!isEditing ? (
                            <div className="grid grid-cols-[1fr,140px] gap-4">
                                <FormField
                                    control={form.control}
                                    name="establecimiento_inicial"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Establecimiento (Principal)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ej: Estancia El Sol" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="modalidad_inicial"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Modalidad</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value || "PROPIO"}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="PROPIO" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="PROPIO">Propio</SelectItem>
                                                    <SelectItem value="ALQUILADO">Alquilado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ) : (
                            <div className="pt-2">
                                <Separator className="mb-4" />
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-4 h-4 text-emerald-600" />
                                    <h4 className="font-medium text-sm text-slate-800">Campos / Establecimientos</h4>
                                </div>

                                <div className="space-y-2 mb-3">
                                    {cliente.establecimientos?.map((est: any) => (
                                        <div key={est.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-md border border-slate-100 text-sm">
                                            <span className="text-slate-700 font-medium">
                                                {est.nombre} <span className="text-xs text-slate-400 font-normal">({est.modalidad || 'PROPIO'})</span>
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                onClick={() => handleDeleteEstablecimiento(est.id)}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    ))}
                                    {(!cliente.establecimientos || cliente.establecimientos.length === 0) && (
                                        <p className="text-xs text-slate-400 italic">No hay campos registrados.</p>
                                    )}
                                </div>

                                <div className="flex gap-2 items-end">
                                    <div className="flex-1">
                                        <Input
                                            placeholder="Nuevo Campo (Ej: San José)"
                                            value={newEstabl}
                                            onChange={(e) => setNewEstabl(e.target.value)}
                                            className="h-9 text-sm"
                                        />
                                    </div>
                                    <Select value={newModality} onValueChange={setNewModality}>
                                        <SelectTrigger className="w-[120px] h-9 text-sm">
                                            <SelectValue placeholder="Modalidad" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PROPIO">Propio</SelectItem>
                                            <SelectItem value="ALQUILADO">Alquilado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 h-9"
                                        onClick={handleAddEstablecimiento}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Agregar
                                    </Button>
                                </div>
                            </div>
                        )}

                        <DialogFooter className="mt-4">
                            <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
                                {isPending ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
