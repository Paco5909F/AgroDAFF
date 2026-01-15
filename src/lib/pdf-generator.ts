
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CompanyInfo {
    name: string;
    address: string;
    phone: string;
    email: string;
    cuit: string; // Added CUIT
}

export interface PdfBranding {
    name: string;
    address: string;
    phone: string;
    email: string;
    cuit: string;
    logoUrl?: string;
}

// Default fallback (Legacy)
const DEFAULT_BRANDING: PdfBranding = {
    name: "EL TRISQUEL AGROSERVICIOS",
    address: "O'Higgins, Buenos Aires",
    phone: "2364-610322",
    email: "agroserviciosciglieri@hotmail.com",
    cuit: "20-12345678-9",
    logoUrl: '/images/logo.png'
};

const LOGO_URL = '/images/logo.png';

// --- STYLING CONSTANTS ---
const COLORS: Record<string, [number, number, number]> = {
    primary: [0, 0, 0], // Black
    secondary: [80, 80, 80], // Dark Gray
    accent: [240, 240, 240], // Light Gray (Backgrounds)
    text: [20, 20, 20], // Almost Black
    textLight: [100, 100, 100], // Gray Text
    border: [200, 200, 200] // Light Border
};

const FONTS = {
    header: 'helvetica',
    body: 'helvetica'
};

// --- SHARED HELPERS ---
const loadLogoAndRun = (logoUrl: string | undefined, callback: (img: HTMLImageElement) => void) => {
    const img = new Image();
    img.src = logoUrl || DEFAULT_BRANDING.logoUrl || '/images/logo.png';
    img.onload = () => callback(img);
    img.onerror = () => {
        console.warn("Logo not found");
        callback(img); // Continue without logo
    };
};

// ... (keep drawDivider, drawLabelValue)

const drawHeader = (doc: jsPDF, img: HTMLImageElement, margin: number, pageWidth: number, title: string, subtitle: string, docData: { label: string, value: string }[], branding: PdfBranding) => {
    let currentY = margin + 10;

    // 1. Logo (Left)
    const logoW = 35;
    const aspect = img.width && img.height ? img.width / img.height : 1;
    const logoH = logoW / aspect;

    if (img.complete && img.naturalHeight !== 0) {
        doc.addImage(img, 'PNG', margin, currentY, logoW, logoH);
    }

    // 2. Document Details (Right)
    const headerRightsX = pageWidth - margin - 60;

    doc.setFontSize(20);
    doc.setFont(FONTS.header, 'bold');
    doc.setTextColor(COLORS.primary[0]);
    doc.text(title, pageWidth - margin, currentY + 8, { align: 'right' });

    doc.setFontSize(10);
    doc.setFont(FONTS.header, 'normal');
    doc.setTextColor(COLORS.secondary[0]);
    // Using branding Name
    doc.text(branding.name, pageWidth - margin, currentY + 14, { align: 'right' });

    // Grid for Date/Number
    let infoY = currentY + 25;
    docData.forEach(item => {
        doc.setFontSize(8);
        doc.setFont(FONTS.body, 'bold');
        doc.setTextColor(COLORS.textLight[0]);
        doc.text(item.label, headerRightsX, infoY);

        doc.setFontSize(9);
        doc.setFont(FONTS.body, 'bold'); // Value is bold
        doc.setTextColor(COLORS.text[0]);
        doc.text(item.value, pageWidth - margin, infoY, { align: 'right' });
        infoY += 5;
    });

    // 3. Company Info (Below Logo) - DYNAMIC
    const companyY = currentY + logoH + 5;
    doc.setFontSize(8);
    doc.setFont(FONTS.body, 'bold');
    doc.setTextColor(COLORS.primary[0]);
    doc.text(branding.name, margin, companyY);

    doc.setFont(FONTS.body, 'normal');
    doc.setTextColor(COLORS.secondary[0]);
    doc.text(branding.address, margin, companyY + 4);
    doc.text(`${branding.phone} | ${branding.email}`, margin, companyY + 8);
    if (branding.cuit) {
        doc.text(`CUIT: ${branding.cuit}`, margin, companyY + 12);
    }

    return Math.max(companyY + 20, infoY + 5); // Return bottom Y
};



const drawDivider = (doc: jsPDF, y: number, margin: number, pageWidth: number) => {
    doc.setDrawColor(COLORS.border[0]);
    doc.setLineWidth(0.1);
    doc.line(margin, y, pageWidth - margin, y);
};

const drawLabelValue = (doc: jsPDF, label: string, value: string, x: number, y: number, w: number) => {
    doc.setFontSize(7);
    doc.setFont(FONTS.body, 'bold');
    doc.setTextColor(COLORS.textLight[0]);
    doc.text(label.toUpperCase(), x, y);

    doc.setFontSize(9);
    doc.setFont(FONTS.body, 'normal');
    doc.setTextColor(COLORS.text[0]);
    const splitText = doc.splitTextToSize(value || "-", w);
    doc.text(splitText, x, y + 5);
    return splitText.length * 4; // Return approximated height
};





// --- PRESUPUESTO PDF ---
// --- DRAWING HELPERS (Moved to shared scope) ---
const drawBox = (doc: jsPDF, x: number, y: number, w: number, h: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.3);
    doc.rect(x, y, w, h);
};

const drawSectionHeader = (doc: jsPDF, title: string, y: number, xStart: number, pageWidth: number, margin: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    // Little tick on left
    doc.line(xStart, y, xStart, y + 3);
    // Title
    doc.setFontSize(7);
    doc.setFont(FONTS.header, 'bold');
    doc.setTextColor(0);
    doc.text(title, xStart + 2, y + 2.5);
    // Line after title
    const titleWidth = doc.getTextWidth(title);
    const lineStart = xStart + 5 + titleWidth;
    doc.line(lineStart, y, pageWidth - margin, y);
};

const drawField = (doc: jsPDF, label: string, value: string, x: number, y: number, w?: number) => {
    doc.setFontSize(6);
    doc.setFont(FONTS.body, 'bold');
    doc.setTextColor(80); // Dark Gray for label
    doc.text(label.toUpperCase(), x, y);

    doc.setFontSize(9);
    doc.setFont(FONTS.body, 'bold'); // Value is bold
    doc.setTextColor(0);
    const valY = y + 4;
    if (w) {
        doc.text(value || "-", x, valY, { maxWidth: w });
    } else {
        doc.text(value || "-", x, valY);
    }
};

// --- PRESUPUESTO PDF (AFIP/Official Style Implementation) ---
// --- PRESUPUESTO PDF (AFIP/Official Style Implementation) ---
export const generatePresupuestoPDF = (presupuesto: any, branding: PdfBranding = DEFAULT_BRANDING) => {
    loadLogoAndRun(branding.logoUrl, (img) => {
        const doc = new jsPDF();

        const margin = 15;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const width = pageWidth - (margin * 2);

        let cursorY = margin;

        // --- 1. HEADER ROW ---
        // Left: Logo + Company Data
        const logoW = 25;
        const aspect = img.width && img.height ? img.width / img.height : 1;
        const logoH = logoW / aspect;

        if (img.complete && img.naturalHeight !== 0) {
            doc.addImage(img, 'PNG', margin, cursorY, logoW, logoH);
        }

        const companyX = margin + logoW + 5;
        doc.setFontSize(12);
        doc.setFont(FONTS.header, 'bold');
        doc.text(branding.name, companyX, cursorY + 6);

        doc.setFontSize(8);
        doc.setFont(FONTS.body, 'normal');
        doc.text(branding.address, companyX, cursorY + 11);
        doc.text(`Tel: ${branding.phone} | Email: ${branding.email}`, companyX, cursorY + 16);

        // Right: Box with Presupuesto Data
        const boxX = pageWidth - margin - 65;
        const boxW = 65;
        const boxH = 26;
        drawBox(doc, boxX, cursorY, boxW, boxH);

        doc.setFontSize(10);
        doc.setFont(FONTS.header, 'bold');
        doc.text("PRESUPUESTO", boxX + (boxW / 2), cursorY + 6, { align: 'center' });
        doc.text("OFICIAL", boxX + (boxW / 2), cursorY + 11, { align: 'center' });

        doc.setFontSize(8);
        doc.text(`FECHA: ${format(new Date(presupuesto.fecha), 'dd/MM/yyyy')}`, boxX + 5, cursorY + 20);
        doc.text(`VÁLIDO HASTA: ${presupuesto.valido_hasta ? format(new Date(presupuesto.valido_hasta), 'dd/MM/yyyy') : '-'}`, boxX + 5, cursorY + 24);

        cursorY += 35; // Move down below header row

        // --- 2. DATOS DEL CLIENTE ---
        drawSectionHeader(doc, "DATOS DEL CLIENTE", cursorY, margin, pageWidth, margin);
        cursorY += 6;
        drawBox(doc, margin, cursorY, width, 22);

        // Left Column
        let innerY = cursorY + 6;
        drawField(doc, "RAZÓN SOCIAL / NOMBRE", presupuesto.cliente.razon_social, margin + 5, innerY);
        innerY += 10;
        drawField(doc, "CUIT", presupuesto.cliente.cuit || "-", margin + 5, innerY);

        // Right Column
        innerY = cursorY + 6;
        const col2X = margin + (width / 2) + 20;
        drawField(doc, "EMAIL", presupuesto.cliente.email || "-", col2X, innerY);
        innerY += 10;
        drawField(doc, "CONDICIÓN IVA", presupuesto.cliente.condicion_iva || "Consumidor Final", col2X, innerY);

        cursorY += 30;

        // --- 3. DETALLE DEL SERVICIO (Table) ---
        drawSectionHeader(doc, "DETALLE DEL SERVICIO", cursorY, margin, pageWidth, margin);
        cursorY += 6;

        // Table logic
        const tableBody = presupuesto.items.map((item: any) => [
            { content: item.servicio.nombre, styles: { fontStyle: 'bold' } },
            Number(item.cantidad).toLocaleString('es-AR'),
            item.servicio.unidad_medida, // Unidad centered
            `$ ${Number(item.precio_unit).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
            { content: `$ ${Number(item.subtotal).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, styles: { halign: 'right', fontStyle: 'bold' } }
        ]);

        autoTable(doc, {
            startY: cursorY,
            head: [['CONCEPTO', 'CANTIDAD', 'UNIDAD', 'PRECIO UNIT.', 'SUBTOTAL']],
            body: tableBody,
            theme: 'plain',
            margin: { left: margin, right: margin },
            tableWidth: width,
            styles: {
                fontSize: 8,
                cellPadding: 4,
                textColor: COLORS.text[0],
                lineColor: COLORS.primary[0], // Black lines for boxed look
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: COLORS.primary, // Black Header
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { cellWidth: 'auto', halign: 'left' },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 35, halign: 'right' },
                4: { cellWidth: 35, halign: 'right' }
            },
            didDrawPage: (data) => {
                // Draw a box around the table if needed, but 'plain' theme with line color usually handles grid
            }
        });

        // @ts-ignore
        cursorY = doc.lastAutoTable.finalY;

        // --- 4. TOTAL BOX ---
        const totalBoxW = 70;
        const totalBoxH = 12;
        const totalBoxX = pageWidth - margin - totalBoxW;

        // Gap before total
        cursorY += 10;

        // Draw standard box style
        doc.setFillColor(240, 240, 240); // Light gray fill
        doc.rect(totalBoxX, cursorY, totalBoxW, totalBoxH, "F");
        doc.setDrawColor(0);
        doc.setLineWidth(0.5); // Thicker border
        doc.rect(totalBoxX, cursorY, totalBoxW, totalBoxH, "S");

        doc.setFontSize(12);
        doc.setFont(FONTS.header, 'bold');
        doc.setTextColor(0);
        // "TOTAL: $ 123.456,00" aligned right or center
        const totalStr = `TOTAL: $ ${Number(presupuesto.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
        doc.text(totalStr, totalBoxX + totalBoxW - 5, cursorY + 8, { align: 'right' });

        cursorY += 25;

        // --- 5. OBSERVACIONES ---
        drawSectionHeader(doc, "OBSERVACIONES", cursorY, margin, pageWidth, margin);
        cursorY += 6;
        drawBox(doc, margin, cursorY, width, 18); // Fixed height box for observations

        if (presupuesto.observaciones) {
            doc.setFontSize(9);
            doc.setFont(FONTS.body, 'normal');
            doc.setTextColor(0);
            doc.text(presupuesto.observaciones, margin + 5, cursorY + 6, { maxWidth: width - 10 });
        }

        // Footer
        const footerY = pageHeight - 15;
        doc.setFontSize(6);
        doc.setTextColor(COLORS.textLight[0]);
        doc.text("Documento generado electronicamente por sistema de gestión EL TRISQUEL.", margin, footerY);
        doc.text("Este documento no es válido como factura. Los precios pueden variar sin previo aviso.", margin, footerY + 3);

        doc.save(`Presupuesto_${presupuesto.id.slice(0, 6)}.pdf`);
    });
};

// --- ORDEN DE TRABAJO PDF ---
// --- ORDEN DE TRABAJO PDF (AFIP/Standardized Style) ---
export const generateOrdenPDF = (orden: any, branding: PdfBranding = DEFAULT_BRANDING) => {
    loadLogoAndRun(branding.logoUrl, (img) => {
        const doc = new jsPDF();
        const margin = 15;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const width = pageWidth - (margin * 2);

        let cursorY = margin;

        // --- 1. HEADER ROW ---
        // Left: Logo + Company Data
        const logoW = 25;
        const aspect = img.width && img.height ? img.width / img.height : 1;
        const logoH = logoW / aspect;

        if (img.complete && img.naturalHeight !== 0) {
            doc.addImage(img, 'PNG', margin, cursorY, logoW, logoH);
        }

        const companyX = margin + logoW + 5;
        doc.setFontSize(12);
        doc.setFont(FONTS.header, 'bold');
        doc.text(branding.name, companyX, cursorY + 6);

        doc.setFontSize(8);
        doc.setFont(FONTS.body, 'normal');
        doc.text(branding.address, companyX, cursorY + 11);
        doc.text(`Tel: ${branding.phone} | Email: ${branding.email}`, companyX, cursorY + 16);

        // Right: Box with Order Data
        const boxX = pageWidth - margin - 70;
        const boxW = 70;
        const boxH = 26;
        drawBox(doc, boxX, cursorY, boxW, boxH);

        doc.setFontSize(10);
        doc.setFont(FONTS.header, 'bold');
        doc.text("ORDEN DE TRABAJO", boxX + (boxW / 2), cursorY + 6, { align: 'center' });
        doc.text(`N° ${orden.id ? orden.id.slice(0, 8).toUpperCase() : "-"}`, boxX + (boxW / 2), cursorY + 11, { align: 'center' });

        doc.setFontSize(8);
        doc.text(`FECHA: ${format(new Date(orden.fecha), 'dd/MM/yyyy')}`, boxX + 5, cursorY + 20);
        doc.text(`ESTADO: ${orden.estado ? orden.estado.toUpperCase() : "-"}`, boxX + 5, cursorY + 24);

        cursorY += 35; // Move down below header row

        // --- 2. DATOS DEL CLIENTE ---
        drawSectionHeader(doc, "DATOS DEL CLIENTE", cursorY, margin, pageWidth, margin);
        cursorY += 6;
        drawBox(doc, margin, cursorY, width, 18);

        // Left Column
        let innerY = cursorY + 6;
        drawField(doc, "RAZÓN SOCIAL", orden.cliente.razon_social, margin + 5, innerY);

        // Right Column
        const col2X = margin + (width / 2) + 20;
        drawField(doc, "CUIT", orden.cliente.cuit || "-", col2X, innerY);
        // Note: Orden only generally has Client Name/Link, but if we have CUIT in the client object included in Orden, we show it.

        cursorY += 25;

        // --- 3. DETALLE DEL SERVICIO (Table) ---
        drawSectionHeader(doc, "DETALLE DEL SERVICIO", cursorY, margin, pageWidth, margin);
        cursorY += 6;

        const tableBody = (orden.items || []).map((item: any) => {
            let desc = item.servicio?.nombre || "Item";
            if (Number(item.kilometros) > 0) {
                desc += ` (${Number(item.kilometros).toLocaleString('es-AR')} km)`;
            }

            return [
                { content: desc, styles: { fontStyle: 'bold' } },
                Number(item.cantidad).toLocaleString('es-AR'),
                item.servicio?.unidad_medida || "-",
                `$ ${Number(item.precio_unit).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
                { content: `$ ${Number(item.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, styles: { halign: 'right', fontStyle: 'bold' } }
            ]
        });

        autoTable(doc, {
            startY: cursorY,
            head: [['SERVICIO / PRODUCTO', 'CANTIDAD', 'UNIDAD', 'PRECIO UNIT.', 'TOTAL']],
            body: tableBody,
            theme: 'plain',
            margin: { left: margin, right: margin },
            tableWidth: width,
            styles: {
                fontSize: 8,
                cellPadding: 4,
                textColor: COLORS.text[0],
                lineColor: COLORS.primary[0],
                lineWidth: 0.1,
            },
            headStyles: {
                fillColor: COLORS.primary,
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { cellWidth: 'auto', halign: 'left' },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 35, halign: 'right' },
                4: { cellWidth: 35, halign: 'right' }
            }
        });

        // @ts-ignore
        cursorY = doc.lastAutoTable.finalY;

        // --- 4. TOTAL BOX ---
        const totalBoxW = 70;
        const totalBoxH = 12;
        const totalBoxX = pageWidth - margin - totalBoxW;

        // Gap before total
        cursorY += 10;

        // Draw standard box style
        doc.setFillColor(240, 240, 240); // Light gray fill
        doc.rect(totalBoxX, cursorY, totalBoxW, totalBoxH, "F");
        doc.setDrawColor(0);
        doc.setLineWidth(0.5); // Thicker border
        doc.rect(totalBoxX, cursorY, totalBoxW, totalBoxH, "S");

        doc.setFontSize(12);
        doc.setFont(FONTS.header, 'bold');
        doc.setTextColor(0);
        const totalStr = `TOTAL: $ ${Number(orden.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`;
        doc.text(totalStr, totalBoxX + totalBoxW - 5, cursorY + 8, { align: 'right' });

        cursorY += 25;

        // --- 5. OBSERVACIONES ---
        drawSectionHeader(doc, "OBSERVACIONES", cursorY, margin, pageWidth, margin);
        cursorY += 6;
        drawBox(doc, margin, cursorY, width, 18);

        if (orden.observaciones) {
            doc.setFontSize(9);
            doc.setFont(FONTS.body, 'normal');
            doc.setTextColor(0);
            doc.text(orden.observaciones, margin + 5, cursorY + 6, { maxWidth: width - 10 });
        }

        // --- SIGNATURE AREA ---
        const sigY = pageHeight - 50;
        doc.setDrawColor(COLORS.border[0]);
        // Centered signature line
        const sigWidth = 100;
        const sigStart = (pageWidth - sigWidth) / 2;
        doc.line(sigStart, sigY, sigStart + sigWidth, sigY);

        doc.setFontSize(8);
        doc.setTextColor(COLORS.textLight[0]);
        doc.text("FIRMA CONFORME CLIENTE / RESPONSABLE", pageWidth / 2, sigY + 5, { align: 'center' });


        // Footer
        const footerY = pageHeight - 15;
        doc.setFontSize(6);
        doc.setTextColor(COLORS.textLight[0]);
        doc.text("Documento generado electronicamente por sistema de gestión EL TRISQUEL.", margin, footerY);
        doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth - margin, footerY, { align: 'right' });

        doc.save(`Orden_${orden.id ? orden.id.slice(0, 6) : "Borrador"}.pdf`);
    });
};

// --- CARTA DE PORTE PDF (AFIP/Official Style Implementation) ---
// --- CARTA DE PORTE PDF (AFIP/Official Style Implementation) ---
export const generateCartaPortePDF = (carta: any, branding: PdfBranding = DEFAULT_BRANDING) => {
    loadLogoAndRun(branding.logoUrl, (img) => {
        const doc = new jsPDF();

        // Settings
        const margin = 15;
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const width = pageWidth - (margin * 2);

        let cursorY = margin;

        // --- 1. HEADER ROW ---
        // Left: Logo + Company Data
        const logoW = 25;
        const aspect = img.width && img.height ? img.width / img.height : 1;
        const logoH = logoW / aspect;

        if (img.complete && img.naturalHeight !== 0) {
            doc.addImage(img, 'PNG', margin, cursorY, logoW, logoH);
        }

        const companyX = margin + logoW + 5;
        doc.setFontSize(12);
        doc.setFont(FONTS.header, 'bold');
        doc.text(branding.name, companyX, cursorY + 6);

        doc.setFontSize(8);
        doc.setFont(FONTS.body, 'normal');
        doc.text(branding.address, companyX, cursorY + 11);
        doc.text(`Tel: ${branding.phone} | Email: ${branding.email}`, companyX, cursorY + 16);

        // Right: Box with CP Data
        const boxX = pageWidth - margin - 70;
        const boxW = 70;
        const boxH = 26;
        drawBox(doc, boxX, cursorY, boxW, boxH);

        doc.setFontSize(10);
        doc.setFont(FONTS.header, 'bold');
        doc.text("CARTA DE PORTE", boxX + (boxW / 2), cursorY + 6, { align: 'center' });
        doc.text("ELECTRONICA", boxX + (boxW / 2), cursorY + 11, { align: 'center' });

        doc.setFontSize(8);
        doc.text(`CTG: ${carta.ctg || "PENDIENTE"}`, boxX + 5, cursorY + 20);
        doc.text(`FECHA: ${format(new Date(carta.fecha_carga), 'dd/MM/yyyy')}`, boxX + 5, cursorY + 24);

        cursorY += 35; // Move down below header row

        // --- 2. INTERVINIENTES DEL TRASLADO ---
        drawSectionHeader(doc, "INTERVINIENTES DEL TRASLADO", cursorY, margin, pageWidth, margin);
        cursorY += 6;
        drawBox(doc, margin, cursorY, width, 30); // Big Box container

        const col2X = margin + (width / 2);

        // Left Column inside box
        let innerY = cursorY + 6;
        drawField(doc, "TITULAR CARTA DE PORTE", carta.cliente.razon_social, margin + 5, innerY);
        innerY += 10;
        drawField(doc, "CUIT", carta.cliente.cuit || "-", margin + 5, innerY);

        // Right Column inside box
        innerY = cursorY + 6;
        drawField(doc, "CORREDOR", carta.corredor || "SIN INTERVENCION", col2X + 5, innerY);
        innerY += 10;
        drawField(doc, "DESTINATARIO", carta.destinatario || "-", col2X + 5, innerY);

        cursorY += 35; // Skip box + gap

        // --- 3. DATOS DE LA CARGA ---
        drawSectionHeader(doc, "DATOS DE LA CARGA", cursorY, margin, pageWidth, margin);
        cursorY += 6;
        drawBox(doc, margin, cursorY, width, 22);

        innerY = cursorY + 6;
        // 3 cols basically
        const col3W = width / 3;

        drawField(doc, "GRANO / ESPECIE", "GRANOS VARIOS", margin + 5, innerY);
        drawField(doc, "KILOS ESTIMADOS", `${Number(carta.kilos_estimados).toLocaleString('es-AR')} kg`, margin + 5, innerY + 10);

        drawField(doc, "TIPO", "CEREAL", margin + 5 + col3W, innerY);
        drawField(doc, "PESO TARA", carta.peso_tara ? `${Number(carta.peso_tara).toLocaleString('es-AR')} kg` : "-", margin + 5 + col3W, innerY + 10);

        drawField(doc, "COSECHA", format(new Date(), 'yyyy') + "/" + (parseInt(format(new Date(), 'yyyy')) + 1), margin + 5 + (col3W * 2), innerY);
        drawField(doc, "PESO BRUTO", carta.peso_bruto ? `${Number(carta.peso_bruto).toLocaleString('es-AR')} kg` : "-", margin + 5 + (col3W * 2), innerY + 10);

        cursorY += 27;

        // --- 4. LUGAR DE PROCEDENCIA Y DESTINO ---
        drawSectionHeader(doc, "LUGAR DE PROCEDENCIA Y DESTINO", cursorY, margin, pageWidth, margin);
        cursorY += 6;
        drawBox(doc, margin, cursorY, width, 25);

        innerY = cursorY + 6;
        drawField(doc, "LUGAR DE PROCEDENCIA (ORIGEN)", carta.origen || "-", margin + 5, innerY);
        drawField(doc, "LUGAR DE DESTINO", carta.destino || "-", margin + 5 + (width / 2), innerY);

        cursorY += 30;

        // --- 5. DATOS DEL TRANSPORTE ---
        drawSectionHeader(doc, "DATOS DEL TRANSPORTE", cursorY, margin, pageWidth, margin);
        cursorY += 6;
        drawBox(doc, margin, cursorY, width, 22);

        innerY = cursorY + 6;
        drawField(doc, "TRANSPORTISTA / CHOFER", carta.chofer || "-", margin + 5, innerY);
        drawField(doc, "CUIT CHOFER", carta.cuit_chofer || "-", margin + 5, innerY + 10);

        drawField(doc, "PATENTE CAMION", carta.patente_camion || "-", margin + 5 + (width / 2), innerY);
        drawField(doc, "PATENTE ACOPLADO", carta.patente_acoplado || "-", margin + 5 + (width * 0.75), innerY);

        cursorY += 27;

        // --- 6. OBSERVACIONES ---
        drawSectionHeader(doc, "OBSERVACIONES", cursorY, margin, pageWidth, margin);
        cursorY += 6;
        drawBox(doc, margin, cursorY, width, 20);

        innerY = cursorY + 6;
        if (carta.observaciones) {
            doc.setFontSize(9);
            doc.setFont(FONTS.body, 'normal');
            doc.text(carta.observaciones, margin + 5, innerY);
        } else {
            drawField(doc, "", "-", margin + 5, innerY);
        }

        cursorY += 25;

        // Footer Legal text
        const footerY = pageHeight - 15;
        doc.setFontSize(6);
        doc.setTextColor(100);
        doc.text("Documento generado electronicamente por sistema de gestión EL TRISQUEL.", margin, footerY);
        doc.text("Este documento no reemplaza a la Carta de Porte Oficial emitida por AFIP si el CTG no es válido.", margin, footerY + 3);

        doc.save(`CP_${carta.ctg || 'Borrador'}.pdf`);
    });
};

// --- REPORTE DE GESTIÓN PDF ---
// --- REPORTE DE GESTIÓN PDF ---
export const generateReportPDF = (orders: any[], filters: any, branding: PdfBranding = DEFAULT_BRANDING) => {
    loadLogoAndRun(branding.logoUrl, (img) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;

        // Header
        let currentY = drawHeader(doc, img, margin, pageWidth, "REPORTE DE GESTIÓN", "RESUMEN DE TRABAJOS", [
            { label: "DESDE:", value: format(filters.from, 'dd/MM/yyyy') },
            { label: "HASTA:", value: format(filters.to, 'dd/MM/yyyy') }
        ], branding);

        drawDivider(doc, currentY, margin, pageWidth);
        currentY += 10;

        // Table
        const tableBody = orders.flatMap((order) =>
            (order.items || []).map((item: any) => {
                let serviceName = item.servicio.nombre.substring(0, 50);
                if (Number(item.kilometros) > 0) {
                    serviceName += ` (${Number(item.kilometros).toLocaleString('es-AR')} km)`;
                }

                return [
                    format(new Date(order.fecha), 'dd/MM/yy'),
                    order.cliente.razon_social.substring(0, 30),
                    serviceName,
                    `${Number(item.cantidad).toLocaleString('es-AR')} ${item.servicio.unidad_medida}`,
                    `$ ${Number(item.precio_unit).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`,
                    { content: `$ ${Number(item.total).toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, styles: { halign: 'right', fontStyle: 'bold' } }
                ];
            })
        );

        autoTable(doc, {
            startY: currentY,
            head: [['FECHA', 'CLIENTE', 'SERVICIO', 'CANT.', 'PRECIO', 'TOTAL']],
            body: tableBody,
            theme: 'plain',
            styles: {
                fontSize: 8,
                cellPadding: 3,
                textColor: COLORS.text[0],
                lineColor: COLORS.border[0],
                lineWidth: 0.1
            },
            headStyles: {
                fillColor: COLORS.primary,
                textColor: 255,
                fontStyle: 'bold',
                halign: 'left'
            },
            columnStyles: {
                0: { cellWidth: 20 },
                1: { cellWidth: 'auto' },
                2: { cellWidth: 50 }, // Increased width since we added km info
                3: { halign: 'center', cellWidth: 25 },
                4: { halign: 'right', cellWidth: 25 },
                5: { halign: 'right', cellWidth: 30 }
            }
        });

        // @ts-ignore
        currentY = doc.lastAutoTable.finalY + 10;

        // Totals Calculation
        const totalAmount = orders.reduce((sum, o) => sum + Number(o.total), 0);
        const totalBoxX = pageWidth - margin - 70;

        doc.setFontSize(12);
        doc.setFont(FONTS.body, 'bold');
        doc.setTextColor(COLORS.primary[0]);
        doc.text("TOTAL PERIODO", totalBoxX, currentY + 5, { align: 'left' });
        doc.text(`$ ${totalAmount.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, pageWidth - margin, currentY + 5, { align: 'right' });

        // Footer
        const footerY = pageHeight - 15;
        doc.setDrawColor(COLORS.border[0]);
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

        doc.setFontSize(7);
        doc.setTextColor(COLORS.textLight[0]);
        doc.text("Reporte generado automáticamente por sistema de gestión.", margin, footerY);
        doc.text(`Generado el ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, pageWidth - margin, footerY, { align: 'right' });

        doc.save(`Reporte_Gestion_${format(new Date(), 'yyyyMMdd')}.pdf`);
    });
};
