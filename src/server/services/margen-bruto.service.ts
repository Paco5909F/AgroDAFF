import { prisma } from '@/lib/prisma'

export type MargenBrutoReport = {
    loteId: string
    loteNombre: string
    campanaNombre: string
    superficie: number
    rindeReal: number
    ingresoBrutoUsd: number
    costosDirectosUsd: number
    margenBrutoUsd: number
    margenBrutoPorHa: number
}

export class MargenBrutoService {
    /**
     * Calculates the gross margin (Margen Bruto) for a specific lote and campana.
     * Margen Bruto = Ingresos (Rinde * Precio Venta) - Costos Directos (Insumos + Labores)
     * All calculations are standardized in USD for stability.
     */
    static async calculateForLote(loteId: string, campanaId: string, empresaId: string | null): Promise<MargenBrutoReport | null> {
        // 1. Fetch Lote and Campana info
        const loteCampana = await prisma.loteCampana.findUnique({
            where: {
                lote_id_campana_id: { lote_id: loteId, campana_id: campanaId }
            },
            include: {
                lote: true,
                campana: true
            }
        })

        if (!loteCampana) return null

        const superficie = Number(loteCampana.superficie) || 0
        const rindeReal = Number(loteCampana.rinde_real_qq) || 0

        // In a real Albor-style system, you'd fetch the actual average selling price of the crop.
        // For this baseline, we assume a standard price or allow it to be passed.
        // Let's assume a dummy price of $300 USD per Ton (or $30 per QQ) for soy/wheat if not specified elsewhere.
        const precioVentaEstimadoUsd = 30 // USD per QQ

        const ingresoBrutoUsd = rindeReal * superficie * precioVentaEstimadoUsd

        // 2. Calculate Direct Costs (Insumos + Labores applied to this lot in this campana)
        // We look at OrdenTrabajo completed for this lote/campana
        const ordenItems = await prisma.ordenItem.findMany({
            where: {
                lote_id: loteId,
                campana_id: campanaId,
                orden: {
                    estado: { in: ['completada', 'facturada'] },
                    empresa_id: empresaId
                }
            },
            include: {
                insumos: true
            }
        })

        let costosDirectosUsd = 0

        for (const item of ordenItems) {
            // Labor cost
            // item.total is usually in ARS if the order is in ARS.
            // For a robust bimonetary system, we must use the cotizacion_usd frozen at the time of completion.
            const itemOrden = await prisma.ordenTrabajo.findUnique({ where: { id: item.orden_id }})
            const cotizacionUsd = Number(itemOrden?.cotizacion_usd) || 1000 // Fallback

            let costLaborUsd = 0
            if (itemOrden?.moneda === 'USD') {
                costLaborUsd = Number(item.subtotal_real || item.total)
            } else {
                costLaborUsd = Number(item.subtotal_real || item.total) / cotizacionUsd
            }
            
            costosDirectosUsd += costLaborUsd

            // Inputs cost (Insumos)
            for (const insumo of item.insumos) {
                // Insumos are usually priced in USD natively (precio_unit_usado)
                const costInsumoUsd = Number(insumo.costo_total)
                costosDirectosUsd += costInsumoUsd
            }
        }

        const margenBrutoUsd = ingresoBrutoUsd - costosDirectosUsd
        const margenBrutoPorHa = superficie > 0 ? margenBrutoUsd / superficie : 0

        return {
            loteId,
            loteNombre: loteCampana.lote.nombre,
            campanaNombre: loteCampana.campana.nombre,
            superficie,
            rindeReal,
            ingresoBrutoUsd,
            costosDirectosUsd,
            margenBrutoUsd,
            margenBrutoPorHa
        }
    }
}
