'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Building, Lock, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { toast } from 'sonner'
import { updateOrganizacionLogo } from '@/server/usuarios'

interface LogoUploaderProps {
    empresaId: string;
    currentLogoUrl?: string | null;
    isPremium?: boolean;
    onUploadSuccess?: (url: string) => void;
}

export function LogoUploader({ empresaId, currentLogoUrl, isPremium = true, onUploadSuccess }: LogoUploaderProps) {
    const [isUploadingLogo, setIsUploadingLogo] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null)

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isPremium) {
            toast.error('Función PRO: Actualiza tu suscripción para personalizar tu logo.')
            return
        }

        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error('Por favor selecciona una imagen válida')
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error('El logo no debe pesar más de 2MB')
            return
        }

        setIsUploadingLogo(true)
        try {
            const formData = new FormData()
            formData.append('file', file)

            const res = await fetch('/api/upload-logo', {
                method: 'POST',
                body: formData
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Failed to upload')
            }

            const data = await res.json()
            
            const updateRes = await updateOrganizacionLogo(empresaId, data.url)
            if (updateRes.success) {
                setPreviewUrl(data.url)
                if (onUploadSuccess) onUploadSuccess(data.url)
                toast.success('Logo actualizado exitosamente')
            } else {
                throw new Error(updateRes.error || "Error al actualizar logo")
            }
        } catch (error: any) {
            console.error('Logo upload error:', error)
            toast.error(error.message || 'Error al subir el logo')
        } finally {
            setIsUploadingLogo(false)
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 p-4 rounded-xl border border-slate-200/80 bg-slate-50/50">
            <div className="h-20 w-20 rounded-lg border border-slate-200 bg-white flex flex-col items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {previewUrl && isPremium ? (
                    <img src={previewUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : !isPremium ? (
                    <img src="/images/03-Isotipo.png" alt="AgroDAFF" className="w-full h-full object-contain p-2 opacity-80" />
                ) : (
                    <Building className="h-8 w-8 text-slate-300" />
                )}
            </div>
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-700">
                        Logotipo en Documentos y Reportes
                    </p>
                    {!isPremium && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs flex items-center gap-1 font-semibold">
                            <Lock className="w-3 h-3" /> Requiere PRO
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-slate-500">
                    {isPremium 
                        ? 'Sube el isotipo o logotipo de tu empresa para estamparlo en Órdenes de Trabajo, Presupuestos y Cartas de Porte.'
                        : 'En el plan Gratuito tus documentos llevan el logo oficial de AgroDAFF. Pasa a PRO para añadir el de tu empresa.'}
                </p>
                
                {isPremium ? (
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="relative overflow-hidden bg-white hover:bg-slate-50 shadow-xs border-slate-300"
                            disabled={isUploadingLogo}
                        >
                            {isUploadingLogo ? (
                                <span className="flex items-center gap-2 text-xs">
                                    <Upload className="h-3.5 w-3.5 animate-bounce" /> Subiendo...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-xs font-medium">
                                    <Upload className="h-3.5 w-3.5" /> Seleccionar Imagen
                                </span>
                            )}
                            <input 
                                type="file" 
                                accept="image/png,image/jpeg,image/webp,image/svg+xml" 
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                                onChange={handleLogoUpload}
                                disabled={isUploadingLogo}
                            />
                        </Button>
                        <span className="text-[11px] text-slate-400">PNG, SVG, JPG o WEBP (Máx 2MB)</span>
                    </div>
                ) : (
                    <div className="pt-1">
                        <Link href="/pricing">
                            <Button size="sm" variant="outline" className="text-xs border-emerald-500 text-emerald-700 hover:bg-emerald-50 gap-1.5 h-7">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                Desbloquear Logo con PRO
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
