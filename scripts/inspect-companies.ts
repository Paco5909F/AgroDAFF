import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    console.log("Fetching all companies...")
    const companies = await prisma.empresa.findMany({
        select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
            cuit: true
        }
    })
    console.log(JSON.stringify(companies, null, 2))
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect())
