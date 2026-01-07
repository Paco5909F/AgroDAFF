'use server'

import { createClient } from "@/lib/supabase/server"
import { prisma } from "@/lib/prisma"

export async function seedAdminUser() {
    try {
        console.log("Seeding admin user...")
        const supabase = await createClient()
        const email = 'admin@eltrisquel.com'
        const password = 'admin123'

        const { data: { users } } = await supabase.auth.admin.listUsers()
        let user = users.find(u => u.email === email)

        if (!user) {
            const { data, error } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { role: 'admin' }
            })
            if (error) {
                console.error("Error creating auth user:", error)
                return { success: false, error: error.message }
            }
            user = data.user
        }

        if (user) {
            let empresa = await prisma.empresa.findFirst({ where: { nombre: 'Empresa Default' } })
            if (!empresa) {
                empresa = await prisma.empresa.create({
                    data: { nombre: 'Empresa Default' }
                })
            }

            await prisma.usuario.upsert({
                where: { id: user.id },
                update: { rol: 'ADMIN' }, // Legacy role for now
                create: {
                    id: user.id,


                    nombre: 'Admin',
                    empresa_id: empresa.id,
                    rol: 'ADMIN' // New Role Enum
                }
            })
            console.log("Admin user synced to DB")
            return { success: true, userId: user.id }
        }
        return { success: false, error: "User not found/created" }
    } catch (e: any) {
        console.error("Error syncing to DB:", e)
        return { success: false, error: e.message }
    }
}
