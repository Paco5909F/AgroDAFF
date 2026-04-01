'use server'

import { prisma } from "@/lib/prisma"
import { getUserContext } from "./context"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

// Refactored for Multi-Tenant (Miembro table)

export async function getTeamMembers() {
    const { empresaId } = await getUserContext()
    // Allow all members to view the team list

    const miembros = await prisma.miembro.findMany({
        where: {
            empresa_id: empresaId
        },
        include: {
            usuario: true
        },
        orderBy: {
            created_at: 'asc'
        }
    })

    // Map to the expected shape (flat user object with role)
    // The role comes from 'Miembro', not 'Usuario' (global role is ignored in favor of context role)
    const { email: currentUserEmail, userId: currentUserId } = await getUserContext()

    return Promise.all(miembros.map(async (m: any) => {
        let email = m.usuario.email

        // Self-healing: If this is the current user and DB email is missing, use context email and repair DB
        if (m.usuario.id === currentUserId && !email && currentUserEmail) {
            email = currentUserEmail
            try {
                // Only update if email is not taken by another user
                const existing = await prisma.usuario.findUnique({
                    where: { email: currentUserEmail }
                })
                if (!existing) {
                    await prisma.usuario.update({
                        where: { id: currentUserId },
                        data: { email: currentUserEmail }
                    })
                }
            } catch (err) {
                // Ignore silent repair errors
            }
        }

        return {
            id: m.usuario.id,
            nombre: m.usuario.nombre,
            email: email,
            rol: m.rol, // Context role
            created_at: m.created_at.toISOString() // Explicit string serialization
        }
    }))
}

export async function updateUserRole(userId: string, newRole: UserRole) {
    const { empresaId, rol } = await getUserContext()

    if (rol !== 'ADMIN') {
        throw new Error("Unauthorized")
    }

    const ctx = await getUserContext()
    if (ctx.userId === userId) {
        throw new Error("Cannot change your own role")
    }

    // Update ROLE on the Membership, not the User
    await prisma.miembro.update({
        where: {
            usuario_id_empresa_id: {
                usuario_id: userId,
                empresa_id: empresaId
            }
        },
        data: { rol: newRole }
    })

    revalidatePath('/dashboard/equipo')
    return { success: true }
}

export async function removeUser(userId: string) {
    const { empresaId, rol } = await getUserContext()

    if (rol !== 'ADMIN') throw new Error("Unauthorized")

    const ctx = await getUserContext()
    if (ctx.userId === userId) throw new Error("Cannot remove yourself")

    // Remove Membership
    await prisma.miembro.delete({
        where: {
            usuario_id_empresa_id: {
                usuario_id: userId,
                empresa_id: empresaId
            }
        }
    })

    // Optionally: Update active_empresa_id of that user if it was this one?
    // We can't easily do that without fetching user first, let's leave for now.

    revalidatePath('/dashboard/equipo')
    return { success: true }
}

export async function generateCompanyInviteCode() {
    const { empresaId, rol } = await getUserContext()
    if (rol !== 'ADMIN') throw new Error("Unauthorized")

    // Generate random code like "TEAM-X7Z2P9"
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase()
    const code = `TEAM-${randomString}`

    await prisma.empresa.update({
        where: { id: empresaId },
        data: { shared_invite_code: code }
    })

    revalidatePath('/dashboard/equipo')
    return { success: true, code }
}

export async function getCompanyInviteCode() {
    const { empresaId, rol } = await getUserContext()
    if (rol !== 'ADMIN') return null // Safely return null instead of throwing

    const empresa = await prisma.empresa.findUnique({
        where: { id: empresaId },
        select: { shared_invite_code: true }
    })

    return empresa?.shared_invite_code
}
