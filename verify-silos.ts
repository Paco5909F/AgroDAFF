
import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
    console.log('--- Verifying Silo CRUD ---');

    try {
        // 1. Setup dependencies (Empresa, Cliente, Establecimiento)
        // We'll try to find existing ones first
        const empresa = await prisma.empresa.findFirst();
        if (!empresa) throw new Error("No empresa found");

        let establecimiento = await prisma.establecimiento.findFirst({
            where: { empresa_id: empresa.id }
        });

        if (!establecimiento) {
            console.log("Creating test establecimiento...");
            // Need a client first? 
            // Establecimiento belongs to Empresa directly? 
            // Looking at schema: model Establecimiento { empresa_id ... cliente_id ... }
            // It seems Establecimiento belongs to a Cliente usually, or Empresa?
            // Schema: 
            // model Establecimiento { 
            //   empresa_id String
            //   cliente_id String
            // }
            const cliente = await prisma.cliente.findFirst({ where: { empresa_id: empresa.id } });
            if (!cliente) throw new Error("No cliente found");

            establecimiento = await prisma.establecimiento.create({
                data: {
                    empresa_id: empresa.id,
                    cliente_id: cliente.id,
                    nombre: 'Test Est Silo',
                    modalidad: 'PROPIO',
                    localidad: 'Test Loc'
                }
            });
        }

        console.log(`Using Establecimiento: ${establecimiento.id}`);

        // 2. CREATE
        console.log("Testing CREATE...");
        const newSilo = await prisma.silo.create({
            data: {
                empresa_id: empresa.id,
                establecimiento_id: establecimiento.id,
                nombre: 'Silo Test 101',
                tipo: 'SILO_BOLSA',
                capacidad_max: 200,
                stock_actual: 50,
                humedad: 14.5,
                grano: 'SOJA',
                estado: 'ACTIVO',
                active: true
            }
        });
        console.log(`✅ Created Silo ID: ${newSilo.id}`);

        // 3. READ
        console.log("Testing READ...");
        const readSilo = await prisma.silo.findUnique({ where: { id: newSilo.id } });
        if (!readSilo) throw new Error("Computed silo not found");
        console.log(`✅ Read Silo: ${readSilo.nombre}, Stock: ${readSilo.stock_actual}`);

        // 4. UPDATE
        console.log("Testing UPDATE...");
        const updatedSilo = await prisma.silo.update({
            where: { id: newSilo.id },
            data: {
                stock_actual: 150,
                humedad: 13.0
            }
        });
        console.log(`✅ Updated Silo Stock: ${updatedSilo.stock_actual}`);
        if (Number(updatedSilo.stock_actual) !== 150) throw new Error("Update mismatch");

        // 5. DELETE (Soft)
        console.log("Testing DELETE (Soft)...");
        await prisma.silo.update({
            where: { id: newSilo.id },
            data: { active: false }
        });
        const softDeleted = await prisma.silo.findUnique({ where: { id: newSilo.id } });
        console.log(`✅ Soft Deleted Active Status: ${softDeleted?.active}`);
        if (softDeleted?.active !== false) throw new Error("Soft delete failed");

        // CLEANUP
        console.log("Cleaning up...");
        await prisma.silo.delete({ where: { id: newSilo.id } });
        console.log("✅ Cleanup complete");

    } catch (error) {
        console.error("❌ Test Failed:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

main();
