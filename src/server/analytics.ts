'use server'

import { prisma } from "@/lib/prisma"
import { getUserContextSafe } from "@/server/context"
import { checkPlanLimits } from "@/server/billing-limits"

export interface AnalyticsSummary {
    gastoTotal: number;
    gastoPorInsumo: Record<string, number>;
    gastoPorLote: Record<string, number>;
    costoPorHectarea: number;
    totalHectareas: number;
    tendencia: string;
    sugerencias: string[];
    labores: {
        fecha: Date;
        lote: string;
        servicio: string;
        cantidad: number;
        costoLabor: number;
        costoInsumos: number;
        total: number;
    }[];
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
        costoPorHectarea: 0,
        totalHectareas: 0,
        tendencia: "ESTABLE",
        sugerencias: [],
        labores: []
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
            orden: true,
            servicio: true,
            lote: true,
            insumos: {
                include: { insumo: true }
            }
        }
    });

    let totalLabores = 0;
    const loteCounter: Record<string, typeof ordenesItems> = {};
    const processedLotes = new Set<string>();

    for (const item of ordenesItems) {
        // Cost of Service/Labor
        const costoLabor = Number(item.total);
        totalLabores += costoLabor;
        output.gastoTotal += costoLabor;

        const loteName = item.lote ? item.lote.nombre : 'Sin Lote Asignado';
        output.gastoPorLote[loteName] = (output.gastoPorLote[loteName] || 0) + costoLabor;

        if (item.lote && !processedLotes.has(item.lote.id)) {
            processedLotes.add(item.lote.id);
            output.totalHectareas += Number(item.lote.hectareas);
        }

        if (!loteCounter[loteName]) loteCounter[loteName] = [];
        loteCounter[loteName].push(item);

        let insumosTotalCost = 0;

        // Cost of Insumos
        for (const oi of item.insumos) {
            const insumoCost = Number(oi.costo_total);
            const insumoName = oi.insumo.nombre;
            const insumoType = oi.insumo.tipo.toUpperCase();

            // Store by type or name
            output.gastoPorInsumo[insumoType] = (output.gastoPorInsumo[insumoType] || 0) + insumoCost;
            
            output.gastoTotal += insumoCost;
            output.gastoPorLote[loteName] += insumoCost;
            insumosTotalCost += insumoCost;
        }

        output.labores.push({
            fecha: item.orden.fecha,
            lote: loteName,
            servicio: item.servicio?.nombre || 'Insumo Directo',
            cantidad: Number(item.cantidad),
            costoLabor: costoLabor,
            costoInsumos: insumosTotalCost,
            total: costoLabor + insumosTotalCost
        });
    }

    if (output.totalHectareas > 0) {
        output.costoPorHectarea = output.gastoTotal / output.totalHectareas;
    }

    // 2. IA Heuristics (Generación Inteligente de Sugerencias)
    
    // Suggestion A: High relative cost in a specific Lote
    if (Object.keys(output.gastoPorLote).length > 1) {
        const avgLoteCost = output.gastoTotal / Object.keys(output.gastoPorLote).length;
        for (const [lname, lcost] of Object.entries(output.gastoPorLote)) {
            if (lcost > avgLoteCost * 1.4 && lname !== 'Sin Lote Asignado') {
                const diff = Math.round(((lcost / avgLoteCost) - 1) * 100);
                output.sugerencias.push(`📊 Alerta de Costos: El lote '${lname}' presenta gastos operativos ${diff}% superiores al promedio del establecimiento. Sugerimos auditar las órdenes de trabajo recientes.`);
            }
        }
    }

    // Suggestion B: Herbicide spending logic
    if (output.gastoPorInsumo['HERBICIDA'] && output.gastoTotal > 0) {
        const herbRatio = output.gastoPorInsumo['HERBICIDA'] / output.gastoTotal;
        if (herbRatio > 0.40) {
            output.sugerencias.push(`🧪 Concentración de Capital: Más del 40% (${(herbRatio * 100).toFixed(1)}%) de la inversión se destina a Herbicidas. Evaluar tácticas de rotación o cultivos de cobertura para optimizar márgenes.`);
        }
    }

    // Suggestion C: Seed vs Fertilizer optimization
    if (output.gastoPorInsumo['SEMILLA'] && output.gastoPorInsumo['FERTILIZANTE']) {
        const fertVsSeed = output.gastoPorInsumo['FERTILIZANTE'] / output.gastoPorInsumo['SEMILLA'];
        if (fertVsSeed < 0.2) {
             output.sugerencias.push(`🌱 Relación Nutricional: La inversión en fertilizantes representa menos del 20% respecto al costo de semillas. Recomendamos realizar muestreos de suelo para prevenir mermas de rinde.`);
        }
    }

    // Default Good Work msg
    if (output.sugerencias.length === 0 && output.gastoTotal > 0) {
        output.sugerencias.push("✅ Balance Estable: Los costos operativos se mantienen dentro de los parámetros esperados. No se detectan anomalías estadísticas ni desviaciones presupuestarias críticas.");
    } else if (output.gastoTotal === 0) {
        output.sugerencias.push("ℹ️ Información Incompleta: Registre aplicaciones de insumos o labores para nutrir el tablero con datos financieros y obtener márgenes brutos de campaña.");
    }

    return output;
}
