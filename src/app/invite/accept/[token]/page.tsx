import { acceptInvitation } from "@/server/invitations"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, XCircle } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AcceptInvitePage(
    props: {
        params: Promise<{ token: string }>
    }
) {
    const params = await props.params;

    const {
        token
    } = params;

    let success = false
    let message = ""

    try {
        await acceptInvitation(token)
        success = true
        message = "Te has unido exitosamente al equipo."
    } catch (error: any) {
        success = false
        message = error.message || "Error al aceptar invitación."
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 p-4">
            <div className="max-w-md w-full bg-background rounded-lg shadow-lg p-8 text-center space-y-6">
                <div className="flex justify-center">
                    {success ? (
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    ) : (
                        <XCircle className="h-16 w-16 text-red-500" />
                    )}
                </div>

                <h1 className="text-2xl font-bold">
                    {success ? "¡Bienvenido!" : "Error de Invitación"}
                </h1>

                <p className="text-muted-foreground">
                    {message}
                </p>

                <div className="pt-4">
                    <Button asChild className="w-full">
                        <Link href="/dashboard">Ir al Dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
