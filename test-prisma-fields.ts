
import 'dotenv/config';
import { prisma } from './src/lib/prisma';

async function main() {
    console.log('--- Verifying Prisma Client Fields ---');

    try {
        // 1. Fetch a client to link the CartaPorte to
        const cliente = await prisma.cliente.findFirst();

        if (!cliente) {
            console.error('No Cliente found. Cannot verify CartaPorte creation without a client.');
            // Try to create a dummy client if none exists
            console.log('Creating a dummy client for testing...');
            const newClient = await prisma.cliente.create({
                data: {
                    nombre: 'Test Client',
                    email: 'test@example.com',
                    telefono: '123456789',
                    direccion: 'Test Address',
                    cuit: '20-12345678-9',
                }
            });
            await runTest(newClient.id);
        } else {
            await runTest(cliente.id);
        }
    } catch (err) {
        console.error('Top level error:', err);
        process.exit(1);
    }
}

async function runTest(clienteId: string) {
    try {
        console.log(`Using client ID: ${clienteId}`);

        // 2. Attempt to create a CartaPorte with the NEW fields
        // If Prisma Client is outdated, this will throw "Unknown argument"
        const carta = await prisma.cartaPorte.create({
            data: {
                cliente_id: clienteId,
                origen: 'Test Origen',
                destino: 'Test Destino',
                chofer: 'Test Chofer',
                patente_camion: 'ABC 123',
                kilos_estimados: 30000,
                estado: 'BORRADOR',

                // NEW FIELDS:
                peso_bruto: 45000,
                peso_tara: 15000,
                cuit_chofer: '20-87654321-9'
            }
        });

        console.log('✅ SUCCESS: CartaPorte created successfully with new fields!');
        console.log('Created ID:', carta.id);
        console.log('Peso Bruto:', carta.peso_bruto);

        // Clean up
        await prisma.cartaPorte.delete({ where: { id: carta.id } });
        console.log('Test record cleaned up.');

    } catch (error) {
        console.error('❌ FAILURE: Could not create CartaPorte.');
        console.error(error);
        process.exit(1);
    } finally {
        // Since we imported the singleton prisma, we don't necessarily want to disconnect it 
        // if it's used elsewhere, but for a script it's fine.
        // However, the singleton might handle connections differently.
        // We'll just exit.
        process.exit(0);
    }
}

main();
