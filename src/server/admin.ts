'use server'

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const SUPER_ADMIN_EMAILS = ['admin@eltrisquel.com']

export async function switchAdminContext(targetEmpresaId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || !user.email || !SUPER_ADMIN_EMAILS.includes(user.email)) {
        return { success: false, error: "Unauthorized: Super Admin access required" }
    }

    try {
        // Verify target company exists
        const company = await prisma.empresa.findUnique({
            where: { id: targetEmpresaId }
        })

        if (!company) {
            return { success: false, error: "Company not found" }
        }

        // Update active context
        await prisma.usuario.update({
            where: { id: user.id },
            data: { active_empresa_id: targetEmpresaId }
        })

        revalidatePath('/', 'layout')
        return { success: true }
    } catch (error) {
        console.error("Error switching admin context:", error)
        return { success: false, error: "Database error" }
    }
}
