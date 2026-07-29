import { prisma } from '@/lib/prisma'

export class ProduccionService {
    // --- LOTES ---
    static async getLotes(empresaId: string, query?: string) {
        return prisma.lote.findMany({
            where: {
                empresa_id: empresaId,
                deleted_at: null,
                ...(query ? { nombre: { contains: query, mode: 'insensitive' } } : {})
            },
            include: {
                establecimiento: {
                    include: { cliente: true }
                }
            },
            orderBy: { created_at: 'desc' }
        })
    }

    static async createLote(empresaId: string, data: any) {
        return prisma.lote.create({
            data: {
                nombre: data.nombre,
                hectareas: data.hectareas,
                establecimiento_id: data.establecimiento_id,
                empresa_id: empresaId
            }
        })
    }

    static async updateLote(id: string, empresaId: string, data: any) {
        return prisma.lote.update({
            where: { id, empresa_id: empresaId },
            data: {
                nombre: data.nombre,
                hectareas: data.hectareas,
                establecimiento_id: data.establecimiento_id
            }
        })
    }

    static async deleteLote(id: string, empresaId: string) {
        return prisma.lote.update({
            where: { id, empresa_id: empresaId },
            data: { deleted_at: new Date() }
        })
    }

    // --- ESTABLECIMIENTOS ---
    static async getEstablecimientos(empresaId: string) {
        return prisma.establecimiento.findMany({
            where: {
                empresa_id: empresaId,
                deleted_at: null
            },
            include: {
                cliente: true,
                _count: {
                    select: { lotes: { where: { deleted_at: null } } }
                }
            },
            orderBy: { nombre: 'asc' }
        })
    }

    static async createEstablecimiento(empresaId: string, data: any) {
        return prisma.establecimiento.create({
            data: {
                nombre: data.nombre,
                modalidad: data.modalidad,
                cliente_id: data.cliente_id,
                empresa_id: empresaId
            }
        })
    }

    static async updateEstablecimiento(id: string, empresaId: string, data: any) {
        return prisma.establecimiento.update({
            where: { id, empresa_id: empresaId },
            data: {
                nombre: data.nombre,
                modalidad: data.modalidad,
                cliente_id: data.cliente_id
            }
        })
    }

    static async deleteEstablecimiento(id: string, empresaId: string) {
        return prisma.establecimiento.update({
            where: { id, empresa_id: empresaId },
            data: { deleted_at: new Date() }
        })
    }

    // --- LOTE CAMPAÑA (INGENIERÍA AGRONÓMICA) ---
    
    /**
     * Obtiene el historial de rindes de un lote específico para ayudar a estimar el rinde de la nueva campaña.
     */
    static async obtenerHistorialRindeLote(loteId: string, cultivo: string) {
        const historico = await prisma.loteCampana.findMany({
            where: {
                lote_id: loteId,
                cultivo: cultivo,
                rinde_real_qq: { not: null }
            },
            orderBy: { campana: { fecha_inicio: 'desc' } },
            take: 3,
            include: { campana: { select: { nombre: true, ciclo: true } } }
        });

        if (historico.length === 0) return null;
        
        const sumaRindes = historico.reduce((acc, curr) => acc + Number(curr.rinde_real_qq), 0);
        const promedio = sumaRindes / historico.length;
        
        return {
            promedio_qq: promedio.toFixed(2),
            ultimo_rinde: historico[0].rinde_real_qq,
            historial: historico
        };
    }

    /**
     * Asigna un lote a una campaña, permitiendo usar el historial para estimar el rinde.
     */
    static async asignarLoteACampana(data: {
        lote_id: string;
        campana_id: string;
        cultivo: string;
        superficie: number;
        rinde_estimado_qq: number;
        fecha_siembra?: Date;
    }) {
        // Validar que la superficie declarada no supere la del lote original
        const lote = await prisma.lote.findUnique({ where: { id: data.lote_id } });
        if (!lote) throw new Error("Lote no encontrado");
        
        if (Number(data.superficie) > Number(lote.hectareas)) {
            throw new Error(`La superficie sembrada (${data.superficie} ha) no puede superar el tamaño real del lote (${lote.hectareas} ha).`);
        }

        return prisma.loteCampana.upsert({
            where: {
                lote_id_campana_id: {
                    lote_id: data.lote_id,
                    campana_id: data.campana_id
                }
            },
            update: {
                cultivo: data.cultivo,
                superficie: data.superficie,
                rinde_estimado_qq: data.rinde_estimado_qq,
                fecha_siembra: data.fecha_siembra,
                updated_at: new Date()
            },
            create: {
                lote_id: data.lote_id,
                campana_id: data.campana_id,
                cultivo: data.cultivo,
                superficie: data.superficie,
                rinde_estimado_qq: data.rinde_estimado_qq,
                fecha_siembra: data.fecha_siembra
            }
        });
    }

    /**
     * Registra la cosecha real de un lote en una campaña (Cierre de Lote).
     */
    static async registrarCosecha(loteId: string, campanaId: string, rindeRealQq: number, fechaCosecha: Date) {
        return prisma.loteCampana.update({
            where: {
                lote_id_campana_id: {
                    lote_id: loteId,
                    campana_id: campanaId
                }
            },
            data: {
                rinde_real_qq: rindeRealQq,
                fecha_cosecha: fechaCosecha,
                updated_at: new Date()
            }
        });
    }
}
