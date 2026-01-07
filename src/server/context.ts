'use server'

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export type UserContext = {
    userId: string
    empresaId: string
    rol: string
}

export async function getCompanyId(): Promise<string> {
    const ctx = await getUserContext()
    return ctx.empresaId
}

export async function getUserContext(): Promise<UserContext> {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    const dbUser = await prisma.usuario.findUnique({
        where: { id: user.id },
        select: {
            id: true,
            empresa_id: true,
            rol: true
        }
    })

    if (!dbUser || !dbUser.empresa_id) {
        // User authenticated but not associated with any company
        redirect('/onboarding')
    }

    return {
        userId: dbUser.id,
        empresaId: dbUser.empresa_id,
        // @ts-ignore
        rol: dbUser.rol
    }
}
