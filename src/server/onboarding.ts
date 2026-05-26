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

import { getUserContextSafe } from "@/server/context"
import { z } from "zod"

export async function getProfileCompletion(empresaId?: string) {
    try {
        let id = empresaId;
        if (!id) {
            const context = await getUserContextSafe();
            if (!context) return { percentage: 100, missing: [], isCompleted: true }; // Hide banner if not logged in
            id = context.empresaId;
        }

        const empresa = await prisma.empresa.findUnique({
            where: { id }
        });

        if (!empresa) return { percentage: 0, missing: ['Empresa no encontrada'], isCompleted: false };

        let completedPoints = 0;
        const totalPoints = 5;
        const missing = [];

        // 1. Nombre
        if (empresa.nombre) completedPoints++;
        else missing.push('Nombre de la Empresa');

        // 2. Datos Fiscales (CUIT)
        if (empresa.afip_cuit || empresa.cuit) completedPoints++;
        else missing.push('CUIT');

        // 3. Logo
        if (empresa.logo_url) completedPoints++;
        else missing.push('Logo de la empresa');

        // 4. Contacto (Email y Teléfono)
        if (empresa.email && empresa.telefono) completedPoints++;
        else missing.push('Email y Teléfono');

        // 5. Dirección y Ciudad
        if (empresa.direccion && empresa.ciudad) completedPoints++;
        else missing.push('Dirección y Ciudad');

        const percentage = Math.round((completedPoints / totalPoints) * 100);
        
        return { percentage, missing, isCompleted: percentage === 100 };
    } catch (error) {
        console.error("Error calculating profile completion:", error);
        return { percentage: 0, missing: ['Error de cálculo'], isCompleted: false };
    }
}

const updateOnboardingSchema = z.object({
    nombre: z.string().min(1, "El nombre es requerido"),
    cuit: z.string().optional(),
    direccion: z.string().optional(),
    ciudad: z.string().optional(),
    provincia: z.string().optional(),
    codigo_postal: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    logo_url: z.string().url("URL de logo inválida").optional().or(z.literal("")),
    pdf_footer: z.string().optional(),
    pdf_primary_color: z.string().optional()
})

export async function saveOnboardingStep(data: z.infer<typeof updateOnboardingSchema>) {
    try {
        const context = await getUserContextSafe();
        
        if (!context || context.rol !== 'ADMIN') {
            return { success: false, error: "No tienes permisos para editar la configuración de la empresa" };
        }

        const validData = updateOnboardingSchema.parse(data);

        await prisma.empresa.update({
            where: { id: context.empresaId },
            data: {
                nombre: validData.nombre,
                cuit: validData.cuit,
                afip_cuit: validData.cuit, // Sync with AFIP CUIT for convenience
                direccion: validData.direccion,
                ciudad: validData.ciudad,
                provincia: validData.provincia,
                codigo_postal: validData.codigo_postal,
                telefono: validData.telefono || null,
                email: validData.email || null,
                logo_url: validData.logo_url || null,
                pdf_footer: validData.pdf_footer,
                pdf_primary_color: validData.pdf_primary_color
            }
        });

        // After updating, check if it's completed now
        const completion = await getProfileCompletion(context.empresaId);
        if (completion.isCompleted) {
            await prisma.empresa.update({
                where: { id: context.empresaId },
                data: { setup_completed_at: new Date() }
            });
        }

        revalidatePath('/', 'layout'); // Revalidate everywhere to update the banner

        return { success: true };
    } catch (error) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        console.error("Error saving onboarding step:", error);
        return { success: false, error: "Error al guardar los datos" };
    }
}

