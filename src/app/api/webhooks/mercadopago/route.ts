import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { preapproval } from '@/lib/mercadopago'

export async function POST(req: Request) {
    try {
        const url = new URL(req.url)
        console.log("MercadoPago Webhook Received", url.search)

        const body = await req.json().catch(() => null)
        console.log("Webhook body:", body)

        // Extract ID. MercadoPago sends id either in query ?data.id= or body.data.id
        const id = url.searchParams.get('data.id') || body?.data?.id
        const type = url.searchParams.get('type') || body?.type

        if (!id) {
            return NextResponse.json({ success: true, message: 'Ignorado - Sin ID' }, { status: 200 })
        }

        if (type === 'subscription_preapproval') {
            // Verify real status with MP API
            const subscriptionInfo = await preapproval.get({ id })
            
            if (!subscriptionInfo) {
                return NextResponse.json({ success: false, error: 'Subscripcion no encontrada' }, { status: 404 })
            }

            const status = subscriptionInfo.status // pending, authorized, paused, cancelled
            const empresaId = subscriptionInfo.external_reference // We set this on createSubscription

            if (!empresaId) {
                console.error("Missing external_reference on subscription", subscriptionInfo.id)
                return NextResponse.json({ success: true }, { status: 200 })
            }

            // Map MP status to our DB plan_status
            let newPlanStatus = 'FREE'
            if (status === 'authorized') {
                newPlanStatus = 'PRO'
            } else if (status === 'paused' || status === 'cancelled') {
                newPlanStatus = 'PAST_DUE'
            }

            // Update Database
            await prisma.empresa.update({
                where: { id: empresaId },
                data: {
                    plan_status: newPlanStatus,
                    subscription_id: subscriptionInfo.id
                }
            })

            console.log(`Empresa ${empresaId} updated to ${newPlanStatus}`)
            return NextResponse.json({ success: true, updated: newPlanStatus }, { status: 200 })
        }

        // Just acknowledge other events (like payments)
        return NextResponse.json({ success: true }, { status: 200 })

    } catch (error) {
        console.error('Error handling MP Webhook:', error)
        // MP retries if we return 500, but often we just return 200 if we logged it
        return NextResponse.json({ success: false, error: 'Internal Error' }, { status: 500 })
    }
}
