'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createInsumo, appendPrecioInsumo, cloneGlobalInsumo } from '@/server/insumos'
import { Loader2, Plus, DollarSign, Sprout, Droplet, TestTube, Fuel, Package, ArrowUpRight } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label'

interface Insumo {
    id: string
    nombre: string
    tipo: string
    unidad_medida: string
    precio_actual: number
    moneda: string
    active: boolean
    es_global: boolean
}

// Icon mapping based on type
const getIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
        case 'semilla': return <Sprout className="h-4 w-4 text-emerald-600" />
        case 'herbicida': return <Droplet className="h-4 w-4 text-amber-500" />
        case 'fertilizante': return <TestTube className="h-4 w-4 text-blue-500" />
        case 'combustible': return <Fuel className="h-4 w-4 text-rose-500" />
        default: return <Package className="h-4 w-4 text-slate-500" />
    }
}

export function InsumosClient({ initialData }: { initialData: Insumo[] }) {
    const [insumos, setInsumos] = useState<Insumo[]>(initialData)
    const [isPending, startTransition] = useTransition()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [isPriceOpen, setIsPriceOpen] = useState(false)
    const [selectedInsumo, setSelectedInsumo] = useState<Insumo | null>(null)

    // Form States
    const [formData, setFormData] = useState({
        nombre: '',
        tipo: 'Semilla',
        unidad_medida: 'kg',
        precio: '',
        moneda: 'USD'
    })
    const [newPrice, setNewPrice] = useState('')

    const handleCreate = async () => {
        if (!formData.nombre.trim()) return toast.error("El nombre es obligatorio")
        
        startTransition(async () => {
            const result = await createInsumo({
                ...formData,
                precio: Number(formData.precio) || 0
            })

            if (result.success && result.insumo) {
                toast.success("Insumo creado exitosamente")
                setInsumos([...insumos, {
                    ...result.insumo,
                    precio_actual: Number(formData.precio) || 0,
                    moneda: formData.moneda,
                    active: true,
                    es_global: false
                }])
                setIsCreateOpen(false)
                setFormData({ nombre: '', tipo: 'Semilla', unidad_medida: 'kg', precio: '', moneda: 'USD' })
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleUpdatePrice = async () => {
        if (!selectedInsumo || !newPrice) return

        startTransition(async () => {
            const precioNum = Number(newPrice)
            const result = await appendPrecioInsumo(selectedInsumo.id, precioNum, selectedInsumo.moneda)

            if (result.success) {
                toast.success("Precio actualizado")
                setInsumos(insumos.map(i => 
                    i.id === selectedInsumo.id ? { ...i, precio_actual: precioNum } : i
                ))
                setIsPriceOpen(false)
                setNewPrice('')
            } else {
                toast.error(result.error)
            }
        })
    }

    const handleClone = async (globalId: string) => {
        startTransition(async () => {
            const result = await cloneGlobalInsumo(globalId)
            if (result.success && result.insumo) {
                toast.success("Insumo clonado a su catálogo privado")
                setInsumos([...insumos, {
                    ...result.insumo,
                    precio_actual: 0,
                    moneda: 'USD',
                    active: true,
                    es_global: false
                }])
            } else {
                toast.error(result.error || "No se pudo clonar")
            }
        })
    }

    const formatMoney = (val: number, moneda: string) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: moneda }).format(val)
    }

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center mb-4">
                <Input placeholder="Buscar insumo..." className="max-w-xs" />
                
                {/* CREATE DIALOG */}
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Plus className="mr-2 h-4 w-4" /> Nuevo Insumo
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Registrar Nuevo Insumo</DialogTitle>
                            <DialogDescription>
                                Agregue un insumo a su catálogo para asignarlo en las labores.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="nombre">Nombre (ej: Soja Don Mario X)</Label>
                                <Input 
                                    id="nombre" 
                                    value={formData.nombre} 
                                    onChange={(e) => setFormData({...formData, nombre: e.target.value})} 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Categoría</Label>
                                    <Select value={formData.tipo} onValueChange={(v) => setFormData({...formData, tipo: v})}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Semilla">Semilla</SelectItem>
                                            <SelectItem value="Fertilizante">Fertilizante</SelectItem>
                                            <SelectItem value="Herbicida">Herbicida</SelectItem>
                                            <SelectItem value="Fungicida">Fungicida</SelectItem>
                                            <SelectItem value="Combustible">Combustible</SelectItem>
                                            <SelectItem value="Otro">Otro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>U. de Medida</Label>
                                    <Select value={formData.unidad_medida} onValueChange={(v) => setFormData({...formData, unidad_medida: v})}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="kg">Kilogramos (kg)</SelectItem>
                                            <SelectItem value="lt">Litros (lt)</SelectItem>
                                            <SelectItem value="dosis">Dosis</SelectItem>
                                            <SelectItem value="unidad">Unidad</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Precio Actual</Label>
                                    <Input 
                                        type="number" 
                                        placeholder="0.00" 
                                        value={formData.precio} 
                                        onChange={(e) => setFormData({...formData, precio: e.target.value})} 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Moneda</Label>
                                    <Select value={formData.moneda} onValueChange={(v) => setFormData({...formData, moneda: v})}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">Dólar (USD)</SelectItem>
                                            <SelectItem value="ARS">Pesos (ARS)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button disabled={isPending} onClick={handleCreate} className="w-full sm:w-auto bg-emerald-600">
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Guardar Insumo
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* UPDATE PRICE DIALOG */}
            <Dialog open={isPriceOpen} onOpenChange={setIsPriceOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Actualizar: {selectedInsumo?.nombre}</DialogTitle>
                        <DialogDescription>
                            El precio actual es {formatMoney(selectedInsumo?.precio_actual || 0, selectedInsumo?.moneda || 'USD')} / {selectedInsumo?.unidad_medida}.
                            Este cambio aplicará a las <b>futuras</b> actividades, no cambia el histórico ya incurrido.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Nuevo Precio ({selectedInsumo?.moneda})</Label>
                            <Input 
                                type="number" 
                                value={newPrice} 
                                onChange={(e) => setNewPrice(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={isPending || !newPrice} onClick={handleUpdatePrice} className="bg-blue-600">
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Actualizar Precio"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>            


            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Insumo</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead className="text-right">Precio Unitario</TableHead>
                            <TableHead className="text-right">Unidad</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {insumos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No hay insumos registrados. Agregue el primero.
                                </TableCell>
                            </TableRow>
                        ) : (
                            insumos.map((insumo) => (
                                <TableRow key={insumo.id} className="hover:bg-emerald-50/20 group">
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <div className="p-1.5 bg-slate-100 rounded-md group-hover:bg-white transition-colors">
                                            {getIcon(insumo.tipo)}
                                        </div>
                                        {insumo.nombre}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="bg-slate-50 capitalize">
                                                {insumo.tipo}
                                            </Badge>
                                            {insumo.es_global && (
                                                <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200" title="Provisión del Ecosistema">
                                                    🌍 Global
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right tabular-nums font-medium text-slate-700">
                                        {formatMoney(insumo.precio_actual, insumo.moneda)}
                                    </TableCell>
                                    <TableCell className="text-right text-slate-500 text-sm">
                                        / {insumo.unidad_medida}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {insumo.es_global ? (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                                onClick={() => handleClone(insumo.id)}
                                                disabled={isPending}
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Clonar
                                            </Button>
                                        ) : (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                onClick={() => {
                                                    setSelectedInsumo(insumo)
                                                    setNewPrice(insumo.precio_actual.toString())
                                                    setIsPriceOpen(true)
                                                }}
                                            >
                                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                                Act. Precio
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

// Temporary polyfill for Save icon missing import
const Save = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
)
