import 'dotenv/config'
import { prisma } from './src/lib/prisma'

async function listCampanas() {
    try {
        const campanas = await prisma.campana.findMany()
        console.log("Current Campanas:")
        campanas.forEach(c => {
            console.log(`${c.id} | ${c.nombre} | Activa: ${c.activa} | Ciclo: ${(c as any).ciclo}`)
        })
    } catch (e) {
        console.error(e)
    } finally {
        await prisma.$disconnect()
    }
}

listCampanas()
