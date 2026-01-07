import 'dotenv/config'
import { prisma } from './src/lib/prisma'

async function createTestCampana() {
    try {
        console.log("Attempting to create test campaign with ciclo...")
        const campana = await prisma.campana.create({
            data: {
                nombre: "Test Ciclo Check",
                fecha_inicio: new Date(),
                fecha_fin: new Date(),
                activa: false,
                tipo: "GENERAL",
                ciclo: "24/25"
            }
        })
        console.log("Success! Created:", campana)
        // Cleanup
        await prisma.campana.delete({ where: { id: campana.id } })
        console.log("Cleanup successful.")
    } catch (e) {
        console.error("Error creating campaign:", e)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

createTestCampana()
