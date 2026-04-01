'use client'

import { useState, useTransition } from 'react'
import { Check, Loader2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createSubscription } from '@/server/billing'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface PricingClientProps {
    planStatus: string
}

export function PricingClient({ planStatus }: PricingClientProps) {
    const [isPending, startTransition] = useTransition()

    const handleSubscribe = () => {
        startTransition(async () => {
            const res = await createSubscription()
            if (res.success && res.init_point) {
                // Redirect to Mercado Pago
                window.location.href = res.init_point
            } else {
                toast.error(res.error || "Error al iniciar suscripción")
            }
        })
    }

    const isPro = ['PRO', 'LIFETIME', 'ENTERPRISE'].includes(planStatus)

    return (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 py-12">
            {/* FREE PLAN */}
            <Card className={cn("border-2 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg", !isPro ? "border-emerald-500 shadow-xl" : "border-slate-200")}>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Gratis</CardTitle>
                    <CardDescription>Para pequeños productores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                    <div className="text-4xl font-bold">$0 <span className="text-sm font-normal text-slate-500">/ mes</span></div>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-emerald-500" /> 1 Usuario</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-emerald-500" /> Lotes ilimitados</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-emerald-500" /> Stock Básico</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full" disabled={!isPro}>
                        {!isPro ? "Plan Actual" : "Degradar"}
                    </Button>
                </CardFooter>
            </Card>

            {/* PRO PLAN */}
            <Card className={cn("border-2 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden", isPro ? "border-emerald-500 shadow-xl" : "border-emerald-100")}>
                {isPro && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-3 py-1 rounded-bl-lg font-bold">ACTIVO</div>}
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-emerald-900">
                        {planStatus === 'LIFETIME' ? 'Plan Vitalicio' : 'Profesional'}
                    </CardTitle>
                    <CardDescription>
                        {planStatus === 'LIFETIME' ? 'Acceso total bonificado.' : 'Para escalar tu negocio.'}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                    <div className="text-4xl font-bold">$25.000 <span className="text-sm font-normal text-slate-500">/ mes</span></div>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-emerald-500" /> Usuarios ilimitados</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-emerald-500" /> Multi-Empresa</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-emerald-500" /> Reportes Avanzados</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-emerald-500" /> Soporte Prioritario</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button
                        className={cn("w-full bg-emerald-600 hover:bg-emerald-700", isPro && "bg-slate-100 text-slate-500 hover:bg-slate-200")}
                        onClick={handleSubscribe}
                        disabled={isPending || isPro}
                    >
                        {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (isPro ? "Tu Plan Actual" : "Suscribirme")}
                    </Button>
                </CardFooter>
            </Card>

            {/* ENTERPRISE PLAN */}
            <Card className="border-slate-200 bg-slate-50/50 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                    <CardDescription>Para grandes acopios.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 flex-1">
                    <div className="text-4xl font-bold">Consultar</div>
                    <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-slate-400" /> API Access</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-slate-400" /> Data Warehouse</li>
                        <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-slate-400" /> SLA Garantizado</li>
                    </ul>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        Contactar Ventas
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
