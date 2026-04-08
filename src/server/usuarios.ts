'use server'

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getUserProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: "No autenticado" }
    }

    try {
        const dbUser = await prisma.usuario.findUnique({
            where: { id: user.id },
            include: {
                miembros: {
                    include: {
                        empresa: {
                            select: { plan_status: true }
                        }
                    }
                }
            }
        })

        if (!dbUser) {
            return { success: false, error: "Usuario no encontrado en base de datos" }
        }

        // --- ROLE RESOLUTION LOGIC ---
        const SUPER_ADMIN_EMAILS = ['admin@agrodaff.com']
        const isSuperAdmin = user.email && SUPER_ADMIN_EMAILS.includes(user.email)

        let effectiveRole = dbUser.rol // Default fallback
        let planStatus = 'FREE' // Default plan

        if (isSuperAdmin) {
            effectiveRole = 'ADMIN'
            planStatus = 'ENTERPRISE'
        } else if (dbUser.active_empresa_id) {
            const activeMembership = dbUser.miembros.find(m => m.empresa_id === dbUser.active_empresa_id)
            if (activeMembership) {
                effectiveRole = activeMembership.rol
                if (activeMembership.empresa?.plan_status) {
                    planStatus = activeMembership.empresa.plan_status
                }
            }
        }

        return {
            success: true,
            data: {
                id: user.id,
                email: user.email,
                nombre: dbUser.nombre,
                rol: effectiveRole,
                plan: planStatus
            }
        }
    } catch (error) {
        console.error("Error fetching profile:", error)
        return { success: false, error: "Error al cargar perfil" }
    }
}


export async function updateUserProfile(nombre: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: "No autenticado" }
    }

    try {
        await prisma.usuario.update({
            where: { id: user.id },
            data: { nombre }
        })

        revalidatePath('/profile')
        revalidatePath('/dashboard') // Update name in navbar too

        return { success: true }
    } catch (error) {
        console.error("Error updating profile:", error)
        return { success: false, error: "Error al actualizar perfil" }
    }
}

export async function updateUserPassword(password: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: "No autenticado" }
    }

    try {
        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            console.error("Error Supabase password:", error)
            return { success: false, error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error("Error updating password:", error)
        return { success: false, error: "Error al actualizar contraseña" }
    }
}
