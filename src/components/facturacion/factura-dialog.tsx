'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { emitirFactura } from '@/server/afip'
import { FileText, Loader2 } from 'lucide-react'

interface FacturaDialogProps {
    orden: any
    trigger?: React.ReactNode
}

export function FacturaDialog({ orden, trigger }: FacturaDialogProps) {
    const ordenId = orden.id
    const clienteNombre = orden.cliente.razon_social
    const total = Number(orden.total)
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [tipo, setTipo] = useState('A')

    function handleEmitir() {
        startTransition(async () => {
            const result = await emitirFactura(ordenId, tipo)
            if (result.success) {
                toast.success('Factura emitida correctamente (CAE Generado)')
                setOpen(false)
            } else {
                toast.error(result.error as string)
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <FileText className="w-4 h-4 mr-2" />
                        Facturar
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Emitir Factura Electrónica</DialogTitle>
                    <DialogDescription>
                        Se conectará al servicio de AFIP para autorizar el comprobante.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-slate-500">Cliente</Label>
                        <div className="col-span-3 font-medium">{clienteNombre}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right text-slate-500">Monto</Label>
                        <div className="col-span-3 font-bold text-lg">
                            ${total.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="tipo" className="text-right text-slate-500">Tipo</Label>
                        <Select value={tipo} onValueChange={setTipo}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A">Factura A</SelectItem>
                                <SelectItem value="B">Factura B</SelectItem>
                                <SelectItem value="C">Factura C</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button onClick={handleEmitir} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isPending ? 'Solicitando CAE...' : 'Confirmar Emisión'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
