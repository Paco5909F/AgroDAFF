
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🧹 Starting Stress Test Cleanup...');

    // 1. Identify Target Companies
    const targetCompanies = await prisma.empresa.findMany({
        where: {
            nombre: { startsWith: 'STRESS_TEST_' }
        },
        select: { id: true }
    });

    const companyIds = targetCompanies.map(c => c.id);
    console.log(`🎯 Found ${companyIds.length} Stress Test Organizations to delete.`);

    if (companyIds.length === 0) {
        console.log("✅ No data to clean up.");
        return;
    }

    const startTime = Date.now();

    // 2. Delete Child Records (Dependency Order)

    // Level 4: Items & Movements
    console.log("   - Deleting Items & Movements...");
    await prisma.ordenItem.deleteMany({ where: { orden: { empresa_id: { in: companyIds } } } });
    await prisma.presupuestoItem.deleteMany({ where: { presupuesto: { empresa_id: { in: companyIds } } } });
    await prisma.movimientoStock.deleteMany({ where: { empresa_id: { in: companyIds } } });

    // Level 3: Documents (Orders, Budgets, Logistics, Invoices)
    console.log("   - Deleting Documents...");
    // Facturas link to Ordenes. If Invoice has empresa_id, delete it. If dependent on Orden, we might need cascade or delete first.
    await prisma.factura.deleteMany({ where: { empresa_id: { in: companyIds } } });
    await prisma.ordenTrabajo.deleteMany({ where: { empresa_id: { in: companyIds } } });
    await prisma.presupuesto.deleteMany({ where: { empresa_id: { in: companyIds } } });
    await prisma.cartaPorte.deleteMany({ where: { empresa_id: { in: companyIds } } });

    // Level 2: Agricultural Structure
    console.log("   - Deleting Agricultural Structure...");
    // Lotes depend on Establecimiento
    await prisma.lote.deleteMany({ where: { empresa_id: { in: companyIds } } });
    // Silos depend on Establecimiento
    await prisma.silo.deleteMany({ where: { empresa_id: { in: companyIds } } });
    await prisma.establecimiento.deleteMany({ where: { empresa_id: { in: companyIds } } });
    await prisma.campana.deleteMany({ where: { empresa_id: { in: companyIds } } });

    // Level 1: Master Data
    console.log("   - Deleting Master Data...");
    // Service & Client
    await prisma.servicio.deleteMany({ where: { empresa_id: { in: companyIds } } });
    await prisma.cliente.deleteMany({ where: { empresa_id: { in: companyIds } } });

    // Level 0: Relations & Users
    console.log("   - Deleting Memberships...");
    await prisma.miembro.deleteMany({ where: { empresa_id: { in: companyIds } } });

    console.log("   - Deleting Companies...");
    await prisma.empresa.deleteMany({ where: { id: { in: companyIds } } });

    // Cleanup Users (orphaned stress users)
    console.log("   - Deleting Stress Users...");
    const deletedUsers = await prisma.usuario.deleteMany({
        where: {
            email: { startsWith: 'stress_' },
            email: { endsWith: '@stress.com' }
        }
    });

    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n🎉 Cleanup Completed in ${duration.toFixed(2)}s`);
    console.log(`🗑️  Deleted ${deletedUsers.count} Users and ${companyIds.length} Companies.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
