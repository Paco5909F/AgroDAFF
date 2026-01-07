const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');

const connectionString = "postgresql://postgres.ypjckowvcadyzaqrcsgi:eqVHnhobWaVxIWv3@aws-1-us-east-2.pooler.supabase.com:5432/postgres";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("1. Testing Database Connection...");
    try {
        await prisma.$connect();
        console.log("✅ Connection Successful");
    } catch (e) {
        console.error("❌ Connection Failed:", e.message);
        process.exit(1);
    }

    console.log("\n2. Identifying Test Client...");
    const client = await prisma.cliente.findFirst();
    if (!client) {
        console.error("❌ No clients found. Cannot test Carta Porte creation.");
        return;
    }
    console.log(`✅ Using Client: ${client.razon_social} (${client.id})`);

    console.log("\n3. Testing Carta Porte Creation...");
    try {
        const cp = await prisma.cartaPorte.create({
            data: {
                cliente_id: client.id,
                ctg: "TEST-" + Date.now(),
                origen: "TEST ORIGIN",
                destino: "TEST DESTINATION",
                chofer: "TEST DRIVER",
                patente_camion: "AA123BB",
                kilos_estimados: 30000.50,
                estado: "EMITIDA"
            }
        });
        console.log("✅ Carta Porte Created Successfully:", cp.id);

        console.log("\n4. Testing Carta Porte Retrieval...");
        const fetched = await prisma.cartaPorte.findUnique({
            where: { id: cp.id }
        });

        if (fetched) {
            console.log("✅ Carta Porte Retrieved:");
            console.log(`   - CTG: ${fetched.ctg}`);
            console.log(`   - Kilos: ${fetched.kilos_estimados}`);

            // Verify Decimal to Number conversion logic used in the app
            const num = Number(fetched.kilos_estimados);
            console.log(`   - Kilos (as Number): ${num}`);
        } else {
            console.error("❌ Failed to retrieve created Carta Porte");
        }

        // Cleanup
        console.log("\n5. Cleaning up test data...");
        await prisma.cartaPorte.delete({ where: { id: cp.id } });
        console.log("✅ Test data deleted");

    } catch (e) {
        console.error("❌ Test Failed:", e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
