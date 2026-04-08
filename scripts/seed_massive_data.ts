import { prisma } from '../src/lib/prisma'
import { faker } from '@faker-js/faker'

const ORGS_COUNT = 5
const USERS_PER_ORG = 10
const CLIENTS_PER_ORG = 20
const LOTES_PER_ORG = 10

// Reduced counts to avoid timing out standard executions, but still enough to test structure
// Original plan: 50 orgs, 100 clients. Totaling thousands.
// For faster feedback loops but still simulating load: 5 orgs, 100 clients = 500 records.
// Can be scaled up explicitly.

async function main() {
    console.log("🚀 Iniciando Seed Masivo [TEST-QA]...");
    const startTime = Date.now();

    for (let i = 0; i < 50; i++) {
        // Generating 50 Orgs
        const empresaNombre = `[TEST-QA] ${faker.company.name()}`;
        const empresa = await prisma.empresa.create({
            data: {
                nombre: empresaNombre,
                plan_status: 'PRO', // or FREE
                is_lifetime: false,
            }
        });

        // Generate Users for this company
        const membersData = Array.from({ length: USERS_PER_ORG }).map(() => {
            return {
                id: faker.string.uuid(),
                email: faker.internet.email(),
                nombre: faker.person.fullName(),
                rol: 'LECTOR' as any,
                active_empresa_id: empresa.id,
                empresa_id: empresa.id
            }
        });

        // Insert Users (Usuarios)
        for (const u of membersData) {
            await prisma.usuario.create({
                data: {
                    id: u.id,
                    email: faker.internet.email(),
                    nombre: u.nombre,
                    rol: u.rol,
                    active_empresa_id: u.active_empresa_id,
                    empresa_id: u.empresa_id,
                    miembros: {
                        create: {
                            empresa_id: empresa.id,
                            rol: 'LECTOR'
                        }
                    }
                }
            })
        }

        // Generate Clientes
        const clientesData = Array.from({ length: 10 }).map(() => ({
            razon_social: faker.company.name(),
            cuit: faker.string.numeric(11),
            condicion_iva: 'Responsable Inscripto',
            email: faker.internet.email(),
            empresa_id: empresa.id
        }));

        await prisma.cliente.createMany({
            data: clientesData
        });

        // Generate an Establecimiento for the first client just for reference, or a detached one?
        // Let's get the created clients to link them
        const createdClientes = await prisma.cliente.findMany({ where: { empresa_id: empresa.id } });
        
        if (createdClientes.length > 0) {
            const cliente = createdClientes[0];
            const esta = await prisma.establecimiento.create({
                data: {
                    nombre: `Estancia ${faker.location.city()}`,
                    cliente_id: cliente.id,
                    empresa_id: empresa.id,
                    modalidad: 'Propio'
                }
            });

            // Generate Lotes linked to the Establecimiento
            const lotesData = Array.from({ length: 50 }).map(() => ({
                nombre: `Lote ${faker.location.city()}`,
                hectareas: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }),
                establecimiento_id: esta.id,
                empresa_id: empresa.id
            }));

            await prisma.lote.createMany({
                data: lotesData
            });
        }

        process.stdout.write(`\r✅ Insertada Org ${i + 1}/50: ${empresaNombre}`);
    }

    const duration = (Date.now() - startTime) / 1000;
    console.log(`\n🎉 Seed Completado en ${duration}s.`);
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
