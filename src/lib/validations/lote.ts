import * as z from 'zod'

export const loteSchema = z.object({
    nombre: z.string().min(1, 'El nombre es obligatorio'),
    hectareas: z.coerce.number().min(0.01, 'Debe ser mayor a 0'),
    establecimiento_id: z.string().uuid('Debe seleccionar un establecimiento'),
})

export type LoteFormValues = z.infer<typeof loteSchema>
