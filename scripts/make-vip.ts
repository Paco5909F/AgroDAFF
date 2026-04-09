import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const args = process.argv.slice(2)
    const searchQuery = args[0]

    if (!searchQuery) {
        console.error('❌ Por favor, indica el nombre exacto de la Empresa o su Email corporativo.')
        console.log('Ejemplo: npx tsx scripts/make-vip.ts "Nombre Empresa"')
        process.exit(1)
    }

    console.log(`Buscando empresa de amigo: "${searchQuery}"...`)

    // Buscamos la empresa
    const empresas = await prisma.empresa.findMany({
        where: {
            OR: [
                { nombre: { contains: searchQuery, mode: 'insensitive' } },
                { email: { equals: searchQuery, mode: 'insensitive' } }
            ]
        }
    })

    if (empresas.length === 0) {
        console.error('❌ No se encontró ninguna empresa con ese nombre o correo.')
        process.exit(1)
    }

    if (empresas.length > 1) {
        console.warn('⚠️ Se encontraron múltiples empresas con ese nombre. Por favor sé más específico:')
        empresas.forEach(e => console.log(`   - ${e.id}: ${e.nombre} (${e.email || 'Sin email'})`))
        process.exit(1)
    }

    const target = empresas[0]

    // Convertimos a VIP (Lifetime)
    await prisma.empresa.update({
        where: { id: target.id },
        data: {
            is_lifetime: true,
            plan_status: 'PRO' // Lo dejamos como Pro para los limites de BD
        }
    })

    console.log(`✅ ¡Éxito! La empresa "${target.nombre}" (ID: ${target.id}) ahora tiene estado VIP LIFETIME.`)
    console.log(`   Podrán usar la plataforma sin pagar ni tener límites.`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
