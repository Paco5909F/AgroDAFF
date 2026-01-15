
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    const staleUserId = '573f8e88-aa08-4e85-8705-e36496f94059' // The one holding the email
    console.log(`Renaming email for stale user ${staleUserId}...`)

    await prisma.usuario.update({
        where: { id: staleUserId },
        data: { email: `rosasjoaquin723+stale_${Date.now()}@gmail.com` }
    })

    console.log("Stale user email updated. Now running sync...")
}

main()
