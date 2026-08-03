'use server'

import { preapproval } from "@/lib/mercadopago"
import { getUserContext } from "./context"
import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function createSubscription() {
    try {
        const { empresaId } = await getUserContext()
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user || !user.email) throw new Error("User not authenticated")

        const subscription = await preapproval.create({
            body: {
                reason: "Suscripción PRO - AgroDAFF",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: 25000,
                    currency_id: "ARS"
                },
                back_url: `${APP_URL}/dashboard?subscription=success`,
                external_reference: empresaId, // Key for webhook matching
                payer_email: user.email,
                status: "pending"
            }
        })

        if (!subscription || !subscription.init_point) {
            throw new Error("Failed to generate subscription link")
        }

        // Feature: Guardar el ID de suscripción de inmediato en estado pendiente
        // Esto evita depender 100% del external_reference en el webhook
        await prisma.empresa.update({
            where: { id: empresaId },
            data: {
                subscription_id: subscription.id,
                plan_status: 'PENDING'
            }
        })

        return { success: true, init_point: subscription.init_point }

    } catch (error) {
        console.error("Error creating subscription:", error)
        return { success: false, error: "Error creating subscription" }
    }
}

const SUPER_ADMIN_EMAILS = ['admin@agrodaff.com']

async function verifySuperAdmin(): Promise<{ authorized: boolean; error?: string }> {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user || !user.email || !SUPER_ADMIN_EMAILS.includes(user.email)) {
        return { authorized: false, error: "No autorizado: se requieren permisos de Super Admin." }
    }
    return { authorized: true }
}

export async function grantLifetimeAccess(targetEmpresaId: string) {
    try {
        const authCheck = await verifySuperAdmin()
        if (!authCheck.authorized) {
            return { success: false, error: authCheck.error }
        }

        await prisma.empresa.update({
            where: { id: targetEmpresaId },
            data: { is_lifetime: true, plan_status: 'PRO' }
        })
        return { success: true }
    } catch (error) {
        console.error("Error granting lifetime:", error)
        return { success: false, error: "No se pudo otorgar acceso de por vida." }
    }
}

export async function grantProStatusManually(targetEmpresaId: string, durationMonths: number = 1) {
    try {
        const authCheck = await verifySuperAdmin()
        if (!authCheck.authorized) {
            return { success: false, error: authCheck.error }
        }

        await prisma.empresa.update({
            where: { id: targetEmpresaId },
            data: { plan_status: 'PRO' }
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error otorgando PRO manual" }
    }
}
