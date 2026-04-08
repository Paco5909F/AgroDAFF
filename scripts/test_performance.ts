import { prisma } from '../src/lib/prisma'

async function main() {
    console.log("⚡ Iniciando Pruebas de Carga (Load Test)...");

    const testOrgs = await prisma.empresa.findMany({
        where: { nombre: { startsWith: '[TEST-QA]' } },
        take: 1
    });

    if (testOrgs.length === 0) {
        console.error("❌ No hay datos [TEST-QA]. Ejecute seed_massive_data.ts");
        process.exit(1);
    }

    const orgId = testOrgs[0].id;
    const CONCURRENT_REQUESTS = 100;

    console.log(`📡 Disparando ${CONCURRENT_REQUESTS} consultas DB concurrentes para simular carga máxima de usuarios...`);

    const startTime = Date.now();
    let successCount = 0;
    let errorCount = 0;

    // Creating an array of promises fetching multiple tables in parallel
    const promises = Array.from({ length: CONCURRENT_REQUESTS }).map(async (_, index) => {
        try {
            // Complex join query simulating a dashboard load
            await prisma.ordenTrabajo.findMany({
                where: { empresa_id: orgId },
                include: {
                    cliente: true,
                    items: {
                        include: { lote: true, servicio: true }
                    }
                },
                take: 50,
                orderBy: { created_at: 'desc' }
            });
            successCount++;
        } catch (e) {
            errorCount++;
        }
    });

    await Promise.all(promises);

    const duration = Date.now() - startTime;
    const requestsPerSecond = (CONCURRENT_REQUESTS / (duration / 1000)).toFixed(2);

    console.log("\n📊 RESULTADOS DEL STRESS TEST:");
    console.log(`⏱️ Tiempo Total: ${duration}ms`);
    console.log(`✅ Exitosas: ${successCount}`);
    console.log(`❌ Fallidas: ${errorCount}`);
    console.log(`🚀 Throughput: ${requestsPerSecond} req/segundo`);

    if (errorCount > 0) {
        console.warn("\n⚠️ Ocurrieron errores bajo carga. Se recomienda revisar el Connection Pooling en Supabase / Prisma.");
    } else {
        console.log("\n✅ Base de datos soportó la carga masiva perfectamente.");
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
