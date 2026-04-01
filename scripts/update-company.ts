
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    const targetId = "ebdbd1bf-98a8-4321-afe2-48c0c5041d2d" // Rogelio's Company
    console.log(`Updating company ${targetId}...`)

    await prisma.empresa.update({
        where: { id: targetId },
        data: {
            direccion: "Av. Siempre Viva 742, Springfield",
            telefono: "11-1234-5678",
            email: "contacto@rogelioagro.com",
            cuit: "30-11223344-5"
        }
    })

    console.log("Company updated.")
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
