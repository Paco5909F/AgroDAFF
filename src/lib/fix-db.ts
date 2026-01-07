import 'dotenv/config'
import { prisma } from "./prisma"

async function main() {
    console.log('Starting manual schema patch...')

    try {
        // 1. Fix Clientes Table
        console.log('Patching clientes table...')
        await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        -- Add columns if they don't exist
        BEGIN
            ALTER TABLE "clientes" ADD COLUMN "persona_contacto" TEXT;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column persona_contacto already exists in clientes.';
        END;

        BEGIN
            ALTER TABLE "clientes" ADD COLUMN "tipo_cliente" TEXT;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column tipo_cliente already exists in clientes.';
        END;

        BEGIN
            ALTER TABLE "clientes" ADD COLUMN "localidad" TEXT;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column localidad already exists in clientes.';
        END;

        BEGIN
            ALTER TABLE "clientes" ADD COLUMN "provincia" TEXT;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column provincia already exists in clientes.';
        END;

        BEGIN
            ALTER TABLE "clientes" ADD COLUMN "observaciones" TEXT;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column observaciones already exists in clientes.';
        END;

        BEGIN
            ALTER TABLE "clientes" ADD COLUMN "localidad_id" UUID;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column localidad_id already exists in clientes.';
        END;

        BEGIN
            ALTER TABLE "clientes" ADD COLUMN "deleted_at" TIMESTAMPTZ;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column deleted_at already exists in clientes.';
        END;
      END $$;
    `)

        // 2. Create Establecimientos Table
        console.log('Creating establecimientos table if needed...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "establecimientos" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "nombre" TEXT NOT NULL,
        "cliente_id" UUID NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMPTZ,
        CONSTRAINT "establecimientos_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "establecimientos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

        // 3. Create Lotes Table
        console.log('Creating lotes table if needed...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "lotes" (
        "id" UUID NOT NULL DEFAULT gen_random_uuid(),
        "nombre" TEXT NOT NULL,
        "hectareas" DECIMAL(10,4) NOT NULL DEFAULT 0,
        "establecimiento_id" UUID NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "deleted_at" TIMESTAMPTZ,
        CONSTRAINT "lotes_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "lotes_establecimiento_id_fkey" FOREIGN KEY ("establecimiento_id") REFERENCES "establecimientos"("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `)

        // 4. Fix Ordenes Table (Audit fields)
        console.log('Patching ordenes_trabajo table...')
        await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        BEGIN
            ALTER TABLE "ordenes_trabajo" ADD COLUMN "created_by" UUID;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column created_by already exists.';
        END;
        BEGIN
            ALTER TABLE "ordenes_trabajo" ADD COLUMN "precio_unit" DECIMAL(12,2);
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column precio_unit already exists.';
        END;
        BEGIN
            ALTER TABLE "ordenes_trabajo" ADD COLUMN "observaciones" TEXT;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column observaciones already exists.';
        END;
      END $$;
    `)

        // 5. Create Presupuestos Table
        console.log('Creating presupuestos table if needed...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "presupuestos" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "fecha" DATE NOT NULL DEFAULT CURRENT_DATE,
          "valido_hasta" DATE,
          "cliente_id" UUID NOT NULL,
          "servicio_id" UUID NOT NULL,
          "cantidad" DECIMAL(12,4) NOT NULL,
          "precio_unit" DECIMAL(12,2) NOT NULL,
          "total" DECIMAL(14,2) NOT NULL,
          "estado" TEXT NOT NULL DEFAULT 'PENDIENTE',
          "observaciones" TEXT,
          "created_by" UUID,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updated_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "presupuestos_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "presupuestos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
          CONSTRAINT "presupuestos_servicio_id_fkey" FOREIGN KEY ("servicio_id") REFERENCES "servicios"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `)

        // 6. Create Cartas Porte Table
        console.log('Creating cartas_porte table if needed...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "cartas_porte" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "ctg" TEXT,
          "fecha_carga" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "cliente_id" UUID NOT NULL,
          "origen" TEXT NOT NULL,
          "destino" TEXT NOT NULL,
          "remitente_comercial" TEXT,
          "corredor" TEXT,
          "entregador" TEXT,
          "destinatario" TEXT,
          "chofer" TEXT NOT NULL,
          "patente_camion" TEXT NOT NULL,
          "patente_acoplado" TEXT,
          "kilos_estimados" DECIMAL(12,2) NOT NULL,
          "observaciones" TEXT,
          "estado" TEXT NOT NULL DEFAULT 'EMITIDA',
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "cartas_porte_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "cartas_porte_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `)

        // 7. Create Facturas Table
        console.log('Creating facturas table if needed...')
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "facturas" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "orden_trabajo_id" UUID NOT NULL,
          "tipo_comprobante" TEXT NOT NULL,
          "punto_venta" INTEGER NOT NULL,
          "numero" BIGINT NOT NULL,
          "cae" TEXT,
          "fecha_vencimiento" DATE,
          "total" DECIMAL(14,2) NOT NULL,
          "fecha_emision" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          "estado_afip" TEXT DEFAULT 'PENDIENTE',
          "observaciones_afip" TEXT,
          "pdf_url" TEXT,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "facturas_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "facturas_orden_trabajo_id_key" UNIQUE ("orden_trabajo_id"),
          CONSTRAINT "facturas_orden_trabajo_id_fkey" FOREIGN KEY ("orden_trabajo_id") REFERENCES "ordenes_trabajo"("id") ON DELETE RESTRICT ON UPDATE CASCADE
      );
    `)

        // 8. Fix Servicios (active field)
        console.log('Patching servicios table...')
        await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        BEGIN
            ALTER TABLE "servicios" ADD COLUMN "active" BOOLEAN DEFAULT true;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column active already exists.';
        END;
      END $$;
    `)

        // 9. Campanas (Agricultural Campaigns)
        console.log('Creating campanas table if needed...')
        await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "campanas" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "nombre" TEXT NOT NULL,
          "fecha_inicio" DATE NOT NULL,
          "fecha_fin" DATE NOT NULL,
          "activa" BOOLEAN NOT NULL DEFAULT false,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "campanas_pkey" PRIMARY KEY ("id")
        );
      `)

        // 10. Link Ordenes to Campanas
        console.log('Linking Ordenes to Campanas...')
        await prisma.$executeRawUnsafe(`
        DO $$ 
        BEGIN 
            BEGIN
                ALTER TABLE "ordenes_trabajo" ADD COLUMN "campana_id" UUID;
                ALTER TABLE "ordenes_trabajo" ADD CONSTRAINT "ordenes_trabajo_campana_id_fkey" FOREIGN KEY ("campana_id") REFERENCES "campanas"("id");
            EXCEPTION
                WHEN duplicate_column THEN RAISE NOTICE 'column campana_id already exists in ordenes_trabajo.';
                WHEN duplicate_object THEN RAISE NOTICE 'constraint ordenes_trabajo_campana_id_fkey already exists.';
            END;
        END $$;
       `)

        // 11. Create Silos Table
        console.log('Creating silos table if needed...')
        await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "silos" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "nombre" TEXT NOT NULL,
          "tipo" TEXT NOT NULL,
          "capacidad_max" DECIMAL(12,2) NOT NULL DEFAULT 0,
          "establecimiento_id" UUID NOT NULL,
          "active" BOOLEAN NOT NULL DEFAULT true,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "silos_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "silos_establecimiento_id_fkey" FOREIGN KEY ("establecimiento_id") REFERENCES "establecimientos"("id") ON DELETE RESTRICT ON UPDATE CASCADE
        );
      `)

        // 12. Create MovimientosStock Table
        console.log('Creating movimientos_stock table if needed...')
        await prisma.$executeRawUnsafe(`
        CREATE TABLE IF NOT EXISTS "movimientos_stock" (
          "id" UUID NOT NULL DEFAULT gen_random_uuid(),
          "fecha" DATE NOT NULL,
          "tipo" TEXT NOT NULL,
          "producto" TEXT NOT NULL,
          "cantidad" DECIMAL(12,2) NOT NULL DEFAULT 0,
          "lote_id" UUID,
          "silo_id" UUID,
          "carta_porte_id" UUID,
          "observaciones" TEXT,
          "created_by" UUID,
          "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
          
          CONSTRAINT "movimientos_stock_pkey" PRIMARY KEY ("id"),
          CONSTRAINT "movimientos_stock_lote_id_fkey" FOREIGN KEY ("lote_id") REFERENCES "lotes"("id") ON DELETE SET NULL ON UPDATE CASCADE,
          CONSTRAINT "movimientos_stock_silo_id_fkey" FOREIGN KEY ("silo_id") REFERENCES "silos"("id") ON DELETE SET NULL ON UPDATE CASCADE
        );
      `)

        console.log('Schema patch completed successfully.')
    } catch (error) {
        console.error('Error applying schema patch:', error)
    }
}

main()
