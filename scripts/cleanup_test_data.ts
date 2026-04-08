import { prisma } from '../src/lib/prisma'

async function main() {
    console.log("🧹 Iniciando Limpieza de Datos QA [TEST-QA]...");

    const orgs = await prisma.empresa.findMany({
        where: { nombre: { startsWith: '[TEST-QA]' } },
        select: { id: true }
    });

    if (orgs.length === 0) {
        console.log("✨ No hay datos QA para borrar.");
        return;
    }

    const orgIds = orgs.map(o => o.id);

    console.log(`🗑️ Borrando datos de ${orgIds.length} Empresas de Prueba...`);

    // We delete in order honoring Foreign Keys just in case Prisma doesn't have cascade in some fields
    const resLotes = await prisma.lote.deleteMany({ where: { empresa_id: { in: orgIds } } });
    console.log(`   - Borrados ${resLotes.count} Lotes.`);

    const resEsta = await prisma.establecimiento.deleteMany({ where: { empresa_id: { in: orgIds } } });
    console.log(`   - Borrados ${resEsta.count} Establecimientos.`);

    const resClientes = await prisma.cliente.deleteMany({ where: { empresa_id: { in: orgIds } } });
    console.log(`   - Borrados ${resClientes.count} Clientes.`);

    const resMiembros = await prisma.miembro.deleteMany({ where: { empresa_id: { in: orgIds } } });
    console.log(`   - Borrados ${resMiembros.count} Miembros.`);

    const fakeUsers = await prisma.usuario.findMany({
        where: { active_empresa_id: { in: orgIds } },
        select: { id: true }
    });
    
    if (fakeUsers.length > 0) {
        const fakeUserIds = fakeUsers.map(u => u.id);
        const resUsers = await prisma.usuario.deleteMany({ where: { id: { in: fakeUserIds } } });
        console.log(`   - Borrados ${resUsers.count} Usuarios de Prueba.`);
    }

    // Now delete the Test Companies
    const resEmpresas = await prisma.empresa.deleteMany({ where: { id: { in: orgIds } } });
    console.log(`   - Borradas ${resEmpresas.count} Empresas ficticias.`);

    console.log("\n✅ LIMPIEZA COMPLETADA CON ÉXITO. Sistema inmaculado.");
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
