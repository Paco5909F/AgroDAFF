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

// @ts-ignore
export async function getUserContext(): Promise<UserContext> {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    const SUPER_ADMIN_EMAILS = ['admin@eltrisquel.com']
    const isSuperAdmin = user.email && SUPER_ADMIN_EMAILS.includes(user.email)

    const dbUser = await prisma.usuario.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            active_empresa_id: true,
            rol: true,
            empresa_id: true, // Legacy
            miembros: {
                include: { empresa: true }
            }
        }
    })

    if (!dbUser) {
        redirect('/onboarding')
    }

    // A. DETERMINE TARGET COMPANY AND VALIDATE
    let targetEmpresaId = dbUser.active_empresa_id

    // Check if the current target is actually valid (exists in memberships)
    // We ignore this check for Super Admin initially, but we need to handle "Zombie" IDs
    const isValidMember = dbUser.miembros.some(m => m.empresa_id === targetEmpresaId)

    // Logic for Normal Users (or Super Admin who happen to be members)
    if (targetEmpresaId && !isValidMember && !isSuperAdmin) {
        // The active ID is set but user is NOT a member anymore (e.g. kicked or company deleted)
        targetEmpresaId = null // Reset to force fallback
    }

    // Fallback 1: If no valid target, pick the first membership
    if (!targetEmpresaId && dbUser.miembros.length > 0) {
        targetEmpresaId = dbUser.miembros[0].empresa_id

        // Auto-heal: Update the user's preference
        await prisma.usuario.update({
            where: { id: user.id },
            data: { active_empresa_id: targetEmpresaId }
        })
    }

    // Fallback 2: Legacy support
    if (!targetEmpresaId && dbUser.empresa_id) {
        targetEmpresaId = dbUser.empresa_id
    }

    // A.1 SUPER ADMIN OVERRIDE - Handle Zombie IDs or Clean Slate
    if (isSuperAdmin) {
        // If we have a targetId but no membership, it MIGHT be a zombie ID (deleted company)
        // Since we can't easily check existence without a query, we'll let the downstream fail 
        // OR we can try to be smarter. 
        // Let's assume if it's not in memberships, we should verify it exists or pick another.
        // BUT Super Admin might access companies they are NOT members of.
        // So we can't strictly rely on 'miembros'. 

        // However, if the downstream Page redirects to onboarding, it means the ID is definitely bad.
        // We can't fix it here easily without querying 'Empresa'.
        // Let's query it if we are unsure.
        if (targetEmpresaId) {
            const exists = await prisma.empresa.findUnique({ where: { id: targetEmpresaId }, select: { id: true } })
            if (!exists) {
                targetEmpresaId = null // It was a zombie ID
            }
        }

        // If still null (was null or was zombie), find any company
        if (!targetEmpresaId) {
            const firstCompany = await prisma.empresa.findFirst()
            if (firstCompany) {
                targetEmpresaId = firstCompany.id
                await prisma.usuario.update({
                    where: { id: user.id },
                    data: { active_empresa_id: targetEmpresaId }
                })
            }
        }
    }

    // B. VALIDATION
    if (!targetEmpresaId) {
        redirect('/onboarding')
    }

    // C. RETURN CONTEXT
    // Re-fetch membership for the FINAL targetId
    const finalMembership = dbUser.miembros.find(m => m.empresa_id === targetEmpresaId)

    return {
        userId: dbUser.id,
        empresaId: targetEmpresaId,
        // @ts-ignore
        rol: isSuperAdmin ? 'ADMIN' : (finalMembership ? finalMembership.rol : (dbUser.rol || 'LECTOR')),
        email: user.email
    }
}
