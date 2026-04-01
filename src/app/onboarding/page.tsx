import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OnboardingForms } from "@/components/onboarding/onboarding-forms"

export default async function OnboardingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuario'

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 p-4 space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-light text-slate-800 tracking-tight">
                    Hola, <span className="font-semibold text-emerald-600">{name}</span>
                </h1>
                <p className="text-slate-500 text-lg font-light">
                    Comencemos a gestionar tu campo de manera inteligente.
                </p>
            </div>
            <OnboardingForms />
        </div>
    )
}
