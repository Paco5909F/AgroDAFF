'use client'

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { saveOnboardingStep } from "@/server/onboarding"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Building2, Palette, Receipt, FileText, CheckCircle2, ChevronRight, ChevronLeft, Loader2, Upload, Check } from "lucide-react"
import { LogoUploader } from "@/components/ui/logo-uploader"

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
                window.location.href = '/'
            } else {
                toast.error(result.error as string)
            }
        })
    }

    const StepIcon = STEPS[currentStep].icon

    return (
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200/60 overflow-hidden transition-all duration-500">
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

            <div className="p-8 sm:p-10 relative">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-xl shadow-inner border border-emerald-100/50">
                        <StepIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">{STEPS[currentStep].title}</h2>
                        <p className="text-sm text-slate-500 mt-1">Paso {currentStep + 1} de {STEPS.length}</p>
                    </div>
                </div>

                <div className="space-y-6 min-h-[350px] relative z-10 transition-all duration-300">
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
                                <Label>Logo de Empresa</Label>
                                <div className="mt-2">
                                    <LogoUploader 
                                        empresaId={initialData.id} 
                                        currentLogoUrl={formData.logo_url} 
                                        isPremium={Boolean(initialData?.is_lifetime || initialData?.plan_status === 'PRO')}
                                        onUploadSuccess={(url) => handleChange('logo_url', url)}
                                    />
                                </div>
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
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-slate-700">Pie de Página Personalizado</Label>
                                    <Input 
                                        className="bg-white/50 focus:bg-white transition-colors"
                                        placeholder="Ej: AgroDAFF no se responsabiliza por..." 
                                        value={formData.pdf_footer} 
                                        onChange={e => handleChange('pdf_footer', e.target.value)} 
                                    />
                                    <p className="text-xs text-slate-400">Este texto aparecerá en la parte inferior de todos los PDFs generados.</p>
                                </div>
                            </div>
                            
                            {/* Animated Live Preview Mock */}
                            <div className="mt-2 lg:mt-0 border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg bg-slate-50/50 backdrop-blur-sm relative group transition-all duration-300 hover:shadow-xl">
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="bg-slate-800 p-2.5 flex items-center justify-between text-xs font-medium text-slate-300 border-b border-slate-700">
                                    <span className="flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Vista Previa del PDF</span>
                                    <div className="flex gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-400/80"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80"></div>
                                    </div>
                                </div>
                                <div className="p-8 bg-white flex flex-col items-center relative z-10 min-h-[300px] transform transition-transform duration-500 ease-out group-hover:scale-[1.02]">
                                    <div 
                                        className="w-20 h-20 rounded-xl mb-5 flex items-center justify-center text-white font-bold text-2xl shadow-md transition-all duration-500 ease-in-out"
                                        style={{ 
                                            backgroundColor: formData.pdf_primary_color || '#10b981', 
                                            backgroundImage: formData.logo_url ? `url(${formData.logo_url})` : 'none', 
                                            backgroundSize: 'cover',
                                            boxShadow: `0 10px 25px -5px ${formData.pdf_primary_color || '#10b981'}40`
                                        }}
                                    >
                                        {!formData.logo_url && (formData.nombre ? formData.nombre.slice(0, 2).toUpperCase() : '🏢')}
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-800 transition-colors">{formData.nombre || 'Nombre de tu Empresa'}</h3>
                                    <p className="text-sm text-slate-500 mt-1.5 transition-all">{formData.direccion || 'Dirección no especificada'} - {formData.ciudad || 'Ciudad'}</p>
                                    <p className="text-sm text-slate-500 mt-0.5">{formData.email || 'email@empresa.com'} | {formData.telefono || 'Teléfono'}</p>
                                    
                                    <div className="w-full h-px bg-slate-200 my-6 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-slate-400 to-transparent animate-shimmer"></div>
                                    </div>
                                    <p className="text-xs text-slate-400 text-center italic transition-all duration-300">{formData.pdf_footer || 'Documento generado automáticamente.'}</p>
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
