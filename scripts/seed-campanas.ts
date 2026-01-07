
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Seeding Campanas...')

    // Fina 24/25 (Trigo 2024)
    // Start: May 2024, End: Dec 2024
    const fina24 = await prisma.campana.create({
        data: {
            nombre: 'Campaña 2024 - Fina',
            fecha_inicio: new Date('2024-05-01'),
            fecha_fin: new Date('2024-12-31'),
            activa: false,
            tipo: 'FINA'
        }
    })
    console.log('Created:', fina24.nombre)

    // Gruesa 24/25 (Soja 2025)
    // Start: Sep 2024, End: June 2025
    const gruesa2425 = await prisma.campana.create({
        data: {
            nombre: 'Campaña 24/25 - Gruesa',
            fecha_inicio: new Date('2024-09-01'),
            fecha_fin: new Date('2025-06-30'),
            activa: true, // Set as active
            tipo: 'GRUESA'
        }
    })
    console.log('Created:', gruesa2425.nombre)

    // Fina 25/26 (Trigo 2025)
    const fina25 = await prisma.campana.create({
        data: {
            nombre: 'Campaña 2025 - Fina',
            fecha_inicio: new Date('2025-05-01'),
            fecha_fin: new Date('2025-12-31'),
            activa: false,
            tipo: 'FINA'
        }
    })
    console.log('Created:', fina25.nombre)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
