'use server'

import { prisma } from "@/lib/prisma"
import { getUserContext } from "./context"
import { UserRole } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function getTeamMembers() {
    const { empresaId, rol } = await getUserContext()

    // Only admins or people with DASHBOARD read access might see this?
    if (rol !== 'ADMIN') {
        throw new Error("Unauthorized")
    }

    const users = await prisma.usuario.findMany({
        where: {
            empresa_id: empresaId
        },
        orderBy: {
            nombre: 'asc'
        }
    })

    return users
}

export async function updateUserRole(userId: string, newRole: UserRole) {
    const { empresaId, rol } = await getUserContext()

    if (rol !== 'ADMIN') {
        throw new Error("Unauthorized")
    }

    // Prevent changing own role?
    const ctx = await getUserContext()
    if (ctx.userId === userId) {
        throw new Error("Cannot change your own role")
    }

    await prisma.usuario.update({
        where: { id: userId, empresa_id: empresaId },
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

    // In a real SaaS, we might Soft Delete or nullify empresa_id.
    // For now, let's just removing them from the company by setting empresa_id to null?
    // But schema says empresa_id is optional? Yes.
    // But we might want to hard delete them from 'Usuario' table so they can accept a new invite?
    // Let's hard delete from Usuario table. Auth remains, they will just be "User without profile".

    await prisma.usuario.delete({
        where: { id: userId, empresa_id: empresaId }
    })

    revalidatePath('/dashboard/equipo')
    return { success: true }
}
