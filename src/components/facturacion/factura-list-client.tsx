'use client'

import { useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
    MoreHorizontal, 
    Search, 
    FileText, 
    Download, 
    AlertCircle, 
    CheckCircle2, 
    Clock,
    Plus
} from 'lucide-react'
import { format } from 'date-fns'

interface FacturaListClientProps {
    data: any[]
}

export function FacturaListClient({ data }: FacturaListClientProps) {
    const [searchTerm, setSearchTerm] = useState('')

    const filteredData = data.filter(factura => {
        const matchCliente = factura.orden?.cliente?.razon_social?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchCuit = factura.orden?.cliente?.cuit?.includes(searchTerm)
        const matchNumero = factura.numero?.toString().includes(searchTerm)
        return matchCliente || matchCuit || matchNumero
    })

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APROBADO':
                return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            case 'RECHAZADO':
                return <AlertCircle className="w-4 h-4 text-red-500" />
            default:
                return <Clock className="w-4 h-4 text-amber-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'APROBADO':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200'
            case 'RECHAZADO':
                return 'bg-red-50 text-red-700 border-red-200'
            default:
                return 'bg-amber-50 text-amber-700 border-amber-200'
        }
    }

    return (
        <div className="space-y-6">
            {/* Cabecera / Buscador */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Buscar por cliente, CUIT o número..." 
                        className="pl-9 bg-white border-slate-200 focus-visible:ring-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Empty State */}
            {filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                        <FileText className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No hay facturas</h3>
                    <p className="text-sm text-slate-500 max-w-sm mt-1">
                        Aún no se han emitido facturas. Al finalizar órdenes de trabajo, podrá facturarlas mediante AFIP.
                    </p>
                </div>
            ) : (
                <div className="rounded-2xl border-transparent bg-transparent shadow-none backdrop-blur-none md:border-slate-200/60 md:bg-white md:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:backdrop-blur-xl overflow-hidden">
                    <div className="hidden md:block overflow-x-auto w-full">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50 border-b-slate-100">
                                    <TableHead className="font-medium text-slate-500">Fecha Emisión</TableHead>
                                    <TableHead className="font-medium text-slate-500">Comprobante</TableHead>
                                    <TableHead className="font-medium text-slate-500">Cliente</TableHead>
                                    <TableHead className="font-medium text-slate-500">Total</TableHead>
                                    <TableHead className="font-medium text-slate-500">Estado AFIP</TableHead>
                                    <TableHead className="text-right font-medium text-slate-500">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredData.map((factura) => (
                                    <TableRow key={factura.id} className="group hover:bg-slate-50/50 transition-colors border-b-slate-100">
                                        <TableCell className="text-slate-600">
                                            {factura.fecha_emision ? format(new Date(factura.fecha_emision), 'dd/MM/yyyy') : '-'}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">
                                                    Factura {factura.tipo_comprobante === '1' ? 'A' : factura.tipo_comprobante === '6' ? 'B' : 'C'}
                                                </span>
                                                <span className="text-xs text-slate-500 font-mono">
                                                    {String(factura.punto_venta).padStart(4, '0')}-{String(factura.numero).padStart(8, '0')}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-slate-900">
                                                    {factura.orden?.cliente?.razon_social || '-'}
                                                </span>
                                                <span className="text-xs text-slate-500">
                                                    CUIT: {factura.orden?.cliente?.cuit || '-'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-medium text-slate-900">
                                                $ {Number(factura.total).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(factura.estado_afip)}`}>
                                                {getStatusIcon(factura.estado_afip)}
                                                {factura.estado_afip}
                                            </div>
                                            {factura.estado_afip === 'RECHAZADO' && factura.observaciones_afip && (
                                                <div className="text-[10px] text-red-500 mt-1 max-w-[150px] truncate" title={factura.observaciones_afip}>
                                                    {factura.observaciones_afip}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <span className="sr-only">Abrir menú</span>
                                                        <MoreHorizontal className="h-4 w-4 text-slate-500" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-[160px] rounded-xl shadow-lg border-slate-100">
                                                    <DropdownMenuItem 
                                                        className="gap-2 cursor-pointer"
                                                        onClick={() => {
                                                            // Lógica para descargar PDF
                                                            if (factura.pdf_url) {
                                                                window.open(factura.pdf_url, '_blank')
                                                            } else {
                                                                alert('El PDF aún no está disponible.')
                                                            }
                                                        }}
                                                    >
                                                        <Download className="h-4 w-4 text-slate-400" />
                                                        Descargar PDF
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {/* VISTA MÓVIL (TARJETAS) */}
                    <div className="block md:hidden space-y-4">
                        {filteredData.map((factura) => (
                            <div key={factura.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 border-b border-slate-50 flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold text-slate-800">
                                            Factura {factura.tipo_comprobante === '1' ? 'A' : factura.tipo_comprobante === '6' ? 'B' : 'C'}
                                        </div>
                                        <div className="text-xs text-slate-500 font-mono">
                                            {String(factura.punto_venta).padStart(4, '0')}-{String(factura.numero).padStart(8, '0')}
                                        </div>
                                    </div>
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border tracking-wider ${getStatusBadge(factura.estado_afip)}`}>
                                        {getStatusIcon(factura.estado_afip)}
                                        {factura.estado_afip}
                                    </div>
                                </div>
                                
                                <div className="p-4 flex flex-col gap-1">
                                    <span className="text-sm font-medium text-slate-600">{factura.orden?.cliente?.razon_social || '-'}</span>
                                    <span className="text-sm text-slate-500">CUIT: {factura.orden?.cliente?.cuit || '-'}</span>
                                    <span className="text-3xl font-bold text-slate-900 tracking-tight mt-1">
                                        $ {Number(factura.total).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                                
                                <div className="bg-slate-50 p-3 flex justify-between items-center border-t border-slate-100 text-sm text-slate-500">
                                    <span>
                                        {factura.fecha_emision ? format(new Date(factura.fecha_emision), 'dd/MM/yyyy') : '-'}
                                    </span>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-8 gap-2 text-slate-600 hover:text-emerald-600"
                                        onClick={() => {
                                            if (factura.pdf_url) {
                                                window.open(factura.pdf_url, '_blank')
                                            } else {
                                                alert('El PDF aún no está disponible.')
                                            }
                                        }}
                                    >
                                        <Download className="h-4 w-4" />
                                        PDF
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    )
}
