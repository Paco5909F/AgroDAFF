'use server'

import { prisma } from "@/lib/prisma"
import { clienteSchema, ClienteFormValues } from "@/lib/validations/cliente"
import { revalidatePath } from "next/cache"
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"

export async function getClientes(query?: string) {
    const { empresaId, rol } = await getUserContext()
    checkPermission(rol, PERMISSIONS.CLIENTES, 'read')
    const where: any = {
        empresa_id: empresaId,
        deleted_at: null,
    }

    if (query) {
        where.OR = [
            { razon_social: { contains: query, mode: 'insensitive' } },
            { cuit: { contains: query } },
        ]
    }

    return await prisma.cliente.findMany({
        where,
        orderBy: { created_at: 'desc' },
        include: {
            establecimientos: {
                where: { deleted_at: null },
                select: {
                    id: true,
                    nombre: true,
                    modalidad: true
                }
            }
        }
    })
}

export async function createCliente(data: ClienteFormValues) {
    const validated = clienteSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten() }
    }

    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CLIENTES, 'create')
        // Create client first
        const cliente = await prisma.cliente.create({
            data: {
                empresa_id: empresaId,
                razon_social: validated.data.razon_social,
                cuit: validated.data.cuit,
                condicion_iva: validated.data.condicion_iva,
                email: validated.data.email || null,
                telefono: validated.data.telefono || null,
                persona_contacto: validated.data.persona_contacto || null,
                tipo_cliente: validated.data.tipo_cliente || null,
                localidad: validated.data.localidad || null,
                provincia: validated.data.provincia || null,
                observaciones: validated.data.observaciones || null,
            },
        })

        // If initial establishment provided, create it
        if (validated.data.establecimiento_inicial?.trim()) {
            await prisma.establecimiento.create({
                data: {
                    empresa_id: empresaId,
                    nombre: validated.data.establecimiento_inicial.trim(),
                    cliente_id: cliente.id,
                    modalidad: validated.data.modalidad_inicial
                }
            })
        }

        revalidatePath('/clientes')
        return { success: true }
    } catch (error: any) {
        if (error.code === 'P2002') {
            return { success: false, error: "El CUIT ya existe en el sistema." }
        }
        return { success: false, error: "Error al crear cliente" }
    }
}

export async function updateCliente(id: string, data: ClienteFormValues) {
    const validated = clienteSchema.safeParse(data)
    if (!validated.success) {
        return { success: false, error: validated.error.flatten() }
    }

    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CLIENTES, 'update')

        // Extract helper fields that don't exist in Cliente model
        const { establecimiento_inicial, modalidad_inicial, ...dbData } = validated.data

        await prisma.cliente.update({
            where: { id, empresa_id: empresaId },
            data: {
                ...dbData,
                email: dbData.email || null,
                telefono: dbData.telefono || null,
                persona_contacto: dbData.persona_contacto || null,
                tipo_cliente: dbData.tipo_cliente || null,
                localidad: dbData.localidad || null,
                provincia: dbData.provincia || null,
                observaciones: dbData.observaciones || null,
            },
        })
        revalidatePath('/clientes')
        return { success: true }
    } catch (error) {
        console.error("Error updating cliente:", error)
        return { success: false, error: "Error al actualizar cliente" }
    }
}

export async function deleteCliente(id: string) {
    try {
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.CLIENTES, 'delete')

        // Soft delete
        await prisma.cliente.update({
            where: { id, empresa_id: empresaId },
            data: { deleted_at: new Date() },
        })
        revalidatePath('/clientes')
        return { success: true }
    } catch (error) {
        return { success: false, error: "Error al eliminar cliente" }
    }
}
