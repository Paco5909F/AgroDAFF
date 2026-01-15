'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { updateEmpresaProfile } from '@/server/empresa'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2, Save, Building2 } from 'lucide-react'

const formSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    cuit: z.string().optional(),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    logo_url: z.string().url("URL de logo inválida").optional().or(z.literal(""))
})

type FormData = z.infer<typeof formSchema>

interface Props {
    initialData: any
}

export function EmpresaForm({ initialData }: Props) {
    const [isPending, startTransition] = useTransition()
    const [isUploading, setIsUploading] = useState(false)
    const supabase = createClient()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nombre: initialData.nombre || '',
            cuit: initialData.cuit || '',
            direccion: initialData.direccion || '',
            telefono: initialData.telefono || '',
            email: initialData.email || '',
            logo_url: initialData.logo_url || ''
        }
    })

    const onSubmit = (data: FormData) => {
        startTransition(async () => {
            const result = await updateEmpresaProfile(data)
            if (result.success) {
                toast.success("Perfil actualizado correctamente")
            } else {
                toast.error(result.error as string)
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-slate-500" />
                    <CardTitle>Perfil de Empresa</CardTitle>
                </div>
                <CardDescription>
                    Información visible en documentos PDF y reportes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="nombre">Razón Social *</Label>
                            <Input id="nombre" {...form.register('nombre')} />
                            {form.formState.errors.nombre && (
                                <p className="text-sm text-red-500">{form.formState.errors.nombre.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cuit">CUIT</Label>
                            <Input id="cuit" placeholder="XX-XXXXXXXX-X" {...form.register('cuit')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="direccion">Dirección</Label>
                            <Input id="direccion" {...form.register('direccion')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="telefono">Teléfono</Label>
                            <Input id="telefono" {...form.register('telefono')} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email de Contacto</Label>
                            <Input id="email" type="email" {...form.register('email')} />
                            {form.formState.errors.email && (
                                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="logo">Logo de la Empresa</Label>
                            <div className="flex flex-col gap-3">
                                {/* Preview */}
                                {form.watch('logo_url') ? (
                                    <div className="relative group w-32 h-32 border rounded-lg overflow-hidden flex items-center justify-center bg-slate-50">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={form.watch('logo_url') || ''}
                                            alt="Logo"
                                            className="max-w-full max-h-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => form.setValue('logo_url', '')}
                                            className="absolute top-1 right-1 bg-red-100 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-32 h-32 border border-dashed rounded-lg flex flex-col items-center justify-center text-slate-400 gap-2 bg-slate-50">
                                        <Upload className="h-8 w-8" />
                                        <span className="text-xs">Sin Logo</span>
                                    </div>
                                )}

                                {/* Inputs */}
                                <div className="flex flex-col gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        disabled={isUploading}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return

                                            setIsUploading(true)
                                            try {
                                                const fileExt = file.name.split('.').pop()
                                                const fileName = `logo-${initialData.id}-${Date.now()}.${fileExt}`
                                                const { data, error } = await supabase.storage
                                                    .from('logos')
                                                    .upload(fileName, file, {
                                                        upsert: true
                                                    })

                                                if (error) {
                                                    console.error(error)
                                                    throw new Error("Error al subir imagen. Verifique que el bucket 'logos' exista y sea público.")
                                                }

                                                const { data: { publicUrl } } = supabase.storage
                                                    .from('logos')
                                                    .getPublicUrl(fileName)

                                                form.setValue('logo_url', publicUrl)
                                                toast.success("Logo subido correctamente")
                                            } catch (error: any) {
                                                toast.error(error.message || "Error al subir imagen")
                                            } finally {
                                                setIsUploading(false)
                                            }
                                        }}
                                    />
                                    <p className="text-xs text-slate-500">
                                        Formatos: PNG, JPG. Máx 2MB.
                                        <br />
                                        <span className="text-amber-600/80 text-[10px]">Nota: Si falla, asegúrese de crear un bucket público llamado `logos` en Supabase.</span>
                                    </p>

                                    {/* Fallback URL Input */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400">O use URL directa:</span>
                                        <Input
                                            {...form.register('logo_url')}
                                            placeholder="https://..."
                                            className="h-8 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending}>
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            <Save className="mr-2 h-4 w-4" />
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
