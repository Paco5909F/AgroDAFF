import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OnboardingForms } from "@/components/onboarding/onboarding-forms"

export default async function OnboardingPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <OnboardingForms />
        </div>
    )
}
