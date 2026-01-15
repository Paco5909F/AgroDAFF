import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

async function main() {
    const companies = await prisma.empresa.findMany({ select: { id: true, nombre: true } })
    console.table(companies)
}
main()
