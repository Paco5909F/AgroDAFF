
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = "postgresql://postgres.ypjckowvcadyzaqrcsgi:eqVHnhobWaVxIWv3@aws-1-us-east-2.pooler.supabase.com:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Starting CRUD Verification...");

    // 1. Get a client
    const cliente = await prisma.cliente.findFirst();
    if (!cliente) {
        console.error("❌ No clients found to test with.");
        process.exit(1);
    }
    console.log(`✅ Using client: ${cliente.razon_social}`);

    // 2. Create
    console.log("Testing Create...");
    const created = await prisma.cartaPorte.create({
        data: {
            ctg: "TEST-CRUD-123",
            fecha_carga: new Date(),
            cliente_id: cliente.id,
            origen: "Origen Test",
            destino: "Destino Test",
            chofer: "Chofer Test",
            patente_camion: "AA000AA",
            kilos_estimados: 1000,
            estado: "EMITIDA"
        }
    });
    console.log(`✅ Created CP ID: ${created.id}`);

    // 3. Update
    console.log("Testing Update...");
    const updated = await prisma.cartaPorte.update({
        where: { id: created.id },
        data: {
            chofer: "Chofer Updated",
            kilos_estimados: 2000
        }
    });

    if (updated.chofer === "Chofer Updated" && Number(updated.kilos_estimados) === 2000) {
        console.log(`✅ Update Successful: ${updated.chofer}, ${updated.kilos_estimados}`);
    } else {
        console.error("❌ Update Failed");
        console.log(updated);
    }

    // 4. Delete
    console.log("Testing Delete...");
    await prisma.cartaPorte.delete({
        where: { id: created.id }
    });

    const check = await prisma.cartaPorte.findUnique({ where: { id: created.id } });
    if (!check) {
        console.log("✅ Delete Successful");
    } else {
        console.error("❌ Delete Failed - Record still exists");
    }

    console.log("🎉 CRUD Verification Complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
