'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload, Building, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { updateOrganizacionLogo } from '@/server/usuarios'

interface LogoUploaderProps {
    empresaId: string;
    currentLogoUrl?: string | null;
    onUploadSuccess?: (url: string) => void;
}

export function LogoUploader({ empresaId, currentLogoUrl, onUploadSuccess }: LogoUploaderProps) {
    const [isUploadingLogo, setIsUploadingLogo] = useState(false)
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentLogoUrl || null)

    const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

            // API ya utiliza el contexto de servidor (getUserContext) para seguridad
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
        <div className="flex items-center gap-6">
            <div className="h-20 w-20 rounded-md border border-slate-200 bg-slate-50 flex flex-col items-center justify-center overflow-hidden flex-shrink-0">
                {previewUrl ? (
                    <img src={previewUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                    <Building className="h-8 w-8 text-slate-300" />
                )}
            </div>
            <div className="flex-1 space-y-2">
                <p className="text-sm text-slate-500">
                    Sube tu logotipo para que aparezca en todos los PDFs (Órdenes, Liquidaciones, etc) generados por tu organización.
                </p>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="relative overflow-hidden"
                        disabled={isUploadingLogo}
                    >
                        {isUploadingLogo ? (
                            <span className="flex items-center gap-2">
                                <Upload className="h-4 w-4 animate-bounce" /> Subiendo...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Upload className="h-4 w-4" /> Seleccionar Archivo
                            </span>
                        )}
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
                            onChange={handleLogoUpload}
                            disabled={isUploadingLogo}
                        />
                    </Button>
                    <span className="text-xs text-slate-400">Recomendado: PNG fondo transparente (Max 2MB)</span>
                </div>
            </div>
        </div>
    )
}
