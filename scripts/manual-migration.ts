
import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('Starting Manual Migration...');

    try {
        // 1. Create Table
        await prisma.$executeRawUnsafe(`
            CREATE TABLE IF NOT EXISTS "public"."presupuesto_items" (
                "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
                "presupuesto_id" UUID NOT NULL,
                "servicio_id" UUID NOT NULL,
                "cantidad" DECIMAL(12,4) NOT NULL,
                "precio_unit" DECIMAL(12,2) NOT NULL,
                "subtotal" DECIMAL(14,2) NOT NULL,
                CONSTRAINT "presupuesto_items_pkey" PRIMARY KEY ("id")
            );
        `);
        console.log('✅ Table presupuesto_items created/verified.');

        // 2. Add FKs (Check first to avoid error? Or drop if exists)
        // Ignoring checking, Postgres handles "ADD CONSTRAINT" by failing if name exists usually.
        // We wrap in try/catch individual blocks or use idempotent SQL
        try {
            await prisma.$executeRawUnsafe(`
                ALTER TABLE "public"."presupuesto_items" 
                ADD CONSTRAINT "presupuesto_items_presupuesto_id_fkey" 
                FOREIGN KEY ("presupuesto_id") REFERENCES "public"."presupuestos"("id") 
                ON DELETE CASCADE ON UPDATE CASCADE;
            `);
            console.log('✅ FK presupuesto_id added.');
        } catch (e: any) {
            console.log('ℹ️ FK presupuesto_id might exist:', e.message.split('\n')[0]);
        }

        try {
            await prisma.$executeRawUnsafe(`
                ALTER TABLE "public"."presupuesto_items" 
                ADD CONSTRAINT "presupuesto_items_servicio_id_fkey" 
                FOREIGN KEY ("servicio_id") REFERENCES "public"."servicios"("id") 
                ON DELETE RESTRICT ON UPDATE CASCADE;
            `);
            console.log('✅ FK servicio_id added.');
        } catch (e: any) {
            console.log('ℹ️ FK servicio_id might exist:', e.message.split('\n')[0]);
        }

        // 3. Make old columns nullable
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "public"."presupuestos" ALTER COLUMN "servicio_id" DROP NOT NULL;
        `);
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "public"."presupuestos" ALTER COLUMN "cantidad" DROP NOT NULL;
        `);
        await prisma.$executeRawUnsafe(`
            ALTER TABLE "public"."presupuestos" ALTER COLUMN "precio_unit" DROP NOT NULL;
        `);
        console.log('✅ Old columns made nullable.');

    } catch (e) {
        console.error('❌ Migration Failed:', e);
    }
}

main()
    .finally(async () => {
        // await prisma.$disconnect();
    });
