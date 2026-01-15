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
