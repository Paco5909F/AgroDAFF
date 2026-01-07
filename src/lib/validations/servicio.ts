import { z } from "zod"

export const servicioSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    unidad_medida: z.string().min(1, "Seleccione una unidad"),
    precio_base: z.coerce.number().min(0, "El precio no puede ser negativo"),
    moneda: z.string().default("ARS"),
})

export type ServicioFormValues = z.infer<typeof servicioSchema>
