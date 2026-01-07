
import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('Starting Presupuesto Debug...');

    const cliente = await prisma.cliente.findFirst();
    const servicio = await prisma.servicio.findFirst();

    if (!cliente || !servicio) {
        console.error('Need client and service to test');
        return;
    }

    console.log('Client:', cliente.id);
    console.log('Service:', servicio.id);

    // Matches formattedData structure
    const data = {
        cliente_id: cliente.id,
        fecha: new Date(),
        valido_hasta: null,
        observaciones: "Test Debug",
        total: 1500,
        items: [
            {
                servicio_id: servicio.id,
                cantidad: 10,
                precio_unit: 150,
                subtotal: 1500 // 10 * 150
            }
        ]
    };

    console.log('Payload:', JSON.stringify(data, null, 2));

    try {
        const result = await prisma.presupuesto.create({
            data: {
                cliente_id: data.cliente_id,
                fecha: data.fecha,
                valido_hasta: data.valido_hasta,
                total: data.total,
                observaciones: data.observaciones,
                estado: 'PENDIENTE',
                items: {
                    create: data.items.map((item) => ({
                        servicio_id: item.servicio_id,
                        cantidad: item.cantidad,
                        precio_unit: item.precio_unit,
                        subtotal: item.subtotal
                    }))
                }
            }
        });
        console.log('✅ Success:', result.id);

        // Clean up
        await prisma.presupuesto.delete({ where: { id: result.id } });

    } catch (e) {
        console.log('❌ Error:', e);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        // await prisma.$disconnect(); // Handled by standard lib
    });
