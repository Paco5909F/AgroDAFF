import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUserContextSafe } from "@/server/context"
import { SuscribeButton } from "@/components/pricing/suscribe-button"
import { Check, X } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function PricingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const ctx = await getUserContextSafe()
    if (!ctx) redirect('/onboarding')

    // Fetch billing status
    const { prisma } = await import("@/lib/prisma")
    const empresa = await prisma.empresa.findUnique({
        where: { id: ctx.empresaId },
        select: { plan_status: true, is_lifetime: true }
    })

    const isPro = empresa?.plan_status === 'PRO' || empresa?.is_lifetime

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4">
            <div className="max-w-5xl mx-auto text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                    Planes Simples, Sin Complicaciones
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Escala tu gestión agropecuaria a otro nivel. Elige el plan que se adapte al tamaño de tu operación.
                </p>

                {empresa?.is_lifetime && (
                    <div className="bg-amber-100 text-amber-800 p-4 rounded-lg inline-block border border-amber-200 mt-6">
                        🎉 Tienes habilitado el beneficio <strong>Amigos AgroDAFF (Lifetime)</strong>. Disfruta de la plataforma sin límites ni cargos.
                    </div>
                )}

                <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                    {/* FREE PLAN */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative">
                        {empresa?.plan_status === 'FREE' && !empresa.is_lifetime && (
                            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                                TU PLAN ACTUAL
                            </span>
                        )}
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Semilla (Free)</h2>
                        <p className="text-slate-500 mb-6">Ideal para pequeños productores probando la plataforma.</p>
                        <div className="text-4xl font-black text-slate-900 mb-8">
                            $0 <span className="text-lg text-slate-500 font-normal">/mes</span>
                        </div>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500"/> <span>Hasta 2 Usuarios</span></li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500"/> <span>Hasta 5 Lotes Acumulados</span></li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-emerald-500"/> <span>Límite de 5 Órdenes de Trabajo</span></li>
                            <li className="flex items-center gap-3"><X className="w-5 h-5 text-slate-300"/> <span className="text-slate-500">Soporte Prioritario</span></li>
                        </ul>
                        <button disabled className="w-full py-3 rounded-lg font-semibold bg-slate-100 text-slate-400">
                            {empresa?.plan_status === 'FREE' ? 'Plan Activo' : 'Incluido'}
                        </button>
                    </div>

                    {/* PRO PLAN */}
                    <div className="bg-emerald-900 rounded-3xl p-8 border border-emerald-800 shadow-2xl shadow-emerald-900/20 text-white relative transform md:-translate-y-4">
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-yellow-500 text-emerald-950 text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                            Recomendado
                        </span>
                        <h2 className="text-2xl font-bold mb-2">Cosecha (Pro)</h2>
                        <p className="text-emerald-200 mb-6">Para empresas que quieren el control total de sus campos.</p>
                        <div className="text-4xl font-black mb-8">
                            $25.000 <span className="text-lg text-emerald-300 font-normal">/mes</span>
                        </div>
                        <ul className="space-y-4 mb-8 text-emerald-100">
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-amber-400"/> <span>Usuarios Ilimitados</span></li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-amber-400"/> <span>Lotes y Órdenes Infinitas</span></li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-amber-400"/> <span>Facturación Electrónica AFIP</span></li>
                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-amber-400"/> <span>Soporte Prioritario VIP</span></li>
                        </ul>
                        
                        {isPro && !empresa?.is_lifetime ? (
                            <button disabled className="w-full py-3 rounded-lg font-bold bg-white text-emerald-900">
                                Tu plan actual
                            </button>
                        ) : !isPro && !empresa?.is_lifetime ? (
                            <div className="mt-auto">
                                <SuscribeButton />
                                <p className="text-xs text-center text-emerald-300 mt-3 flex items-center justify-center gap-1">
                                    Pago seguro procesado por MercadoPago
                                </p>
                            </div>
                        ) : (
                            <button disabled className="w-full py-3 rounded-lg font-bold bg-amber-400 text-emerald-950 opacity-90">
                                Acceso Vitalicio (VIP)
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
