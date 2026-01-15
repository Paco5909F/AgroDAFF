'use client'

import { Button } from '@/components/ui/button'
import { FileDown } from 'lucide-react'
import { generateOrdenPDF, PdfBranding } from '@/lib/pdf-generator'

interface PDFDownloadButtonProps {
    orden: any
    className?: string
    variant?: "link" | "default" | "destructive" | "outline" | "secondary" | "ghost" | null | undefined
    size?: "default" | "sm" | "lg" | "icon" | null | undefined
    branding?: PdfBranding
}

export function PDFDownloadButton({ orden, className, variant = "ghost", size = "sm", branding }: PDFDownloadButtonProps) {
    return (
        <Button
            variant={variant}
            size={size}
            className={className}
            onClick={(e) => {
                e.stopPropagation() // Prevent card click
                generateOrdenPDF(orden, branding)
            }}
            title="Descargar PDF"
        >
            {size === 'icon' ? (
                <FileDown className="h-4 w-4 text-emerald-600" />
            ) : (
                <>
                    <FileDown className="h-4 w-4 text-emerald-600 mr-2" />
                    PDF
                </>
            )}
        </Button>
    )
}
