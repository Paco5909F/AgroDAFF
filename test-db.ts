import { prisma } from './src/lib/prisma';

async function check() {
    try {
        const cartas = await prisma.cartaPorte.findMany({ select: { id: true, empresa_id: true } });
        console.log("Cartas de Porte:", cartas);
        
        const insumos = await prisma.insumo.findMany({ select: { id: true, empresa_id: true, es_global: true } });
        console.log("Insumos count:", insumos.length);
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect()
    }
}
check();
