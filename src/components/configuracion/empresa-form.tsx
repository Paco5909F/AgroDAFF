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
                                <div className="flex flex-col gap-4">
                                    {/* Enhanced Upload Area */}
                                    <div className="group relative">
                                        <div
                                            onClick={() => document.getElementById('logo-upload-trigger')?.click()}
                                            className={`
                                            relative flex flex-col items-center justify-center w-full h-40 
                                            border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                                            ${form.watch('logo_url') ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-emerald-400'}
                                        `}
                                        >
                                            {/* Hidden Input */}
                                            <Input
                                                id="logo-upload-trigger"
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
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

                                                        if (error) throw new Error("Error al subir imagen")

                                                        const { data: { publicUrl } } = supabase.storage
                                                            .from('logos')
                                                            .getPublicUrl(fileName)

                                                        form.setValue('logo_url', publicUrl)
                                                        toast.success("Logo actualizado")
                                                    } catch (error: any) {
                                                        toast.error("Error al subir imagen")
                                                    } finally {
                                                        setIsUploading(false)
                                                    }
                                                }}
                                            />

                                            {isUploading ? (
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" />
                                                    <span className="text-xs font-medium text-emerald-700">Subiendo...</span>
                                                </div>
                                            ) : form.watch('logo_url') ? (
                                                <>
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={form.watch('logo_url') || ''}
                                                        alt="Logo Empresa"
                                                        className="max-w-[80%] max-h-[80%] object-contain mb-2"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                                                        <span className="bg-white/90 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                                                            Cambiar Logo
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-emerald-600 transition-colors">
                                                    <div className="p-3 bg-white rounded-full shadow-sm border border-slate-100 group-hover:border-emerald-200 group-hover:shadow-md transition-all">
                                                        <Upload className="h-6 w-6" />
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="text-sm font-medium text-slate-600">Click para subir logo</span>
                                                        <p className="text-[10px] text-slate-400 mt-1">PNG, JPG (Máx 2MB)</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Remove Button (Only if logo exists) */}
                                        {form.watch('logo_url') && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    form.setValue('logo_url', '')
                                                }}
                                                className="absolute -top-2 -right-2 bg-white text-red-500 hover:text-red-600 p-1.5 rounded-full shadow-md border border-slate-100 transition-transform hover:scale-110"
                                                title="Eliminar logo"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* URL Input (Collapsible/Subtle) */}
                                    <div className="text-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <span className="w-full border-t border-slate-100" />
                                            </div>
                                            <div className="relative flex justify-center text-[10px] uppercase">
                                                <span className="bg-white px-2 text-slate-400">O mediante enlace</span>
                                            </div>
                                        </div>
                                        <Input
                                            {...form.register('logo_url')}
                                            placeholder="https://ejemplo.com/logo.png"
                                            className="mt-2 h-8 text-xs text-center border-dashed focus:border-solid bg-slate-50 focus:bg-white transition-all"
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
            </CardContent >
        </Card >
    )
}
