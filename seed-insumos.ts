import { prisma } from './src/lib/prisma';

const insumosGlobales = [
    // Herbicidas
    { nombre: 'Glifosato', tipo: 'herbicida', unidad_medida: 'litro' },
    { nombre: '2,4-D', tipo: 'herbicida', unidad_medida: 'litro' },
    { nombre: 'Atrazina', tipo: 'herbicida', unidad_medida: 'litro' },
    { nombre: 'Dicamba', tipo: 'herbicida', unidad_medida: 'litro' },
    // Fertilizantes
    { nombre: 'Urea', tipo: 'fertilizante', unidad_medida: 'kg' },
    { nombre: 'Fosfato Diamónico (DAP)', tipo: 'fertilizante', unidad_medida: 'kg' },
    { nombre: 'NPK', tipo: 'fertilizante', unidad_medida: 'kg' },
    // Semillas
    { nombre: 'Soja', tipo: 'semilla', unidad_medida: 'kg' },
    { nombre: 'Maíz', tipo: 'semilla', unidad_medida: 'kg' },
    { nombre: 'Trigo', tipo: 'semilla', unidad_medida: 'kg' },
    // Otros
    { nombre: 'Gasoil', tipo: 'combustible', unidad_medida: 'litro' },
    { nombre: 'Inoculante', tipo: 'otros', unidad_medida: 'dosis' },
];

async function seedGlobalInsumos() {
    console.log("🌱 Iniciando Seed de Insumos Globales...");
    try {
        for (const insumo of insumosGlobales) {
            // Check if exists as global to avoid duplicates
            const existing = await prisma.insumo.findFirst({
                where: {
                    nombre: insumo.nombre,
                    es_global: true
                }
            });

            if (!existing) {
                await prisma.insumo.create({
                    data: {
                        nombre: insumo.nombre,
                        tipo: insumo.tipo,
                        unidad_medida: insumo.unidad_medida,
                        es_global: true,
                        empresa_id: null // Explicitly null for globals
                    }
                });
                console.log(`✅ Creado insumo global: ${insumo.nombre}`);
            } else {
                console.log(`ℹ️ Insumo ${insumo.nombre} ya existe como global.`);
            }
        }
        console.log("🎉 Seed completado con éxito.");
    } catch (error) {
        console.error("❌ Error en seed de insumos:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedGlobalInsumos();
