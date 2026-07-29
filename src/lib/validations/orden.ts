import { z } from "zod"

// Item Schema
export const ordenItemSchema = z.object({
    servicio_id: z.string().uuid("Seleccione un servicio"),
    lote_id: z.string().uuid().optional().or(z.literal('')),
    campana_id: z.string().uuid().optional().or(z.literal('')),
    cantidad: z.coerce.number().min(0.01, "Cantidad debe ser mayor a 0 (ej: hectáreas)"),
    precio_unit: z.coerce.number().min(0, "Precio inválido"),
    kilometros: z.coerce.number().optional(),
    tipo_cambio: z.coerce.number().optional(),
    total: z.coerce.number(),
    observaciones: z.string().optional(),
    
    // Contratistas
    es_tercerizado: z.boolean().optional().default(false),
    proveedor_id: z.string().uuid().optional().or(z.literal('')),
    costo_tercerizado: z.coerce.number().optional(),

    // Clima y Legal
    receta_agronomica_nro: z.string().optional(),
    temperatura_c: z.coerce.number().optional(),
    humedad_pct: z.coerce.number().optional(),
    viento_vel_kmh: z.coerce.number().optional(),
    viento_direccion: z.string().optional()
})

// Main Orden Schema
export const ordenSchema = z.object({
    cliente_id: z.string().uuid("Seleccione un cliente"),
    fecha: z.coerce.date(),
    moneda: z.string().optional().default("ARS"),
    observaciones: z.string().optional(),
    items: z.array(ordenItemSchema).min(1, "Debe agregar al menos un ítem"),
    total: z.coerce.number(), // Grand total calculated from items
})

export type OrdenItemValues = z.infer<typeof ordenItemSchema>
export type OrdenFormValues = z.infer<typeof ordenSchema>
