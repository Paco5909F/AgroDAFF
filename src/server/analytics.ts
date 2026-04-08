'use server'

import { prisma } from "@/lib/prisma"
import { getUserContextSafe } from "@/server/context"
import { checkPlanLimits } from "@/server/billing-limits"

export interface AnalyticsSummary {
    gastoTotal: number;
    gastoPorInsumo: Record<string, number>;
    gastoPorLote: Record<string, number>;
    tendencia: string;
    sugerencias: string[];
}

export async function getCampaignAnalytics(campanaId: string | null): Promise<AnalyticsSummary> {
    const ctx = await getUserContextSafe();
    if (!ctx || !ctx.empresaId) {
        throw new Error("No autorizado");
    }

    // Default to active campaign if none provided
    let finalCampanaId = campanaId;
    if (!finalCampanaId) {
        const active = await prisma.campana.findFirst({ where: { empresa_id: ctx.empresaId, activa: true } });
        if (active) finalCampanaId = active.id;
    }

    const output: AnalyticsSummary = {
        gastoTotal: 0,
        gastoPorInsumo: {},
        gastoPorLote: {},
        tendencia: "ESTABLE",
        sugerencias: []
    };

    if (!finalCampanaId) {
        output.sugerencias.push("💡 No tienes una campaña activa cruzada. Configura una en 'Campañas' para ver costos totales de temporada.");
        return output;
    }

    // 1. Fetch all items in this campaign
    const ordenesItems = await prisma.ordenItem.findMany({
        where: {
            orden: { empresa_id: ctx.empresaId, estado: { in: ['en_proceso', 'completada', 'facturada'] } },
            campana_id: finalCampanaId
        },
        include: {
            servicio: true,
            lote: true,
            insumos: {
                include: { insumo: true }
            }
        }
    });

    let totalLabores = 0;
    const loteCounter: Record<string, typeof ordenesItems> = {};

    for (const item of ordenesItems) {
        // Cost of Service/Labor
        const costoLabor = Number(item.total);
        totalLabores += costoLabor;
        output.gastoTotal += costoLabor;

        const loteName = item.lote ? item.lote.nombre : 'Sin Lote Asignado';
        output.gastoPorLote[loteName] = (output.gastoPorLote[loteName] || 0) + costoLabor;

        if (!loteCounter[loteName]) loteCounter[loteName] = [];
        loteCounter[loteName].push(item);

        // Cost of Insumos
        for (const oi of item.insumos) {
            const insumoCost = Number(oi.costo_total);
            const insumoName = oi.insumo.nombre;
            const insumoType = oi.insumo.tipo.toUpperCase();

            // Store by type or name
            output.gastoPorInsumo[insumoType] = (output.gastoPorInsumo[insumoType] || 0) + insumoCost;
            
            output.gastoTotal += insumoCost;
            output.gastoPorLote[loteName] += insumoCost;
        }
    }

    // 2. IA Heuristics (Generación Inteligente de Sugerencias)
    
    // Suggestion A: High relative cost in a specific Lote
    if (Object.keys(output.gastoPorLote).length > 1) {
        const avgLoteCost = output.gastoTotal / Object.keys(output.gastoPorLote).length;
        for (const [lname, lcost] of Object.entries(output.gastoPorLote)) {
            if (lcost > avgLoteCost * 1.4 && lname !== 'Sin Lote Asignado') {
                const diff = Math.round(((lcost / avgLoteCost) - 1) * 100);
                output.sugerencias.push(`📊 El lote '${lname}' tiene costos de mantenimiento ${diff}% más altos que el promedio. Revisa su historial toxicológico.`);
            }
        }
    }

    // Suggestion B: Herbicide spending logic
    if (output.gastoPorInsumo['HERBICIDA'] && output.gastoTotal > 0) {
        const herbRatio = output.gastoPorInsumo['HERBICIDA'] / output.gastoTotal;
        if (herbRatio > 0.40) {
            output.sugerencias.push(`🧪 Estás destinando más del 40% (${(herbRatio * 100).toFixed(1)}%) de tu capital a Herbicidas. Sugerimos evaluar estrategias preventivas rotativas para abaratar costos a futuro.`);
        }
    }

    // Suggestion C: Seed vs Fertilizer optimization
    if (output.gastoPorInsumo['SEMILLA'] && output.gastoPorInsumo['FERTILIZANTE']) {
        const fertVsSeed = output.gastoPorInsumo['FERTILIZANTE'] / output.gastoPorInsumo['SEMILLA'];
        if (fertVsSeed < 0.2) {
             output.sugerencias.push(`🌱 Nota Inteligente: Es posible que estés sub-fertilizando en base a tu umbral de siembra (ratio menor al 20%). Validá las muestras de suelo para no perder rinde.`);
        }
    }

    // Default Good Work msg
    if (output.sugerencias.length === 0 && output.gastoTotal > 0) {
        output.sugerencias.push("✅ Tus costos se mantienen dentro de la homeostasis estadística de campanas productivas. ¡Excelente!");
    } else if (output.gastoTotal === 0) {
        output.sugerencias.push("⏳ Cargá insumos o cerrá Órdenes de Trabajo para nutrir a la IA con datos fiables.");
    }

    return output;
}
