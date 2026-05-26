'use server'

import { prisma } from "@/lib/prisma"
import { getUserContext } from "@/server/context"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const updateEmpresaSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    cuit: z.string().optional(),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    logo_url: z.string().url("URL de logo inválida").optional().or(z.literal(""))
})

export async function updateEmpresaProfile(data: z.infer<typeof updateEmpresaSchema>) {
    try {
        const context = await getUserContext()

        // Security Check: Only ADMIN can update company profile
        if (context.rol !== 'ADMIN') {
            return { success: false, error: "No tienes permisos para editar la configuración de la empresa" }
        }

        const validData = updateEmpresaSchema.parse(data)

        await prisma.empresa.update({
            where: { id: context.empresaId },
            data: {
                nombre: validData.nombre,
                cuit: validData.cuit,
                direccion: validData.direccion,
                telefono: validData.telefono || null,
                email: validData.email || null,
                logo_url: validData.logo_url || null
            }
        })

        revalidatePath('/dashboard/configuracion')
        revalidatePath('/reportes') // To update PDF branding

        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        console.error("Error updating company:", error)
        return { success: false, error: "Error al actualizar el perfil" }
    }
}

const updateAfipSchema = z.object({
    afip_cuit: z.string().min(1, "El CUIT es requerido"),
    condicion_iva: z.string().min(1, "La condición ante el IVA es requerida"),
    afip_punto_venta_default: z.number().int().positive("Debe ser un punto de venta válido").optional(),
    afip_production_mode: z.boolean().default(false)
})

export async function updateEmpresaAfip(data: any) {
    try {
        const context = await getUserContext()

        if (context.rol !== 'ADMIN') {
            return { success: false, error: "No tienes permisos" }
        }

        const validData = updateAfipSchema.parse({
            afip_cuit: data.afip_cuit,
            condicion_iva: data.condicion_iva,
            afip_punto_venta_default: data.afip_punto_venta_default ? Number(data.afip_punto_venta_default) : undefined,
            afip_production_mode: data.afip_production_mode === true
        })

        await prisma.empresa.update({
            where: { id: context.empresaId },
            data: {
                afip_cuit: validData.afip_cuit,
                condicion_iva: validData.condicion_iva,
                afip_punto_venta_default: validData.afip_punto_venta_default,
                afip_production_mode: validData.afip_production_mode
            }
        })

        revalidatePath('/dashboard/configuracion')
        return { success: true }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message }
        }
        console.error("Error updating afip config:", error)
        return { success: false, error: "Error al actualizar la configuración fiscal" }
    }
}
