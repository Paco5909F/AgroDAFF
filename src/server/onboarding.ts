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
                    cuit: '00000000000',
                    direccion: 'Sin dirección'
                }
            })

            // 2. Create User (if not exists) & Update Active Context
            const existingUser = await tx.usuario.findUnique({ where: { id: user.id } })

            if (existingUser) {
                await tx.usuario.update({
                    where: { id: user.id },
                    data: {
                        active_empresa_id: empresa.id,
                        // Don't update email to avoid unique constraint if it hasn't changed
                    }
                })
            } else {
                // Check if email is taken by ANOTHER id (Database integrity issue check)
                const emailTaken = await tx.usuario.findFirst({ where: { email: user.email } })
                if (emailTaken) {
                    // Emergency: Update the existing record with this email to match the new Auth ID? 
                    // Or fail gracefully. For now, let's assume valid ID.
                    throw new Error(`El email ${user.email} ya está registrado con otro ID de usuario.`)
                }

                await tx.usuario.create({
                    data: {
                        id: user.id,
                        email: user.email || null,
                        nombre: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
                        rol: 'ADMIN',
                        active_empresa_id: empresa.id
                    }
                })
            }

            // 3. Create Membership (CRITICAL for RLS)
            await tx.miembro.create({
                data: {
                    usuario_id: user.id,
                    empresa_id: empresa.id,
                    rol: 'ADMIN'
                }
            })
        })
    } catch (error: any) {
        console.error("Error creating company:", error)
        return { error: `Error detalle: ${error.message || 'Desconocido'}` }
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

    // 1. Try to find explicit Invitation
    let invite: any = await prisma.invitation.findUnique({
        where: { token, status: 'PENDING' }
    })

    let targetEmpresaId = ''
    let targetRole = 'LECTOR' // Default for shared codes

    if (invite) {
        targetEmpresaId = invite.empresa_id
        targetRole = invite.rol
    } else {
        // 2. Try to find by Shared Company Code
        const company = await prisma.empresa.findUnique({
            where: { shared_invite_code: token }
        })

        if (!company) {
            return { error: "Código de invitación no encontrado o expirado" }
        }
        targetEmpresaId = company.id
        targetRole = 'ENCARGADO' // Default role for shared code users? Or LECTOR? Let's say ENCARGADO for now.
    }

    try {
        await prisma.$transaction(async (tx) => {
            // ... existing logic ...
            // 1. Update/Create User
            const existingUser = await tx.usuario.findUnique({ where: { id: user.id } })

            if (existingUser) {
                await tx.usuario.update({
                    where: { id: user.id },
                    data: {
                        active_empresa_id: targetEmpresaId,
                        email: user.email // Sync email on join
                    }
                })
            } else {
                await tx.usuario.create({
                    data: {
                        id: user.id,
                        email: user.email,
                        nombre: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                        rol: targetRole as any,
                        active_empresa_id: targetEmpresaId
                    }
                })
            }

            // 2. Create Membership
            await tx.miembro.create({
                data: {
                    usuario_id: user.id,
                    empresa_id: targetEmpresaId,
                    rol: targetRole as any
                }
            })

            // 3. Mark Invitation Accepted (Only if it was an email invite)
            if (invite) {
                await tx.invitation.update({
                    where: { id: invite.id },
                    data: { status: 'ACCEPTED' }
                })
            }
        })
    } catch (error) {
        console.error("Error joining company:", error)
        return { error: "Error al unirse al equipo" }
    }

    redirect('/dashboard')
}
