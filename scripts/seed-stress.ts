
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { faker } = require('@faker-js/faker');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🚀 Starting Stress Test Seeding...');
    console.log('🎯 Target: 100 Organizations, 5 Users each (500 Total)');

    const NUM_ORGS = 100;
    const USERS_PER_ORG = 5;

    // Prefetch some services for orders
    const services = await prisma.servicio.findMany({ take: 5 });

    if (services.length === 0) {
        console.error('❌ No services found. Please create some services first.');
        return;
    }

    const startTime = Date.now();

    for (let i = 0; i < NUM_ORGS; i++) {
        const orgName = `STRESS_TEST_${faker.company.name().toUpperCase()}`;

        // 1. Create Organization
        const empresa = await prisma.empresa.create({
            data: {
                nombre: orgName,
                direccion: faker.location.streetAddress(),
                cuit: faker.string.numeric(11),
                logo_url: faker.image.avatar(),
                plan_status: 'active'
            }
        });

        // 2. Create Users (1 Admin + 4 Members)
        const usersData = [];
        for (let j = 0; j < USERS_PER_ORG; j++) {
            const email = `stress_${Date.now()}_${i}_${j}@stress.com`;
            const role = j === 0 ? 'ADMIN' : 'LECTOR';

            // Create user in DB (mimicking Auth sync)
            const user = await prisma.usuario.create({
                data: {
                    id: faker.string.uuid(),
                    email: email,
                    nombre: faker.person.fullName(),
                    rol: role,
                    active_empresa_id: empresa.id,
                    created_at: faker.date.past()
                }
            });

            // Link to Company
            await prisma.miembro.create({
                data: {
                    usuario_id: user.id,
                    empresa_id: empresa.id,
                    rol: role
                }
            });
            usersData.push(user);
        }

        // 3. Create Business Data (Clients)
        const clients = [];
        for (let k = 0; k < 5; k++) {
            const client = await prisma.cliente.create({
                data: {
                    empresa_id: empresa.id,
                    razon_social: faker.company.name(),
                    cuit: faker.string.numeric(11),
                    email: faker.internet.email(),
                    telefono: faker.phone.number(),
                    condicion_iva: 'RESPONSABLE_INSCRIPTO',
                    localidad: faker.location.city(),
                    provincia: faker.location.state()
                }
            });
            clients.push(client);
        }

        // 4. Create Orders
        for (let l = 0; l < 5; l++) {
            const client = faker.helpers.arrayElement(clients);
            const service = faker.helpers.arrayElement(services);

            await prisma.ordenTrabajo.create({
                data: {
                    empresa_id: empresa.id,
                    cliente_id: client.id,
                    fecha: faker.date.recent({ days: 60 }),
                    estado: faker.helpers.arrayElement(['pendiente', 'completada', 'facturada']),
                    total: parseFloat(faker.commerce.price({ min: 1000, max: 50000 })),
                    moneda: 'ARS',
                    items: {
                        create: {
                            servicio_id: service.id,
                            cantidad: faker.number.int({ min: 1, max: 100 }),
                            precio_unit: parseFloat(faker.commerce.price({ min: 100, max: 1000 })),
                            total: parseFloat(faker.commerce.price({ min: 1000, max: 50000 }))
                        }
                    }
                }
            });
        }

        if (i % 10 === 0) {
            console.log(`✅ Created ${i + 1}/${NUM_ORGS} Organizations...`);
        }
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n🎉 Stress Test Seeding Completed in ${duration.toFixed(2)}s`);
    console.log(`📊 Created:`);
    console.log(`   - ${NUM_ORGS} Organizations`);
    console.log(`   - ${NUM_ORGS * USERS_PER_ORG} Users`);
    console.log(`   - ${NUM_ORGS * 5} Clients`);
    console.log(`   - ${NUM_ORGS * 5} Orders`);
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
