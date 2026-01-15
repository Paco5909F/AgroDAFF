
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    const staleUserId = '573f8e88-aa08-4e85-8705-e36496f94059'
    console.log(`Deleting stale user ${staleUserId}...`)

    // Check if user exists first
    const user = await prisma.usuario.findUnique({ where: { id: staleUserId } })
    if (!user) {
        console.log("User not found or already deleted.")
        return
    }

    // Delete related skipped memberships first if any (cascade usually handles this but let's be safe)
    // Delete relations first
    console.log("Deleting memberships...")
    await prisma.miembro.deleteMany({ where: { usuario_id: staleUserId } })

    console.log("Deleting invitations...")
    if (user.email) {
        await prisma.invitation.deleteMany({ where: { email: user.email } })
    }
    // Note: User might not have email or invitation might rely on user_id if implemented

    // Try deleting user
    console.log("Deleting user...")
    await prisma.usuario.delete({ where: { id: staleUserId } })
    console.log("Stale user deleted.")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => await prisma.$disconnect())
