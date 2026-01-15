import { NextRequest, NextResponse } from "next/server";
import { preapproval } from "@/lib/mercadopago";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const topic = searchParams.get("topic") || searchParams.get("type");
        const id = searchParams.get("id") || searchParams.get("data.id");

        console.log(`[MP Webhook] Topic: ${topic}, ID: ${id}`);

        if (topic === "preapproval" && id) {
            // Verify status with MP
            const subscription = await preapproval.get({ id: id });

            if (!subscription) {
                return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
            }

            const empresaId = subscription.external_reference;
            const status = subscription.status; // authorized, paused, cancelled

            if (!empresaId) {
                console.error("[MP Webhook] Missing external_reference (empresaId)");
                return NextResponse.json({ error: "Missing external_reference" }, { status: 400 });
            }

            console.log(`[MP Webhook] Updating Empresa ${empresaId} to status: ${status}`);

            // Map MP status to App status
            let planStatus = "FREE";
            if (status === "authorized") planStatus = "PRO";
            if (status === "cancelled") planStatus = "CANCELLED";
            // paused?

            await prisma.empresa.update({
                where: { id: empresaId },
                data: {
                    plan_status: planStatus,
                    subscription_id: id
                }
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ message: "Event ignored" });
    } catch (error) {
        console.error("[MP Webhook] Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
