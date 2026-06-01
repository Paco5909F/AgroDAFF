'use server'

import { getUserContext } from "./context"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { EmpresaService } from "./services/empresa.service"

export async function getTeamMembers() {
    const { empresaId, email: currentUserEmail, userId: currentUserId } = await getUserContext()

    const miembros = await EmpresaService.getTeamMembers(empresaId)

    return Promise.all(miembros.map(async (m: any) => {
        let email = m.usuario.email

        if (m.usuario.id === currentUserId && !email && currentUserEmail) {
            email = currentUserEmail
            try {
                await EmpresaService.repairMissingEmail(currentUserId, currentUserEmail)
            } catch (err) {
            }
        }

        return {
            id: m.usuario.id,
            nombre: m.usuario.nombre,
            email: email,
            rol: m.rol, 
            created_at: m.created_at.toISOString() 
        }
    }))
}

export async function updateUserRole(userId: string, newRole: UserRole) {
    const { empresaId, rol, userId: currentUserId } = await getUserContext()

    if (rol !== 'ADMIN') {
        throw new Error("Unauthorized")
    }

    if (currentUserId === userId) {
        throw new Error("Cannot change your own role")
    }

    await EmpresaService.updateUserRole(userId, empresaId, newRole)

    revalidatePath('/dashboard/equipo')
    return { success: true }
}

export async function removeUser(userId: string) {
    const { empresaId, rol, userId: currentUserId } = await getUserContext()

    if (rol !== 'ADMIN') throw new Error("Unauthorized")
    if (currentUserId === userId) throw new Error("Cannot remove yourself")

    await EmpresaService.removeUser(userId, empresaId)

    revalidatePath('/dashboard/equipo')
    return { success: true }
}

export async function generateCompanyInviteCode() {
    const { empresaId, rol } = await getUserContext()
    if (rol !== 'ADMIN') throw new Error("Unauthorized")

    const code = await EmpresaService.generateCompanyInviteCode(empresaId)

    revalidatePath('/dashboard/equipo')
    return { success: true, code }
}

export async function getCompanyInviteCode() {
    const { empresaId, rol } = await getUserContext()
    if (rol !== 'ADMIN') return null 

    return EmpresaService.getCompanyInviteCode(empresaId)
}
