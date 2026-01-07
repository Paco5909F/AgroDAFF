import { z } from "zod"

export const clienteSchema = z.object({
    razon_social: z.string().min(3, "La razón social debe tener al menos 3 caracteres"),
    cuit: z.string().regex(/^\d{11}$/, "El CUIT debe tener 11 dígitos numéricos"),
    condicion_iva: z.string().min(1, "Seleccione una condición de IVA"),
    email: z.string().email("Email inválido").or(z.literal("")),
    telefono: z.string(),
    persona_contacto: z.string(),
    tipo_cliente: z.string(),
    localidad: z.string(),
    provincia: z.string(),
    observaciones: z.string(),
    establecimiento_inicial: z.string(),
    modalidad_inicial: z.string(),
})

export type ClienteFormValues = z.infer<typeof clienteSchema>
