'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { saveOnboardingStep } from "@/server/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Palette, Receipt, FileText, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"

const STEPS = [
    { id: 'empresa', title: 'Datos de la Empresa', icon: Building2 },
    { id: 'branding', title: 'Branding', icon: Palette },
    { id: 'fiscal', title: 'Datos Fiscales', icon: Receipt },
    { id: 'pdf', title: 'Configuración PDF', icon: FileText }
]

export function SetupWizard({ initialData }: { initialData: any }) {
    const [currentStep, setCurrentStep] = useState(0)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const [formData, setFormData] = useState({
        nombre: initialData.nombre || '',
        direccion: initialData.direccion || '',
        ciudad: initialData.ciudad || '',
        provincia: initialData.provincia || '',
        codigo_postal: initialData.codigo_postal || '',
        telefono: initialData.telefono || '',
        email: initialData.email || '',
        logo_url: initialData.logo_url || '',
        pdf_primary_color: initialData.pdf_primary_color || '#10b981',
        cuit: initialData.cuit || initialData.afip_cuit || '',
        condicion_iva: initialData.condicion_iva || '',
        pdf_footer: initialData.pdf_footer || ''
    })

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1)
        }
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
        }
    }

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleFinish = () => {
        startTransition(async () => {
            const result = await saveOnboardingStep(formData)
            if (result.success) {
                toast.success('Perfil completado exitosamente')
                router.push('/')
            } else {
                toast.error(result.error as string)
            }
        })
    }

    const StepIcon = STEPS[currentStep].icon

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header Steps Progress */}
            <div className="flex border-b border-slate-100 bg-slate-50/50">
                {STEPS.map((step, index) => {
                    const isActive = index === currentStep
                    const isPassed = index < currentStep
                    return (
                        <div 
                            key={step.id} 
                            className={`flex-1 p-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                                isActive ? 'border-emerald-500 text-emerald-700 bg-white' : 
                                isPassed ? 'border-emerald-200 text-emerald-600 cursor-pointer hover:bg-emerald-50/50' : 
                                'border-transparent text-slate-400'
                            }`}
                            onClick={() => { if (isPassed) setCurrentStep(index) }}
                        >
                            <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                isActive || isPassed ? 'bg-emerald-100' : 'bg-slate-100'
                            }`}>
                                {isPassed ? <CheckCircle2 className="w-4 h-4" /> : (index + 1)}
                            </div>
                            <span className="font-medium text-sm hidden sm:block">{step.title}</span>
                        </div>
                    )
                })}
            </div>

            <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                        <StepIcon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800">{STEPS[currentStep].title}</h2>
                </div>

                <div className="space-y-6 min-h-[300px]">
                    {currentStep === 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Nombre de la Organización</Label>
                                <Input value={formData.nombre} onChange={e => handleChange('nombre', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Comercial</Label>
                                <Input type="email" value={formData.email} onChange={e => handleChange('email', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Teléfono</Label>
                                <Input value={formData.telefono} onChange={e => handleChange('telefono', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Dirección</Label>
                                <Input value={formData.direccion} onChange={e => handleChange('direccion', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Ciudad</Label>
                                <Input value={formData.ciudad} onChange={e => handleChange('ciudad', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Provincia</Label>
                                <Input value={formData.provincia} onChange={e => handleChange('provincia', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Código Postal</Label>
                                <Input value={formData.codigo_postal} onChange={e => handleChange('codigo_postal', e.target.value)} />
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>URL del Logo (Opcional por ahora)</Label>
                                <Input placeholder="https://..." value={formData.logo_url} onChange={e => handleChange('logo_url', e.target.value)} />
                                <p className="text-xs text-slate-400">Pega aquí la URL de tu logo. Pronto añadiremos subida de archivos directa.</p>
                            </div>
                            <div className="space-y-2">
                                <Label>Color Primario (Acento para PDFs)</Label>
                                <div className="flex items-center gap-3">
                                    <Input type="color" className="w-16 h-10 p-1 cursor-pointer" value={formData.pdf_primary_color} onChange={e => handleChange('pdf_primary_color', e.target.value)} />
                                    <Input className="w-32" value={formData.pdf_primary_color} onChange={e => handleChange('pdf_primary_color', e.target.value)} />
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>CUIT</Label>
                                <Input placeholder="20123456789" value={formData.cuit} onChange={e => handleChange('cuit', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Condición IVA</Label>
                                <Select value={formData.condicion_iva} onValueChange={v => handleChange('condicion_iva', v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Responsable Inscripto">Responsable Inscripto</SelectItem>
                                        <SelectItem value="Monotributo">Monotributo</SelectItem>
                                        <SelectItem value="Exento">Exento</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm flex gap-3">
                                <Receipt className="w-5 h-5 shrink-0" />
                                <p>Tus credenciales y certificados de AFIP se configuran desde la pestaña <strong>Configuración Fiscal</strong> en los Ajustes una vez termines de configurar tu perfil.</p>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Pie de Página Personalizado (Para Presupuestos y Órdenes)</Label>
                                <Input 
                                    placeholder="Ej: AgroDAFF no se responsabiliza por... | Gracias por confiar en nosotros." 
                                    value={formData.pdf_footer} 
                                    onChange={e => handleChange('pdf_footer', e.target.value)} 
                                />
                                <p className="text-xs text-slate-400">Este texto aparecerá en la parte inferior de todos los PDFs que generes para tus clientes.</p>
                            </div>
                            
                            {/* Preview Mock */}
                            <div className="mt-8 border rounded-xl overflow-hidden shadow-sm">
                                <div className="bg-slate-100 p-2 text-center text-xs font-medium text-slate-500 border-b">
                                    Vista Previa del PDF
                                </div>
                                <div className="p-6 bg-white flex flex-col items-center">
                                    <div 
                                        className="w-16 h-16 rounded mb-4 flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: formData.pdf_primary_color, backgroundImage: formData.logo_url ? `url(${formData.logo_url})` : 'none', backgroundSize: 'cover' }}
                                    >
                                        {!formData.logo_url && formData.nombre.slice(0, 2).toUpperCase()}
                                    </div>
                                    <h3 className="font-bold text-lg">{formData.nombre || 'Tu Empresa'}</h3>
                                    <p className="text-xs text-slate-500 mt-1">{formData.direccion || 'Dirección no especificada'} - {formData.ciudad || 'Ciudad'}</p>
                                    <p className="text-xs text-slate-500">{formData.email} | {formData.telefono}</p>
                                    
                                    <div className="w-full h-px bg-slate-200 my-4"></div>
                                    <p className="text-[10px] text-slate-400 text-center">{formData.pdf_footer || 'Documento generado automáticamente.'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 bg-slate-50 border-t flex justify-between items-center">
                <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0 || isPending}>
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Atrás
                </Button>

                {currentStep < STEPS.length - 1 ? (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleNext} disabled={isPending}>
                        Siguiente
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                ) : (
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleFinish} disabled={isPending}>
                        {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Finalizar Configuración
                        <CheckCircle2 className="w-4 h-4 ml-2" />
                    </Button>
                )}
            </div>
        </div>
    )
}
