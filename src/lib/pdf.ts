import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

// Interface for type safety
interface OrdenData {
    id: string
    numero?: bigint | number
    fecha: Date | string
    cliente: {
        razon_social: string
        cuit: string
        condicion_iva: string
        email?: string | null
        telefono?: string | null
    }
    servicio: {
        nombre: string
        unidad_medida: string
    }
    cantidad: number | string
    total: number | string
    observaciones?: string | null
    cae?: string | null
    fecha_vencimiento_cae?: Date | string | null
}

export const pdfService = {
    generarOrdenTrabajo: (orden: OrdenData) => {
        const doc = new jsPDF()

        // --- CONFIGURACIÓN ---
        const companyName = "AgroDAFF"
        const companyCuit = "20-12345678-9"
        const companyAddress = "Ruta Nacional 5 Km 100, Mercedes, Bs. As."

        // --- ENCABEZADO ---
        // Logo placeholder
        doc.setFillColor(220, 220, 220)
        doc.rect(14, 10, 30, 30, 'F')
        doc.setFontSize(10)
        doc.text("LOGO", 22, 26)

        // Datos Empresa
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text(companyName, 50, 20)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`CUIT: ${companyCuit}`, 50, 28)
        doc.text(companyAddress, 50, 34)

        // Datos Documento
        doc.setFontSize(14)
        doc.text("ORDEN DE TRABAJO", 140, 20)
        doc.setFontSize(10)
        doc.text(`Fecha: ${format(new Date(orden.fecha), 'PPP', { locale: es })}`, 140, 28)
        doc.text(`Nro Control: #${orden.numero || orden.id.slice(0, 8)}`, 140, 34)

        // Línea separadora
        doc.setDrawColor(200, 200, 200)
        doc.line(14, 45, 196, 45)

        // --- DATOS CLIENTE ---
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text("DATOS DEL CLIENTE", 14, 55)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Razón Social: ${orden.cliente.razon_social}`, 14, 62)
        doc.text(`CUIT: ${orden.cliente.cuit}`, 14, 68)
        doc.text(`Condición IVA: ${orden.cliente.condicion_iva}`, 14, 74)
        if (orden.cliente.telefono) doc.text(`Teléfono: ${orden.cliente.telefono}`, 110, 62)
        if (orden.cliente.email) doc.text(`Email: ${orden.cliente.email}`, 110, 68)

        // --- DETALLE DEL TRABAJO (Tabla) ---
        const headers = [['Concepto / Servicio', 'Unidad', 'Cantidad', 'Precio Unit.', 'Subtotal']]

        // Calcular unitario estimado (Total / Cantidad) para mostrar en tabla
        const cantidadNum = Number(orden.cantidad)
        const totalNum = Number(orden.total)
        const precioUnit = cantidadNum > 0 ? (totalNum / cantidadNum).toFixed(2) : "0.00"

        const data = [
            [
                orden.servicio.nombre,
                orden.servicio.unidad_medida,
                Number(orden.cantidad).toFixed(2),
                `$ ${precioUnit}`,
                `$ ${Number(orden.total).toFixed(2)}`
            ]
        ]

        autoTable(doc, {
            startY: 85,
            head: headers,
            body: data,
            theme: 'grid',
            headStyles: { fillColor: [40, 40, 40] },
            styles: { fontSize: 10, cellPadding: 3 },
        })

        // --- TOTALES ---
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY + 10

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text(`TOTAL: $ ${Number(orden.total).toFixed(2)}`, 150, finalY, { align: 'right' })

        // --- OBSERVACIONES ---
        if (orden.observaciones) {
            doc.setFontSize(10)
            doc.setFont("helvetica", "bold")
            doc.text("Observaciones:", 14, finalY + 10)
            doc.setFont("helvetica", "italic")
            doc.text(orden.observaciones, 14, finalY + 16)
        }

        // --- PIE DE PÁGINA (CAE si existe) ---
        if (orden.cae) {
            const pieY = 250
            doc.setDrawColor(0, 0, 0)
            doc.rect(14, pieY, 182, 30)

            doc.setFont("helvetica", "bold")
            doc.setFontSize(10)
            doc.text("DATOS FISCALES (AFIP)", 20, pieY + 8)

            doc.setFont("courier", "normal")
            doc.text(`CAE: ${orden.cae}`, 20, pieY + 16)
            if (orden.fecha_vencimiento_cae) {
                doc.text(`Vto. CAE: ${format(new Date(orden.fecha_vencimiento_cae), 'dd/MM/yyyy')}`, 100, pieY + 16)
            }
        }

        return doc
    },

    generarPresupuesto: (presupuesto: any) => {
        const doc = new jsPDF()

        // --- CONFIGURACIÓN ---
        const companyName = "AgroDAFF"
        const companyCuit = "20-12345678-9"
        const companyAddress = "Ruta Nacional 5 Km 100, Mercedes, Bs. As."

        // --- ENCABEZADO ---
        doc.setFillColor(220, 220, 220)
        doc.rect(14, 10, 30, 30, 'F')
        doc.setFontSize(10)
        doc.text("LOGO", 22, 26)

        // Datos Empresa
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text(companyName, 50, 20)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`CUIT: ${companyCuit}`, 50, 28)
        doc.text(companyAddress, 50, 34)

        // Datos Documento
        doc.setFontSize(14)
        doc.text("PRESUPUESTO", 140, 20)
        doc.setFontSize(10)
        doc.text(`Fecha: ${format(new Date(presupuesto.fecha), 'PPP', { locale: es })}`, 140, 28)

        if (presupuesto.valido_hasta) {
            doc.text(`Válido hasta: ${format(new Date(presupuesto.valido_hasta), 'PPP', { locale: es })}`, 140, 34)
        }

        // Línea separadora
        doc.setDrawColor(200, 200, 200)
        doc.line(14, 45, 196, 45)

        // --- DATOS CLIENTE ---
        doc.setFontSize(11)
        doc.setFont("helvetica", "bold")
        doc.text("DATOS DEL CLIENTE", 14, 55)

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Razón Social: ${presupuesto.cliente.razon_social}`, 14, 62)
        doc.text(`CUIT: ${presupuesto.cliente.cuit}`, 14, 68)
        if (presupuesto.cliente.condicion_iva) doc.text(`Condición IVA: ${presupuesto.cliente.condicion_iva}`, 14, 74)

        // --- DETALLE DEL TRABAJO (Tabla) ---
        const headers = [['Concepto / Servicio', 'Cantidad', 'Precio Unit.', 'Subtotal']]

        const data = [
            [
                presupuesto.servicio.nombre,
                `${Number(presupuesto.cantidad).toFixed(2)} ${presupuesto.servicio.unidad_medida}`,
                `$ ${Number(presupuesto.precio_unit).toFixed(2)}`,
                `$ ${Number(presupuesto.total).toFixed(2)}`
            ]
        ]

        autoTable(doc, {
            startY: 85,
            head: headers,
            body: data,
            theme: 'grid',
            headStyles: { fillColor: [40, 40, 40] }, // Dark gray
            styles: { fontSize: 10, cellPadding: 3 },
        })

        // --- TOTALES ---
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY + 10

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text(`TOTAL ESTIMADO: $ ${Number(presupuesto.total).toFixed(2)}`, 150, finalY, { align: 'right' })

        // --- OBSERVACIONES ---
        if (presupuesto.observaciones) {
            doc.setFontSize(10)
            doc.setFont("helvetica", "bold")
            doc.text("Observaciones:", 14, finalY + 10)
            doc.setFont("helvetica", "italic")
            doc.text(presupuesto.observaciones, 14, finalY + 16)
        }

        return doc
    }
}
