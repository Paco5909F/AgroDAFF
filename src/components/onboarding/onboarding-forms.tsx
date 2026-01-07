'use client'

import { useFormStatus } from "react-dom"
import { useActionState } from "react" // React 19 / Next 15 (if available) or use custom hook
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createCompany, joinWithCode } from "@/server/onboarding"
import { Building2, UserPlus, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

// Submit Button Component
function SubmitButton({ text, icon: Icon }: { text: string, icon: any }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {pending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Icon className="w-4 h-4 mr-2" />}
            {text}
        </Button>
    )
}

export function OnboardingForms() {
    return (
        <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
            <CreateCompanyForm />
            <JoinCompanyForm />
        </div>
    )
}

function CreateCompanyForm() {
    async function clientAction(formData: FormData) {
        const result = await createCompany(formData)
        if (result?.error) {
            toast.error(result.error)
        }
    }

    return (
        <Card className="border-emerald-100 shadow-lg">
            <CardHeader>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Building2 className="w-6 h-6 text-emerald-700" />
                </div>
                <CardTitle className="text-2xl text-emerald-950">Crear mi Empresa</CardTitle>
                <CardDescription>
                    Soy dueño o administrador y quiero crear un nuevo espacio de trabajo.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={clientAction} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Nombre del Equipo / Empresa</label>
                        <Input name="nombre" placeholder="Ej: Agro Hermanos S.A." required minLength={3} />
                    </div>
                    <SubmitButton text="Crear y Comenzar" icon={Building2} />
                </form>
            </CardContent>
        </Card>
    )
}

function JoinCompanyForm() {
    async function clientAction(formData: FormData) {
        const result = await joinWithCode(formData)
        if (result?.error) {
            toast.error(result.error)
        }
    }

    return (
        <Card className="border-slate-100 shadow-lg">
            <CardHeader>
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mb-4">
                    <UserPlus className="w-6 h-6 text-slate-700" />
                </div>
                <CardTitle className="text-2xl text-slate-950">Unirme a un Equipo</CardTitle>
                <CardDescription>
                    Me han invitado a formar parte de una empresa existente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={clientAction} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Código de Invitación (Token)</label>
                        <Input name="token" placeholder="Pegar código aquí..." required />
                    </div>
                    <Button type="submit" variant="outline" className="w-full">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Unirse
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
