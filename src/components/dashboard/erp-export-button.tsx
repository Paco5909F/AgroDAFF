'use client';

import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState } from 'react';

import { generateDashboardPdf, PdfBranding } from '@/lib/pdf-generator';

interface ErpExportProps {
    empresa: string;
    campana: string;
    ingresos: number;
    costos: number;
    margen: number;
    gastosPorInsumo: Record<string, number>;
    gastosPorLote: Record<string, number>;
    costoPorHectarea: number;
    totalHectareas: number;
    labores: {
        fecha: Date;
        lote: string;
        servicio: string;
        cantidad: number;
        costoLabor: number;
        costoInsumos: number;
        total: number;
    }[];
    branding?: PdfBranding;
}

export function ExportErpButton({
    empresa, campana, ingresos, costos, margen, gastosPorInsumo, gastosPorLote, costoPorHectarea, totalHectareas, labores, branding
}: ErpExportProps) {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        toast.info("Generando Reporte Ejecutivo...", { duration: 2000 });

        setTimeout(async () => {
            try {
                await generateDashboardPdf({
                    campana: campana || 'Campaña Actual',
                    ingresos,
                    costos,
                    margen,
                    costoPorHectarea,
                    gastosPorInsumo,
                    gastosPorLote,
                    labores
                }, branding);

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
