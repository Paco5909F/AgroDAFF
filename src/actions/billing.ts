'use server'

import { preapproval } from "@/lib/mercadopago"
import { getCompanyId } from "@/server/context"
import { redirect } from "next/navigation"

export async function createSubscriptionLink() {
    const empresaId = await getCompanyId()

    try {
        const result = await preapproval.create({
            body: {
                reason: "Suscripción AgroManager PRO",
                auto_recurring: {
                    frequency: 1,
                    frequency_type: "months",
                    transaction_amount: 25000,
                    currency_id: "ARS"
                },
                back_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?subscribed=true`,
                external_reference: empresaId, // We use this to match webhook
                payer_email: "test_user_123@test.com", // MP often requires this, should ideally come from user
                status: "pending"
            }
        })

        if (result.init_point) {
            redirect(result.init_point)
        } else {
            return { error: "No se pudo generar el link de pago" }
        }

    } catch (error) {
        console.error("MP Error:", error)
        // Check if it's a redirect error (NEXT_REDIRECT)
        if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
            throw error
        }
        return { error: "Error de conexión con Mercado Pago" }
    }
}
