'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, ShieldCheck, FileKey, AlertTriangle } from 'lucide-react'
import { updateEmpresaAfip } from '@/server/empresa'

interface AfipSettingsFormProps {
    initialData: any
}

export function AfipSettingsForm({ initialData }: AfipSettingsFormProps) {
    const [isPending, startTransition] = useTransition()
    const [cuit, setCuit] = useState(initialData?.afip_cuit || '')
    const [condicionIva, setCondicionIva] = useState(initialData?.condicion_iva || 'Responsable Inscripto')
    const [puntoVenta, setPuntoVenta] = useState(initialData?.afip_punto_venta_default || '')
    const [isProduction, setIsProduction] = useState(initialData?.afip_production_mode || false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        startTransition(async () => {
            const result = await updateEmpresaAfip({
                afip_cuit: cuit,
                condicion_iva: condicionIva,
                afip_punto_venta_default: puntoVenta ? Number(puntoVenta) : undefined,
                afip_production_mode: isProduction
            })

            if (result.success) {
                toast.success('Configuración Fiscal actualizada', {
                    description: 'Los datos de facturación se han guardado.'
                })
            } else {
                toast.error('Error al actualizar', {
                    description: result.error
                })
            }
        })
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'crt' | 'key') => {
        // Here we would implement real Supabase Storage upload
        // For phase 1, we will just show a UI message
        toast.info(`Carga de archivo .${type} iniciada.`, {
            description: "La subida segura de certificados está en desarrollo."
        })
    }

    return (
        <Card className="mt-8 border-slate-200">
            <CardHeader className="bg-slate-50 border-b pb-4">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-xl text-slate-800">Configuración Fiscal (AFIP)</CardTitle>
                </div>
                <CardDescription>
                    Configure las credenciales de su empresa para poder emitir Facturación Electrónica mediante los webservices de AFIP.
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>CUIT Emisor</Label>
                            <Input 
                                placeholder="Ej: 30123456789 (Sin guiones)" 
                                value={cuit}
                                onChange={(e) => setCuit(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Condición ante el IVA</Label>
                            <Select value={condicionIva} onValueChange={setCondicionIva}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione condición" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Responsable Inscripto">Responsable Inscripto</SelectItem>
                                    <SelectItem value="Monotributo">Monotributo</SelectItem>
                                    <SelectItem value="Exento">Exento</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Punto de Venta por Defecto</Label>
                            <Input 
                                type="number"
                                placeholder="Ej: 3" 
                                value={puntoVenta}
                                onChange={(e) => setPuntoVenta(e.target.value)}
                            />
                            <p className="text-xs text-slate-500">Debe estar habilitado para webservices en AFIP.</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Entorno de Emisión</Label>
                            <Select value={isProduction ? "production" : "testing"} onValueChange={(val) => setIsProduction(val === "production")}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="testing">Homologación (Testing)</SelectItem>
                                    <SelectItem value="production">Producción (Real)</SelectItem>
                                </SelectContent>
                            </Select>
                            {isProduction && (
                                <p className="text-xs text-amber-600 flex items-center gap-1 mt-1 font-medium">
                                    <AlertTriangle className="h-3 w-3" /> Las facturas generadas tendrán validez fiscal.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="pt-6 border-t">
                        <h4 className="text-sm font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <FileKey className="h-4 w-4 text-slate-500" />
                            Certificados Digitales
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border rounded-lg p-4 bg-slate-50 border-dashed">
                                <Label className="text-sm font-medium">Certificado (.crt)</Label>
                                <p className="text-xs text-slate-500 mb-3 mt-1">Sube el archivo CRT generado desde AFIP.</p>
                                <Input type="file" accept=".crt" onChange={(e) => handleFileUpload(e, 'crt')} className="bg-white" />
                                {initialData?.afip_crt_url && <p className="text-xs text-emerald-600 mt-2">✓ Certificado cargado</p>}
                            </div>
                            <div className="border rounded-lg p-4 bg-slate-50 border-dashed">
                                <Label className="text-sm font-medium">Clave Privada (.key)</Label>
                                <p className="text-xs text-slate-500 mb-3 mt-1">Sube la llave privada que generaste con OpenSSL.</p>
                                <Input type="file" accept=".key" onChange={(e) => handleFileUpload(e, 'key')} className="bg-white" />
                                {initialData?.afip_key_url && <p className="text-xs text-emerald-600 mt-2">✓ Llave cargada</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Guardar Configuración Fiscal
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}
