'use server'

import { prisma } from "@/lib/prisma"
import { getUserContext } from "./context"
import { UserRole } from "@prisma/client"
import { addDays } from "date-fns"
import { createClient } from "@/lib/supabase/server"

export async function createInvitation(data: { email: string; rol: UserRole }) {
    const { empresaId, rol } = await getUserContext()

    if (rol !== 'ADMIN') {
        throw new Error("Unauthorized: Only Admins can create invitations")
    }

    // Check if user already exists in DB (by email if possible, though email is optional unique)
    const existingUser = await prisma.usuario.findFirst({
        where: { email: data.email }
    })

    if (existingUser) {
        throw new Error("User with this email already exists in the system.")
    }

    // Check if pending invitation exists
    const existingInvite = await prisma.invitation.findFirst({
        where: {
            email: data.email,
            empresa_id: empresaId,
            status: 'PENDING'
        }
    })

    if (existingInvite) {
        // Maybe refresh token? For now, just error.
        throw new Error("A pending invitation already exists for this email.")
    }

    const invitation = await prisma.invitation.create({
        data: {
            email: data.email,
            rol: data.rol,
            empresa_id: empresaId,
            expires_at: addDays(new Date(), 7), // 7 days expiry
            status: 'PENDING'
        }
    })

    // In a real app, we would send an email here using Resend/SendGrid.
    // For this MVP, we return the link to be copied manually.
    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/invite/accept/${invitation.token}`

    return { success: true, link: inviteLink }
}

export async function acceptInvitation(token: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Must be logged in to accept invitation")
    }

    const invitation = await prisma.invitation.findUnique({
        where: { token }
    })

    if (!invitation) {
        throw new Error("Invalid invitation token")
    }

    if (invitation.status !== 'PENDING') {
        throw new Error("Invitation already used or expired")
    }

    if (new Date() > invitation.expires_at) {
        throw new Error("Invitation expired")
    }

    // Check if user table record exists for this Auth ID
    const existingUser = await prisma.usuario.findUnique({
        where: { id: user.id },
        include: { miembros: true }
    })

    if (existingUser) {
        // Prevent duplicate membership
        const alreadyMember = existingUser.miembros.some(m => m.empresa_id === invitation.empresa_id)
        if (alreadyMember) {
            throw new Error("Ya eres miembro de esta empresa.")
        }

        // Add user to new company as Miembro and set it as active
        await prisma.$transaction(async (tx) => {
            await tx.miembro.create({
                data: {
                    usuario_id: user.id,
                    empresa_id: invitation.empresa_id,
                    rol: invitation.rol
                }
            })
            await tx.usuario.update({
                where: { id: user.id },
                data: { 
                    active_empresa_id: invitation.empresa_id,
                    email: invitation.email // Ensure email is synced
                }
            })
        })
    } else {
        // Create user and initial membership
        await prisma.$transaction(async (tx) => {
            await tx.usuario.create({
                data: {
                    id: user.id,
                    nombre: user.user_metadata?.nombre || user.email?.split('@')[0] || 'User',
                    email: invitation.email,
                    active_empresa_id: invitation.empresa_id,
                    empresa_id: invitation.empresa_id // Keep for legacy compatibility during transition
                }
            })
            await tx.miembro.create({
                data: {
                    usuario_id: user.id,
                    empresa_id: invitation.empresa_id,
                    rol: invitation.rol
                }
            })
        })
    }

    // Mark invitation as accepted
    await prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: 'ACCEPTED' }
    })

    return { success: true }
}

export async function getPendingInvitations() {
    const { empresaId, rol } = await getUserContext()
    if (rol !== 'ADMIN') return []

    const res = await prisma.invitation.findMany({
        where: {
            empresa_id: empresaId,
            status: 'PENDING'
        },
        orderBy: { created_at: 'desc' }
    })

    return res.map(i => ({
        ...i,
        created_at: i.created_at.toISOString(),
        expires_at: i.expires_at.toISOString()
    }))
}

export async function deleteInvitation(id: string) {
    const { empresaId, rol } = await getUserContext()
    if (rol !== 'ADMIN') throw new Error("Unauthorized")

    const result = await prisma.invitation.deleteMany({
        where: { id, empresa_id: empresaId }
    })

    if (result.count === 0) {
        throw new Error("Invitation not found or unauthorized")
    }

    return { success: true }
}
