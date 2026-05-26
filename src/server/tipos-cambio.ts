'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { getUserContext } from '@/server/context'

export async function getTiposCambio(empresa_id: string | null = null) {
    try {
        const { userId } = await getUserContext()
        if (!userId) throw new Error('Unauthorized')

        const records = await prisma.tipoCambio.findMany({
            where: {
                empresa_id: empresa_id
            },
            orderBy: {
                fecha: 'desc'
            },
            take: 50
        })
        
        return { success: true, data: records }
    } catch (error) {
        console.error('Error fetching tipos de cambio:', error)
        return { success: false, error: 'Failed to fetch' }
    }
}

export async function createTipoCambio(data: { fecha: Date, moneda_origen?: string, moneda_destino?: string, valor: number, fuente?: string, empresa_id?: string | null }) {
    try {
        const { userId } = await getUserContext()
        if (!userId) throw new Error('Unauthorized')

        const record = await prisma.tipoCambio.create({
            data: {
                fecha: new Date(data.fecha),
                moneda_origen: data.moneda_origen || 'USD',
                moneda_destino: data.moneda_destino || 'ARS',
                valor: data.valor,
                fuente: data.fuente || 'BNA',
                empresa_id: data.empresa_id || null,
                created_by: userId
            }
        })
        
        revalidatePath('/precios')
        revalidatePath('/dashboard')
        return { success: true, data: record }
    } catch (error) {
        console.error('Error creating tipo cambio:', error)
        return { success: false, error: 'Failed to create' }
    }
}

export async function getLatestTipoCambio(empresa_id: string | null = null, moneda_origen = 'USD', moneda_destino = 'ARS') {
    try {
        const record = await prisma.tipoCambio.findFirst({
            where: {
                empresa_id,
                moneda_origen,
                moneda_destino
            },
            orderBy: {
                fecha: 'desc'
            }
        })
        
        return { success: true, data: record }
    } catch (error) {
        return { success: false, error: 'Failed to fetch latest' }
    }
}
