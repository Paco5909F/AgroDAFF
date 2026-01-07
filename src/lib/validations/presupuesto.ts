
import * as z from "zod"

const presupuestoItemSchema = z.object({
    servicio_id: z.string().min(1, "Seleccione servicio"),
    cantidad: z.coerce.number().positive("Mayor a 0"),
    precio_unit: z.coerce.number().positive("Mayor a 0"),
    subtotal: z.coerce.number(),
    detalle: z.string().optional() // Add this
})

export const presupuestoSchema = z.object({
    cliente_id: z.string().min(1, "Seleccione un cliente"),
    fecha: z.date(),
    valido_hasta: z.date().optional(),
    observaciones: z.string().optional(),
    items: z.array(presupuestoItemSchema).min(1, "Debe agregar al menos un ítem"),
    total: z.coerce.number(),
})

export type PresupuestoFormValues = z.infer<typeof presupuestoSchema>
