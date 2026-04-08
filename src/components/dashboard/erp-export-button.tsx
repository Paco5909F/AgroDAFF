'use client';

import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';

interface ErpExportProps {
    empresa: string;
    campana: string;
    ingresos: number;
    costos: number;
    margen: number;
    gastosPorInsumo: Record<string, number>;
    gastosPorLote: Record<string, number>;
}

export function ExportErpButton({
    empresa, campana, ingresos, costos, margen, gastosPorInsumo, gastosPorLote
}: ErpExportProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        toast.info("Generando Reporte Ejecutivo...", { duration: 2000 });

        setTimeout(() => {
            try {
                const doc = new jsPDF();
                
                // Header
                doc.setFontSize(22);
                doc.setTextColor(16, 185, 129); // Emerald
                doc.text("Reporte Ejecutivo AgroDAFF", 14, 20);
                
                doc.setFontSize(11);
                doc.setTextColor(100);
                doc.text(`Empresa: ${empresa}`, 14, 28);
                doc.text(`Campaña: ${campana}`, 14, 34);
                doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 14, 40);

                // Financiero KPI
                doc.setFontSize(14);
                doc.setTextColor(0);
                doc.text("Estado de Resultados (Acumulado de Campaña)", 14, 52);

                const kpiData = [
                    ["Ingresos Totales", `$${ingresos.toLocaleString('es-AR')}`],
                    ["Costos Operativos", `$${costos.toLocaleString('es-AR')}`],
                    ["Margen Bruto (EBITDA Simulado)", `$${margen.toLocaleString('es-AR')}`]
                ];

                autoTable(doc, {
                    startY: 56,
                    head: [["Indicador", "Valor"]],
                    body: kpiData,
                    theme: 'grid',
                    headStyles: { fillColor: [16, 185, 129] }
                });

                // Top Lotes
                const startYLotes = (doc as any).lastAutoTable.finalY + 15;
                doc.text("Distribución de Costos por Lote", 14, startYLotes);
                
                const loteData = Object.entries(gastosPorLote)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, val]) => [name, `$${val.toLocaleString('es-AR')}`]);

                autoTable(doc, {
                    startY: startYLotes + 4,
                    head: [["Lote / Establecimiento", "Capital Inyectado"]],
                    body: loteData,
                    theme: 'striped',
                });

                // Top Insumos
                const startYInsumos = (doc as any).lastAutoTable.finalY + 15;
                
                // Check if new page is needed
                if (startYInsumos > 250) {
                    doc.addPage();
                }

                doc.text("Análisis Toxicológico y de Semillas", 14, startYInsumos > 250 ? 20 : startYInsumos);
                
                const insumoData = Object.entries(gastosPorInsumo)
                    .sort((a, b) => b[1] - a[1])
                    .map(([name, val]) => [name, `$${val.toLocaleString('es-AR')}`]);

                autoTable(doc, {
                    startY: startYInsumos > 250 ? 24 : startYInsumos + 4,
                    head: [["Tipo de Insumo", "Costo Acumulado"]],
                    body: insumoData,
                    theme: 'striped',
                });

                // Footer
                const pageCount = (doc.internal as any).getNumberOfPages();
                for (let i = 1; i <= pageCount; i++) {
                    doc.setPage(i);
                    doc.setFontSize(8);
                    doc.text("Documento generado automáticamente por el Motor ERPI de AgroDAFF.", 14, 290);
                }

                doc.save(`Reporte_AgroDAFF_${campana.replace(/ /g, '_')}.pdf`);
                toast.success("Descarga iniciada.");
            } catch (err) {
                console.error(err);
                toast.error("Ocurrió un error al generar el PDF.");
            } finally {
                setIsExporting(false);
            }
        }, 800);
    };

    return (
        <Button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full shadow-md animate-in fade-in transition-all"
        >
            {isExporting ? <Download className="w-4 h-4 animate-bounce" /> : <FileText className="w-4 h-4" />}
            <span className="font-semibold">Exportar PDF</span>
        </Button>
    );
}
