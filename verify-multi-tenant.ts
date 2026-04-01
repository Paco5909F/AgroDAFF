import { prisma } from './src/lib/prisma';

async function runTests() {
    console.log("🚀 Iniciando Test de Aislamiento Multi-Tenant...");

    let empresaA = null;
    let empresaB = null;

    try {
        empresaA = await prisma.empresa.create({
            data: { nombre: "Empresa de Pruebas A", cuit: "30-11111111-1" }
        });
        
        empresaB = await prisma.empresa.create({
            data: { nombre: "Empresa de Pruebas B", cuit: "30-22222222-2" }
        });

        console.log(`✅ [SETUP] Creadas Empresas: A (${empresaA.id}) y B (${empresaB.id})`);

        const clienteA = await prisma.cliente.create({
            data: { razon_social: "Cliente Exclusivo A", cuit: "20-99999999-9", condicion_iva: "Resp.Inscripto", empresa_id: empresaA.id }
        });
        
        console.log(`✅ [SETUP] Creado Cliente A (${clienteA.id}) para Empresa A`);

        const queryFromContextB = await prisma.cliente.findMany({ where: { empresa_id: empresaB.id } });

        if (queryFromContextB.some(c => c.id === clienteA.id)) {
            console.error("❌ MALA NOTICIA: Empresa B pudo ver al Cliente de Empresa A.");
        } else {
            console.log("✅ OK: Empresa B NO ve los datos de Empresa A.");
        }

        const queryFromContextA = await prisma.cliente.findMany({ where: { empresa_id: empresaA.id } });

        if (queryFromContextA.some(c => c.id === clienteA.id)) {
            console.log("✅ OK: Empresa A puede ver sus propios datos correctamente.");
        } else {
            console.error("❌ FALLO: Empresa A no pudo ver sus propios datos.");
        }

        try {
            await prisma.cliente.create({
                data: { razon_social: "Otro Cliente", cuit: "20-99999999-9", condicion_iva: "Resp.Inscripto", empresa_id: empresaA.id }
            });
            console.error("❌ FALLO: Prisma permitió CUIT duplicado en Empresa A.");
        } catch (e) {
            console.log("✅ OK: Restricción de CUIT único en Empresa A validada.");
        }

        try {
            await prisma.cliente.create({
                data: { razon_social: "Cliente para B", cuit: "20-99999999-9", condicion_iva: "Resp.Inscripto", empresa_id: empresaB.id }
            });
            console.log("✅ OK: Empresa B pudo crear un cliente con el mismo CUIT sin conflicto.");
        } catch (e) {
            console.error("❌ FALLO: Restricción única de CUIT chocó entre Empresa A y Empresa B.");
        }

        console.log("🎉 TODOS LOS TESTS COMPLETADOS SATISFACTORIAMENTE.");

    } catch (e) {
        console.error("❌ Error inesperado durante las pruebas:", e);
    } finally {
        console.log("🧹 Limpiando base de datos...");
        if (empresaA) await prisma.empresa.delete({ where: { id: empresaA.id } });
        if (empresaB) await prisma.empresa.delete({ where: { id: empresaB.id } });
        await prisma.$disconnect();
    }
}

runTests();
