'use server'

import { prisma } from "@/lib/prisma"
import { afipService, TIPO_COMPROBANTE, CONCEPTO } from "@/lib/afip"
import { revalidatePath } from "next/cache"
import { startOfMonth, endOfMonth, format } from "date-fns"
import { getUserContext } from "@/server/context"
import { checkPermission, PERMISSIONS } from "@/lib/permissions"

export async function emitirFacturaAction(ordenId: string) {
    try {
        // 1. Obtener datos de la orden
        const { empresaId, rol } = await getUserContext()
        checkPermission(rol, PERMISSIONS.FACTURACION, 'create')
        const orden = await prisma.ordenTrabajo.findUnique({
            where: { id: ordenId, empresa_id: empresaId },
            include: { cliente: true, servicio: true }
        })

        if (!orden) return { success: false, error: "Orden no encontrada" }
        if (orden.estado === 'facturada') return { success: false, error: "Orden ya facturada" }

        // Validar datos mínimos del cliente para facturar A o B
        if (!orden.cliente.cuit) return { success: false, error: "Cliente sin CUIT definido" }

        // 2. Preparar datos para AFIP
        const ptoVta = Number(process.env.AFIP_PUNTO_VENTA || 1)

        // Determinar tipo de comprobante (A: RI a RI, B: RI a Monotributo/Final)
        // Simplificación: Si es RI (Responsable Inscripto) -> A, sino B.
        // En prod real esto requiere lógica más compleja sobre Condición IVA emisor vs receptor.
        const esResponsableInscripto = orden.cliente.condicion_iva.toLowerCase().includes('inscripto')
        const cbteTipo = esResponsableInscripto ? TIPO_COMPROBANTE.FACTURA_A : TIPO_COMPROBANTE.FACTURA_B
        const docTipo = 80 // CUIT

        // Calcular importes (Simplificado: Todo es Neto Gravado 21%)
        // TODO: Manejar alícuotas (10.5% para granos, etc) dinámicamente según servicio
        const total = Number(orden.total)
        const alicuotaIva = 0.21
        const neto = Number((total / (1 + alicuotaIva)).toFixed(2))
        const iva = Number((total - neto).toFixed(2))

        // Reconstruir total exacto para evitar error de centavos
        const totalAfip = Number((neto + iva).toFixed(2))

        const fecha = parseInt(format(new Date(), 'yyyyMMdd')) // AAAAMMDD

        const dataAfip = {
            cantReg: 1,
            ptoVta: ptoVta,
            cbteTipo: cbteTipo,
            concepto: CONCEPTO.SERVICIOS,
            docTipo: docTipo,
            docNro: parseInt(orden.cliente.cuit.replace(/\D/g, '')),
            cbteFch: fecha,
            impTotal: totalAfip,
            impTotConc: 0,
            impNeto: neto,
            impOpEx: 0,
            impIVA: iva,
            impTrib: 0,
            monId: 'PES',
            monCotiz: 1,
            ivas: [
                {
                    id: 5, // 21%
                    baseImp: neto,
                    importe: iva
                }
            ]
        }

        // 3. Llamar a AFIP
        // NOTA: Esto fallará si no están los certificados presentes.
        const caeResult = await afipService.crearFactura(dataAfip)

        // 4. Guardar resultado en BD
        // Obtener último número para consistencia (aunque createVoucher ya lo usó, lo ideal es guardarlo)
        const ultimoCmp = await afipService.getUltimoComprobante(ptoVta, cbteTipo)

        await prisma.$transaction([
            prisma.factura.create({
                data: {
                    empresa_id: empresaId,
                    orden_trabajo_id: orden.id,
                    tipo_comprobante: cbteTipo.toString(),
                    punto_venta: ptoVta,
                    numero: ultimoCmp,
                    cae: caeResult.cae,
                    fecha_vencimiento: new Date(caeResult.caeFchVto.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')), // YYYYMMDD -> Date
                    total: totalAfip,
                    estado_afip: 'APROBADO',
                    pdf_url: null // TODO: Generar PDF
                }
            }),
            prisma.ordenTrabajo.update({
                where: { id: orden.id, empresa_id: empresaId },
                data: { estado: 'facturada' }
            })
        ])

        revalidatePath('/ordenes')
        return { success: true, cae: caeResult.cae }

    } catch (error: any) {
        console.error("Error facturando:", error)
        return { success: false, error: error.message }
    }
}
