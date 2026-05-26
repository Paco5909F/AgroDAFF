import Link from "next/link"
import { getProfileCompletion } from "@/server/onboarding"
import { AlertCircle, ChevronRight, CheckCircle2 } from "lucide-react"

export async function SetupBanner() {
    const { percentage, missing, isCompleted } = await getProfileCompletion()

    if (isCompleted) return null;

    return (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-4 py-3 shadow-sm border-b border-amber-700/20">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-100 shrink-0 mt-0.5 sm:mt-0" />
                    <div>
                        <p className="font-medium text-sm sm:text-base">
                            Completa tu perfil empresarial para desbloquear PDFs profesionales.
                        </p>
                        <p className="text-amber-100 text-xs sm:text-sm mt-0.5 flex items-center gap-2">
                            <span>Perfil {percentage}% completo</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-300 hidden sm:block"></span>
                            <span className="hidden sm:inline">
                                Faltan {missing.length} {missing.length === 1 ? 'dato' : 'datos'} clave.
                            </span>
                        </p>
                    </div>
                </div>

                <Link
                    href="/dashboard/onboarding"
                    className="shrink-0 bg-white/20 hover:bg-white/30 transition-colors border border-white/30 rounded-full px-4 py-1.5 text-sm font-semibold flex items-center gap-1.5"
                >
                    Completar ahora
                    <ChevronRight className="h-4 w-4" />
                </Link>
            </div>
        </div>
    )
}
