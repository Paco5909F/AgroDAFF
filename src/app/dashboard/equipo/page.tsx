import { Suspense } from "react"
import { getTeamMembers, getCompanyInviteCode } from "@/server/team"
import { getPendingInvitations } from "@/server/invitations"
import { TeamManagementClient } from "@/components/team/team-management-client"
import { getUserContext } from "@/server/context"
import { redirect } from "next/navigation"

export default async function EquipoPage() {
    const { rol } = await getUserContext()



    const [users, invitations, inviteCode] = await Promise.all([
        getTeamMembers(),
        getPendingInvitations(),
        getCompanyInviteCode()
    ])

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Gestión de Equipo</h1>
                <p className="text-muted-foreground">
                    Administra los miembros de tu empresa y sus permisos.
                </p>
            </div>

            <Suspense fallback={<div>Cargando equipo...</div>}>
                <TeamManagementClient
                    initialUsers={users}
                    initialInvitations={invitations}
                    initialInviteCode={inviteCode}
                    currentUserRole={rol}
                />
            </Suspense>
        </div>
    )
}
