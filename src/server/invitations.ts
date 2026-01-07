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
        where: { id: user.id }
    })

    if (existingUser) {
        // User already has a profile/company?
        // If they belong to another company, this might be tricky.
        // For MVP, if they have a profile, we switch them? 
        // Or if they are "New" user without profile?
        // If they have profile and different company -> Error "Already in a company".
        if (existingUser.empresa_id) {
            throw new Error("You already belong to a company. Leave your current company first.")
        }

        // Update user
        await prisma.usuario.update({
            where: { id: user.id },
            data: {
                empresa_id: invitation.empresa_id,
                rol: invitation.rol,
                email: invitation.email // Sync email from invite
            }
        })
    } else {
        // Create user
        await prisma.usuario.create({
            data: {
                id: user.id,
                nombre: user.user_metadata?.nombre || user.email?.split('@')[0] || 'User',
                email: invitation.email,
                rol: invitation.rol,
                empresa_id: invitation.empresa_id
            }
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

    return await prisma.invitation.findMany({
        where: {
            empresa_id: empresaId,
            status: 'PENDING'
        },
        orderBy: { created_at: 'desc' }
    })
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
