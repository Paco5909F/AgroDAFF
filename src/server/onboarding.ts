'use server'

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createCompany(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Must be logged in")
    }

    const nombre = formData.get('nombre') as string
    if (!nombre || nombre.length < 3) {
        return { error: "El nombre debe tener al menos 3 caracteres" }
    }

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Create Company
            const empresa = await tx.empresa.create({
                data: {
                    nombre,
                    // Optional defaults
                    cuit: '00000000000',
                    direccion: 'Sin dirección'
                }
            })

            // 2. Create/Update User (Admin)
            await tx.usuario.upsert({
                where: { id: user.id },
                update: {
                    empresa_id: empresa.id,
                    rol: 'ADMIN',
                    email: user.email || null,
                    nombre: user.user_metadata?.full_name || user.email?.split('@')[0]
                },
                create: {
                    id: user.id,
                    email: user.email || null,
                    nombre: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
                    rol: 'ADMIN',
                    empresa_id: empresa.id
                }
            })
        })
    } catch (error) {
        console.error("Error creating company:", error)
        return { error: "Error al crear la empresa" }
    }

    redirect('/dashboard')
}

export async function joinWithCode(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("Must be logged in")
    }

    const token = formData.get('token') as string
    if (!token) return { error: "Código inválido" }

    try {
        const invite = await prisma.invitation.findUnique({
            where: { token, status: 'PENDING' }
        })

        if (!invite) return { error: "Invitación no encontrada o expirada" }

        await prisma.$transaction(async (tx) => {
            await tx.usuario.upsert({
                where: { id: user.id },
                update: {
                    empresa_id: invite.empresa_id,
                    rol: invite.rol,
                    email: user.email,
                    nombre: user.user_metadata?.full_name || user.email?.split('@')[0]
                },
                create: {
                    id: user.id,
                    email: user.email,
                    nombre: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    rol: invite.rol,
                    empresa_id: invite.empresa_id
                }
            })

            await tx.invitation.update({
                where: { id: invite.id },
                data: { status: 'ACCEPTED' }
            })
        })
    } catch (error) {
        console.error("Error joining company:", error)
        return { error: "Error al unirse al equipo" }
    }

    redirect('/dashboard')
}
