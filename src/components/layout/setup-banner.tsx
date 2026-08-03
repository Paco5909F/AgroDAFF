import Link from "next/link"
import { getProfileCompletion } from "@/server/onboarding"
import { AlertCircle, ChevronRight, CheckCircle2, Sparkles } from "lucide-react"

export async function SetupBanner() {
    try {
        const { percentage, missing, isCompleted } = await getProfileCompletion()

        if (isCompleted) return null;

        return (
        <div className="relative overflow-hidden bg-slate-900 text-white px-4 py-3 shadow-lg border-b border-slate-800">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-blue-500/20 to-purple-600/20 animate-gradient-x opacity-50"></div>
            
            <div className="relative max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 z-10">
                <div className="flex items-start sm:items-center gap-3">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 bg-emerald-500 rounded-full blur animate-pulse opacity-50"></div>
                        <AlertCircle className="h-5 w-5 text-emerald-400 shrink-0 relative z-10 mt-0.5 sm:mt-0" />
                    </div>
                    <div>
                        <p className="font-medium text-sm sm:text-base text-slate-100 flex items-center gap-2">
                            Completa tu perfil empresarial para desbloquear funciones PRO
                            <Sparkles className="w-4 h-4 text-amber-400" />
                        </p>
                        <div className="flex items-center gap-3 mt-1.5">
                            {/* Progress Bar Micro-UI */}
                            <div className="hidden sm:flex items-center gap-2">
                                <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000 ease-out" 
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-xs font-mono text-emerald-400">{percentage}%</span>
                            </div>
                            
                            <span className="w-1 h-1 rounded-full bg-slate-600 hidden sm:block"></span>
                            
                            <p className="text-slate-400 text-xs sm:text-sm">
                                Faltan {missing.length} {missing.length === 1 ? 'dato' : 'datos'} clave.
                            </p>
                        </div>
                    </div>
                </div>

                <Link
                    href="/setup"
                    className="shrink-0 group relative inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white transition-all duration-300 ease-out bg-white/10 border border-white/20 rounded-full hover:bg-white/20 hover:border-white/40 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900"
                >
                    <span>Completar ahora</span>
                    <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 text-emerald-400" />
                </Link>
            </div>
        </div>
    )
    } catch {
        return null
    }
}
