
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function benchmark() {
    console.log('🚀 Starting Performance Benchmarks...');

    // 1. Fetch a random Stress User
    const user = await prisma.usuario.findFirst({
        where: { email: { startsWith: 'stress_' }, rol: 'ADMIN' },
        include: { empresa: true } // Legacy relation or check active_empresa_id
    });

    if (!user) {
        console.error('❌ No stress user found. Run seeding first.');
        return;
    }

    const empresaId = user.active_empresa_id;
    console.log(`👤 Testing as User: ${user.email}`);
    console.log(`🏢 Organization ID: ${empresaId}`);

    // Helper to measure
    const measure = async (name, fn) => {
        const start = performance.now();
        await fn();
        const end = performance.now();
        const duration = (end - start).toFixed(2);
        console.log(`⏱️  [${name}] took ${duration}ms`);
        return duration;
    };

    // TEST 1: Dashboard Stats (Count Orders, Clients, etc.)
    await measure('Dashboard Stats', async () => {
        await Promise.all([
            prisma.ordenTrabajo.count({ where: { empresa_id: empresaId } }),
            prisma.cliente.count({ where: { empresa_id: empresaId } }),
            prisma.presupuesto.count({ where: { empresa_id: empresaId } }),
            // Simulate complex join/aggregation if needed
            prisma.ordenTrabajo.findMany({
                where: { empresa_id: empresaId },
                take: 5,
                include: { items: true, cliente: true }
            })
        ]);
    });

    // TEST 2: List Orders (Pagination)
    await measure('List Orders (Page 1)', async () => {
        await prisma.ordenTrabajo.findMany({
            where: { empresa_id: empresaId },
            take: 20,
            skip: 0,
            orderBy: { created_at: 'desc' },
            include: { cliente: true, items: true }
        });
    });

    // TEST 3: Heavy Query (All Clients with Establishments)
    await measure('List Clients + Relations', async () => {
        await prisma.cliente.findMany({
            where: { empresa_id: empresaId },
            include: { establecimientos: true }
        });
    });

    // TEST 4: RLS / Isolation Check
    // Try to fetch data from ANOTHER organization
    console.log('\n🔒 Testing Data Isolation...');
    const otherOrg = await prisma.empresa.findFirst({
        where: { id: { not: empresaId }, nombre: { startsWith: 'STRESS' } }
    });

    if (otherOrg) {
        // In a real RLS environment (Supabase), the database policy prevents this.
        // Here, we are using Prisma Client which bypasses RLS unless we use a specific setup using SET app.current_empresa_id
        // BUT, our app logic relies on `where: { empresa_id: ... }`.
        // So we check if our Queries *accidentally* return data if we omit the filter (simulating a developer bug).

        const leakingOrders = await prisma.ordenTrabajo.findFirst({
            where: { empresa_id: otherOrg.id }
        });

        if (leakingOrders) {
            console.log(`ℹ️  [Isolation] Prisma Client CAN access other org data (Normal for Admin Client).`);
            console.log(`    ⚠️  Ensure your Server Actions ALWAYS force 'empresa_id' filter!`);
        }
    }

    console.log('\n✅ Benchmarks Complete.');
}

benchmark()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
