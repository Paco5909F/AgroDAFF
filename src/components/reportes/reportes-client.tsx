'use client'

import { useState, useTransition } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { getReportData, closePeriod } from '@/server/reportes'
import { generateReportPDF } from '@/lib/pdf-generator'
import { toast } from 'sonner'
import { FileDown, Lock, Search, RefreshCw } from 'lucide-react'

interface ReportesClientProps {
    clientes: any[]
    campanas: any[]
    empresa: any
}

export function ReportesClient({ clientes, campanas, empresa }: ReportesClientProps) {
    const [isPending, startTransition] = useTransition()
    const [orders, setOrders] = useState<any[]>([])

    // Default filters: Current month
    const [filters, setFilters] = useState({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        to: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0],
        clienteId: 'all',
        campanaId: 'all',
        estado: 'all'
    })

    const handleSearch = () => {
        startTransition(async () => {
            const result = await getReportData({
                from: new Date(filters.from),
                to: new Date(filters.to),
                clienteId: filters.clienteId,
                campanaId: filters.campanaId,
                estado: filters.estado
            })

            if (result.success) {
                setOrders(result.data || [])
            } else {
                toast.error(result.error as string)
            }
        })
    }

    const handleExport = () => {
        if (orders.length === 0) {
            toast.error("No hay datos para exportar")
            return
        }

        const branding = empresa ? {
            name: empresa.nombre || "El Trisquel Agroservicios",
            address: empresa.direccion || "O'Higgins, Buenos Aires",
            cuit: empresa.cuit || "",
            logoUrl: empresa.logo_url || undefined,
            phone: empresa.telefono || "2364-610322",
            email: empresa.email || "agroserviciosciglieri@hotmail.com"
        } : undefined

        generateReportPDF(orders, {
            from: new Date(filters.from),
            to: new Date(filters.to)
        }, branding)
        toast.success("PDF generado correctamente")
    }

    const handleClosePeriod = () => {
        if (orders.length === 0) return

        if (!confirm("¿Está seguro de cerrar este periodo? Esto marcará todas las órdenes listadas como FACTURADA y no podrán editarse.")) return

        startTransition(async () => {
            const ids = orders.map(o => o.id)
            const result = await closePeriod(ids)

            if (result.success) {
                toast.success("Periodo cerrado exitosamente")
                handleSearch() // Refresh
            } else {
                toast.error(result.error as string)
            }
        })
    }


    // Calculate totals by currency
    const totalARS = orders
        .filter(o => !o.moneda || o.moneda === 'ARS')
        .reduce((sum, o) => sum + Number(o.total), 0)

    const totalUSD = orders
        .filter(o => o.moneda === 'USD')
        .reduce((sum, o) => sum + Number(o.total), 0)

    const totalOrders = orders.length

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium uppercase text-slate-500">Filtros de Reporte</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold">Desde</label>
                            <Input
                                type="date"
                                value={filters.from}
                                onChange={(e) => setFilters(prev => ({ ...prev, from: e.target.value }))}
                                className="w-full block [&::-webkit-calendar-picker-indicator]:mr-0 [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-clear-button]:appearance-none pr-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold">Hasta</label>
                            <Input
                                type="date"
                                value={filters.to}
                                onChange={(e) => setFilters(prev => ({ ...prev, to: e.target.value }))}
                                className="w-full block [&::-webkit-calendar-picker-indicator]:mr-0 [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-clear-button]:appearance-none pr-2"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold">Cliente</label>
                            <Select
                                value={filters.clienteId}
                                onValueChange={(val) => setFilters(prev => ({ ...prev, clienteId: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {clientes.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.razon_social}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold">Campaña</label>
                            <Select
                                value={filters.campanaId}
                                onValueChange={(val) => setFilters(prev => ({ ...prev, campanaId: val }))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    {campanas.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleSearch} disabled={isPending} className="bg-slate-800 hover:bg-slate-900">
                            {isPending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                            Buscar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-50 border-slate-200">
                    <CardHeader className="py-4">
                        <span className="text-xs font-semibold text-slate-500 uppercase">Total Trabajos</span>
                        <div className="text-2xl font-bold text-slate-700">{totalOrders}</div>
                    </CardHeader>
                </Card>
                <Card className="bg-emerald-50 border-emerald-100">
                    <CardHeader className="py-4">
                        <span className="text-xs font-semibold text-emerald-600 uppercase">Total Estimado (ARS)</span>
                        <div className="text-2xl font-bold text-emerald-700">
                            $ {totalARS.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </div>
                    </CardHeader>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="py-4">
                        <span className="text-xs font-semibold text-blue-600 uppercase">Total Estimado (USD)</span>
                        <div className="text-2xl font-bold text-blue-700">
                            US$ {totalUSD.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </div>
                    </CardHeader>
                </Card>
            </div>

            {/* Table & Actions */}
            <div className="bg-white rounded-lg border shadow-sm">
                <div className="p-4 border-b flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-semibold text-slate-700">Resultados</h3>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleExport} disabled={orders.length === 0}>
                            <FileDown className="h-4 w-4 mr-2 text-red-600" />
                            PDF
                        </Button>
                        <Button
                            variant="default"
                            size="sm"
                            onClick={handleClosePeriod}
                            disabled={orders.length === 0 || isPending}
                            className="bg-amber-600 hover:bg-amber-700"
                        >
                            <Lock className="h-4 w-4 mr-2" />
                            Cerrar Periodo
                        </Button>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Servicio</TableHead>
                            <TableHead className="text-center">Cant.</TableHead>
                            <TableHead className="text-right">Precio</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                                    No hay datos para mostrar. Realice una búsqueda.
                                </TableCell>
                            </TableRow>
                        ) : (
                            orders.flatMap((order: any) =>
                                order.items && order.items.length > 0 ? (
                                    order.items.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">
                                                {format(new Date(order.fecha), 'dd/MM/yyyy')}
                                            </TableCell>
                                            <TableCell>{order.cliente.razon_social}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{item.servicio.nombre}</span>
                                                    <span className="text-xs text-slate-400">{item.campana?.nombre || order.campana?.nombre || '-'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {Number(item.cantidad).toLocaleString('es-AR')} {item.servicio.unidad_medida}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {order.moneda === 'USD' ? 'US$ ' : '$ '}
                                                {Number(item.precio_unit).toLocaleString('es-AR')}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {order.moneda === 'USD' ? 'US$ ' : '$ '}
                                                {Number(item.total).toLocaleString('es-AR')}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {order.estado}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : null
                            )

                        )}
                    </TableBody>
                </Table >
            </div >
        </div >
    )
}
