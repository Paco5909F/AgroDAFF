'use server'

import { prisma } from "@/lib/prisma"
import { getUserContextSafe } from "@/server/context"

export async function recalculateOrderItemCost(ordenItemId: string) {
    const ctx = await getUserContextSafe();
    if (!ctx) throw new Error("No context");

    const item = await prisma.ordenItem.findUnique({
        where: { id: ordenItemId },
        include: { insumos: true, lote: true }
    });

    if (!item || !item.lote) return null;

    let nuevoSubtotal = Number(item.total); // Starts at the service labor cost

    // 1. Lote size
    const hectareas = Number(item.lote.hectareas);

    // 2. Iterate Insumos applied
    for (const oi of item.insumos) {
        const dosis = Number(oi.dosis_por_ha);
        const pasadas = oi.cantidad_pasadas;
        const precioUnitario = Number(oi.precio_unit_usado);

        const costoPorHa = dosis * precioUnitario * pasadas;
        const costoTotalInsumo = costoPorHa * hectareas;

        // Financiacion simple
        let costoFinal = costoTotalInsumo;
        if (oi.interes_mensual && oi.meses_financiacion) {
            // formula: C * (1 + (i*M/100))
            costoFinal = costoTotalInsumo * (1 + ((Number(oi.interes_mensual) * oi.meses_financiacion) / 100));
        }

        // Update DB silently (Cost Engine auto-healing)
        await prisma.ordenItemInsumo.update({
            where: { id: oi.id },
            data: {
                costo_por_ha: costoPorHa,
                costo_total: costoTotalInsumo,
                costo_total_financiado: costoFinal !== costoTotalInsumo ? costoFinal : null
            }
        });

        nuevoSubtotal += costoFinal;
    }

    // Returning new total for possible Parent Order recalculation
    return nuevoSubtotal;
}
