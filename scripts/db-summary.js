
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
    try {
        const companies = await prisma.empresa.findMany({
            include: {
                _count: {
                    select: {
                        clientes: true,
                        ordenes: true,
                        presupuestos: true,
                        miembros: true
                    }
                }
            }
        });

        console.log("=== RESUMEN DE EMPRESAS Y DATOS ===");
        companies.forEach(c => {
            console.log(`\nEmpresa: [${c.nombre}] (ID: ${c.id})`);
            console.log(`  - Clientes: ${c._count.clientes}`);
            console.log(`  - Órdenes: ${c._count.ordenes}`);
            console.log(`  - Presupuestos: ${c._count.presupuestos}`);
            console.log(`  - Miembros: ${c._count.miembros}`);
        });

        const admin = await prisma.usuario.findFirst({
            where: { email: 'admin@eltrisquel.com' }
        });

        if (admin) {
            console.log(`\n=== ESTADO DEL ADMIN ===`);
            console.log(`Usuario: ${admin.email}`);
            console.log(`Empresa Activa Actual: ${admin.active_empresa_id}`);

            const activeCompany = companies.find(c => c.id === admin.active_empresa_id);
            if (activeCompany) {
                console.log(`-> Estás viendo: "${activeCompany.nombre}"`);
            } else {
                console.log(`-> Estás viendo una empresa que NO EXISTE o NULL.`);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

main();
