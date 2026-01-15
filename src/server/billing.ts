'use server'

import { preapproval } from "@/lib/mercadopago"
import { getUserContext } from "./context"
import { createClient } from "@/lib/supabase/server"

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function createSubscription() {
    try {
        const { empresaId } = await getUserContext()
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user || !user.email) throw new Error("User not authenticated")

        const subscription = await preapproval.create({
            body: {
                reason: "Suscripción PRO - Agroservicios El Trisquel",
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

        return { success: true, init_point: subscription.init_point }

    } catch (error) {
        console.error("Error creating subscription:", error)
        return { success: false, error: "Error creating subscription" }
    }
}
