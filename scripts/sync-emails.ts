
import { createClient } from '@supabase/supabase-js'
import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

import { prisma } from '../src/lib/prisma'

// MUST use Service Role Key for listUsers
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseServiceKey) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function main() {
    console.log("Fetching users from Supabase Auth...")

    // Pagination might be needed for large sets, but for now 50 is fine
    const { data: { users }, error } = await supabase.auth.admin.listUsers({ perPage: 1000 })

    if (error) {
        console.error("Error fetching auth users:", error)
        return
    }

    console.log(`Found ${users.length} users in Auth. Syncing to DB...`)

    for (const user of users) {
        if (!user.email) continue;

        try {
            await prisma.usuario.update({
                where: { id: user.id },
                data: { email: user.email }
            })
            console.log(`Updated email for user ${user.id} (${user.email})`)
        } catch (e: any) {
            if (e.code === 'P2025') {
                // User not found in public table - ignore or create? 
                // If not in public table, they haven't onboarded or migrated. Ignore.
                // console.log(`User ${user.id} not found in public table. Skipping.`)
            } else {
                console.error(`Failed to update ${user.id}: ${e.message}`)
            }
        }
    }

    console.log("Done.")
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
