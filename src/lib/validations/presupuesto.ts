
import * as z from "zod"

const presupuestoItemSchema = z.object({
    tipo: z.enum(["insumo", "servicio"]),
    referencia_id: z.string().min(1, "Seleccione un ítem"),
    nombre: z.string().min(1, "Nombre requerido"),
    unidad: z.string().min(1, "Unidad requerida"),
    cantidad: z.coerce.number().positive("Mayor a 0"),
    precio_unit: z.coerce.number().positive("Mayor a 0"),
    subtotal: z.coerce.number(),
    detalle: z.string().optional()
})

export const presupuestoSchema = z.object({
    cliente_id: z.string().min(1, "Seleccione un cliente"),
    lote_id: z.string().optional(),
    hectareas: z.coerce.number().positive("Debe ser mayor a 0").default(1),
    fecha: z.date(),
    valido_hasta: z.date().optional(),
    observaciones: z.string().optional(),
    items: z.array(presupuestoItemSchema).min(1, "Debe agregar al menos un ítem"),
    total: z.coerce.number(),
    total_final: z.coerce.number().optional(),
})

export type PresupuestoFormValues = z.infer<typeof presupuestoSchema>
