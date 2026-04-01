'use server'

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export type UserContext = {
    userId: string
    empresaId: string
    rol: string
    email?: string
}

export async function getCompanyId(): Promise<string> {
    const ctx = await getUserContext()
    return ctx.empresaId
}

// Internal helper to avoid code duplication
async function resolveUserContext() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return { user: null, dbUser: null }
    }

    const dbUser = await prisma.usuario.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            active_empresa_id: true,
            rol: true,
            empresa_id: true,
            miembros: {
                include: { empresa: true }
            }
        }
    })

    return { user, dbUser }
}

export async function getUserContextSafe(): Promise<UserContext | null> {
    const { user, dbUser } = await resolveUserContext()

    if (!user || !dbUser) return null

    // A. DETERMINE TARGET COMPANY
    let targetEmpresaId = dbUser.active_empresa_id
    const isSuperAdmin = user.email === 'admin@eltrisquel.com'
    const isValidMember = dbUser.miembros.some(m => m.empresa_id === targetEmpresaId)

    if (targetEmpresaId && !isValidMember && !isSuperAdmin) {
        targetEmpresaId = null
    }

    if (!targetEmpresaId && dbUser.miembros.length > 0) {
        targetEmpresaId = dbUser.miembros[0].empresa_id
        // We probably shouldn't mutate state (update) in a 'get' call if it's supposed to be side-effect free, 
        // but the original logic did it. Let's keep it for consistency or move it.
        // For "Safe" context, maybe we verify but don't force update? 
        // Let's stick to the original behavior: auto-healing is useful.
        try {
            await prisma.usuario.update({
                where: { id: user.id },
                data: { active_empresa_id: targetEmpresaId }
            })
        } catch (e) { console.error("Auto-heal failed", e) }
    }

    if (!targetEmpresaId && dbUser.empresa_id) {
        targetEmpresaId = dbUser.empresa_id
    }

    // Super Admin fallbacks
    if (isSuperAdmin) {
        if (targetEmpresaId) {
            const exists = await prisma.empresa.findUnique({ where: { id: targetEmpresaId }, select: { id: true } })
            if (!exists) targetEmpresaId = null
        }
        if (!targetEmpresaId) {
            const firstCompany = await prisma.empresa.findFirst()
            if (firstCompany) {
                targetEmpresaId = firstCompany.id
                // SECURITY FIX: Do not permanently mutate active_empresa_id for superadmins falling back to a company.
            }
        }
    }

    if (!targetEmpresaId) return null

    const finalMembership = dbUser.miembros.find(m => m.empresa_id === targetEmpresaId)

    return {
        userId: dbUser.id,
        empresaId: targetEmpresaId,
        // @ts-ignore
        rol: isSuperAdmin ? 'ADMIN' : (finalMembership ? finalMembership.rol : (dbUser.rol || 'LECTOR')),
        email: user.email
    }
}

// @ts-ignore
export async function getUserContext(): Promise<UserContext> {
    const ctx = await getUserContextSafe()

    if (!ctx) {
        // We know why it failed? 
        // If no user -> login. If no company -> onboarding.
        // Since we can't easily distinguish from 'Safe' result without more return info:
        // We will do a quick check or just standard redirect flow.
        // Actually, let's replicate the redirects:
        // If not logged in -> redirect('/login') 
        // If logged in but no company -> redirect('/onboarding')

        // RE-CHECK to decide where to send
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) redirect('/login')

        // If we are here, user exists but no context -> Onboarding
        redirect('/onboarding')
    }

    return ctx
}
