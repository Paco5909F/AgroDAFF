import 'dotenv/config'
import { prisma } from "../src/lib/prisma"

async function main() {
    console.log("🚀 Starting Multi-Tenancy Migration...")

    // 1. Create Default Company
    console.log("🏢 Ensuring Default Company...")
    let defaultCompany = await prisma.empresa.findFirst({
        where: { nombre: "Empresa Default" }
    })

    if (!defaultCompany) {
        defaultCompany = await prisma.empresa.create({
            data: {
                nombre: "Empresa Default",
                cuit: "00-00000000-0",
                direccion: "Migración Automática"
            }
        })
        console.log("✅ Created Default Company:", defaultCompany.id)
    } else {
        console.log("ℹ️ Found existing Default Company:", defaultCompany.id)
    }

    const COMPANY_ID = defaultCompany.id

    // 2. Migrate Entidades Principales
    console.log("🔄 Migrating Entities...")

    const updateEntity = async (model: any, name: string) => {
        const result = await model.updateMany({
            where: { empresa_id: null },
            data: { empresa_id: COMPANY_ID }
        })
        console.log(`   - ${name}: ${result.count} updated`)
    }

    await updateEntity(prisma.cliente, "Clientes")
    await updateEntity(prisma.establecimiento, "Establecimientos")
    await updateEntity(prisma.silo, "Silos")
    await updateEntity(prisma.lote, "Lotes")
    await updateEntity(prisma.servicio, "Servicios")
    await updateEntity(prisma.ordenTrabajo, "Ordenes")
    await updateEntity(prisma.movimientoStock, "Movimientos")
    await updateEntity(prisma.campana, "Campanas")
    await updateEntity(prisma.presupuesto, "Presupuestos")
    await updateEntity(prisma.cartaPorte, "CartasPorte")
    await updateEntity(prisma.factura, "Facturas")

    // 3. Migrate Users & Roles
    console.log("👥 Migrating Users & Roles...")

    // Assign Company ID to all users
    await prisma.usuario.updateMany({
        where: { empresa_id: null },
        data: { empresa_id: COMPANY_ID }
    })

    // Map Legacy Roles
    let updated = 0
    const users = await prisma.usuario.findMany()

    for (const user of users) {
        let newRole = null
        // @ts-ignore
        if (user.rol === 'admin') newRole = 'ADMIN'
        // @ts-ignore
        if (user.rol === 'operario') newRole = 'MAQUINISTA' // Safety default
        // @ts-ignore
        if (user.rol === 'cliente') newRole = 'LECTOR'

        if (newRole) {
            await prisma.usuario.update({
                where: { id: user.id },
                // @ts-ignore
                data: { rol: newRole }
            })
            updated++
        }
    }
    console.log(`   - Users Roles Mapped: ${updated}`)

    console.log("✅ Migration Complete!")
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
