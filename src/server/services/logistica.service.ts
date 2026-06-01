import { prisma } from '@/lib/prisma'

export class LogisticaService {
    static async getCartasPorte(empresaId: string, query?: string) {
        const cartas = await prisma.cartaPorte.findMany({
            where: {
                empresa_id: empresaId,
                ...(query ? {
                    OR: [
                        { cliente: { razon_social: { contains: query, mode: 'insensitive' } } },
                        { chofer: { contains: query, mode: 'insensitive' } },
                        { patente_camion: { contains: query, mode: 'insensitive' } }
                    ]
                } : {})
            },
            include: {
                cliente: true
            },
            orderBy: { created_at: 'desc' }
        })
        
        return cartas.map(carta => ({
            ...carta,
            kilos_estimados: carta.kilos_estimados.toNumber()
        }))
    }

    static async createCartaPorte(empresaId: string, data: any) {
        return prisma.cartaPorte.create({
            data: {
                empresa_id: empresaId,
                cliente_id: data.cliente_id,
                ctg: data.ctg,
                fecha_carga: data.fecha_carga,
                origen: data.origen,
                destino: data.destino,
                chofer: data.chofer,
                cuit_chofer: data.cuit_chofer || null,
                corredor: data.corredor || null,
                destinatario: data.destinatario || null,
                patente_camion: data.patente_camion,
                patente_acoplado: data.patente_acoplado || null,
                kilos_estimados: data.kilos_estimados,
                peso_bruto: data.peso_bruto || null,
                peso_tara: data.peso_tara || null,
                observaciones: data.observaciones || null,
                estado: 'EMITIDA'
            }
        })
    }

    static async updateCartaPorte(id: string, empresaId: string, data: any) {
        return prisma.cartaPorte.update({
            where: { id, empresa_id: empresaId },
            data: {
                cliente: { connect: { id: data.cliente_id } },
                ctg: data.ctg,
                fecha_carga: data.fecha_carga,
                origen: data.origen,
                destino: data.destino,
                chofer: data.chofer,
                patente_camion: data.patente_camion,
                patente_acoplado: data.patente_acoplado || null,
                kilos_estimados: data.kilos_estimados,
                peso_bruto: data.peso_bruto || null,
                peso_tara: data.peso_tara || null,
                cuit_chofer: data.cuit_chofer || null,
                observaciones: data.observaciones || null,
            }
        })
    }

    static async deleteCartaPorte(id: string, empresaId: string) {
        const check = await prisma.cartaPorte.findUnique({ where: { id } })
        if (!check) {
            throw new Error(`Error DEV: Registro UUID ${id} inexistente en PostgreSQL.`)
        }
        if (check.empresa_id !== empresaId) {
            throw new Error(`Error DEV: La CP pertenece a ${check.empresa_id} pero tú operas sobre ${empresaId}`)
        }

        const result = await prisma.cartaPorte.deleteMany({
            where: { id, empresa_id: empresaId }
        })
        
        if (result.count === 0) {
            throw new Error('Carta de porte bloqueada o no encontrada al procesar.')
        }
        
        return true
    }
}
