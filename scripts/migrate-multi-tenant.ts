
import 'dotenv/config'
import { prisma } from "../src/lib/prisma"

async function main() {
    console.log("🚀 Starting Multi-Tenant Migration...")

    // 1. Fetch all users with a legacy empresa_id
    const users = await prisma.usuario.findMany({
        where: {
            empresa_id: { not: null }
        }
    })

    console.log(`Found ${users.length} users to migrate.`)

    let migratedCount = 0

    for (const user of users) {
        if (!user.empresa_id) continue

        // 2. Create Miembro entry
        try {
            await prisma.miembro.upsert({
                where: {
                    usuario_id_empresa_id: {
                        usuario_id: user.id,
                        empresa_id: user.empresa_id
                    }
                },
                create: {
                    usuario_id: user.id,
                    empresa_id: user.empresa_id,
                    rol: user.rol // Migrate their current role
                },
                update: {
                    // Start of fresh migration: Ensure role is synced? Maybe skip if exists.
                    // keeping existing role is safer.
                }
            })

            // 3. Set active_empresa_id if not set
            if (!user.active_empresa_id) {
                await prisma.usuario.update({
                    where: { id: user.id },
                    data: { active_empresa_id: user.empresa_id }
                })
            }

            migratedCount++
            process.stdout.write(".")
        } catch (error) {
            console.error(`\nFailed to migrate user ${user.email}:`, error)
        }
    }

    console.log(`\n✅ Migration Complete! Migrated ${migratedCount} users.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
