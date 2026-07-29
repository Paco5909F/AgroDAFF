'use client'

import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Zap, AlertTriangle, ShieldCheck } from "lucide-react"
import Link from "next/link"

interface PlanLimitIndicatorProps {
    plan_status: string
    is_lifetime: boolean
    lotesCount: number
    maxLotes: number
}

export function PlanLimitIndicator({ plan_status, is_lifetime, lotesCount, maxLotes }: PlanLimitIndicatorProps) {
    if (is_lifetime || plan_status === 'PRO') {
        return (
            <div className="bg-emerald-900/5 border border-emerald-900/10 p-4 rounded-xl flex items-center justify-between mb-6 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-emerald-950">Plan {is_lifetime ? 'Vitalicio (VIP)' : 'PRO'} Activo</h4>
                        <p className="text-sm text-emerald-800/80">Límites desbloqueados. Cuentas con facturación AFIP y control agronómico total.</p>
                    </div>
                </div>
            </div>
        )
    }

    const percentage = Math.min((lotesCount / maxLotes) * 100, 100)
    const isNearingLimit = percentage >= 80

    return (
        <div className="bg-white border border-slate-200 p-5 rounded-2xl mb-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
            
            <div className="flex items-start gap-4 z-10 w-full">
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${isNearingLimit ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    {isNearingLimit ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                    ) : (
                        <Zap className="w-5 h-5 text-amber-500" />
                    )}
                </div>
                <div className="w-full">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        Plan FREE <span className="text-xs font-normal px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">Limitado</span>
                    </h4>
                    <p className="text-sm text-slate-500 mt-1 mb-3">
                        Has registrado {lotesCount} de {maxLotes} lotes permitidos.
                    </p>
                    <div className="flex items-center gap-3">
                        <Progress value={percentage} className="h-2 bg-slate-100 w-full" indicatorClassName={isNearingLimit ? 'bg-amber-500' : 'bg-slate-800'} />
                        <span className="text-xs font-medium text-slate-600 whitespace-nowrap">{percentage.toFixed(0)}%</span>
                    </div>
                </div>
            </div>

            <div className="z-10 mt-2 md:mt-0 flex-shrink-0 w-full md:w-auto">
                <Link href="/pricing" className="block w-full">
                    <Button className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-emerald-950 font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-105">
                        <Zap className="w-4 h-4 mr-2" fill="currentColor" />
                        Desbloquear PRO
                    </Button>
                </Link>
            </div>
        </div>
    )
}
