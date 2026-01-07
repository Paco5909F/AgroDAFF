
const { Client } = require('pg');

const client = new Client({
    connectionString: "postgresql://postgres.ypjckowvcadyzaqrcsgi:eqVHnhobWaVxIWv3@aws-1-us-east-2.pooler.supabase.com:5432/postgres" // Direct URL
});

async function run() {
    await client.connect();

    const sql = `
    CREATE TABLE IF NOT EXISTS "public"."cartas_porte" (
        "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
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

        CONSTRAINT "cartas_porte_pkey" PRIMARY KEY ("id")
    );

    ALTER TABLE "public"."cartas_porte" 
    DROP CONSTRAINT IF EXISTS "cartas_porte_cliente_id_fkey";

    ALTER TABLE "public"."cartas_porte"
    ADD CONSTRAINT "cartas_porte_cliente_id_fkey" 
    FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `;

    try {
        await client.query(sql);
        console.log("Table cartas_porte created successfully (or already exists).");
    } catch (e) {
        console.error("Error creating table:", e);
    } finally {
        await client.end();
    }
}

run();
