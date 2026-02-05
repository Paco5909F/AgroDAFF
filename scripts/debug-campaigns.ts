import { prisma } from "@/lib/prisma"

async function main() {
    console.log('🔍 Checking Campaigns...')

    const campaigns = await prisma.campana.findMany({
        include: {
            empresa: {
                select: { nombre: true }
            }
        }
    })

    console.log(`Found ${campaigns.length} campaigns in total.`)

    campaigns.forEach(c => {
        console.log(`- [${c.activa ? 'ACTIVE' : 'INACTIVE'}] ID: ${c.id} | Name: ${c.nombre} | Empresa: ${c.empresa_id || 'NULL'} (${c.empresa?.nombre || 'No Company'})`)
    })

    const active = campaigns.filter(c => c.activa)
    console.log(`\nActive Campaigns: ${active.length}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
