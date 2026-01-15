
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
    const users = await prisma.usuario.count();
    const orgs = await prisma.empresa.count();
    const orders = await prisma.ordenTrabajo.count();
    const clients = await prisma.cliente.count();

    console.log(`📊 Final Counts:`);
    console.log(`- Users: ${users}`);
    console.log(`- Organizations: ${orgs}`);
    console.log(`- Orders: ${orders}`);
    console.log(`- Clients: ${clients}`);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
