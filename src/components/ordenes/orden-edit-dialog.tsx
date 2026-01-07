'use client'

import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { OrdenForm } from './orden-form'

interface OrdenEditDialogProps {
    orden: any // Using any for now, ideally specific type
    clientes: any[]
    servicios: any[]
    trigger?: React.ReactNode
}

export function OrdenEditDialog({ orden, clientes, servicios, trigger }: OrdenEditDialogProps) {
    const [open, setOpen] = useState(false)

    // Prepare initial data for the form
    const initialData = {
        cliente_id: orden.cliente?.id || orden.cliente_id,
        fecha: new Date(orden.fecha),
        total: Number(orden.total),
        moneda: orden.moneda || 'ARS',
        observaciones: orden.observaciones,
        items: orden.items || []
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-indigo-600 hover:bg-slate-100">
                        <Pencil className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-5xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Editar Orden</DialogTitle>
                    <DialogDescription>
                        Modifique los detalles de la orden aquí. Click en guardar cuando termine.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <OrdenForm
                        clientes={clientes}
                        servicios={servicios}
                        initialData={{ ...initialData, id: orden.id }}
                        onSuccess={() => setOpen(false)}
                        mode="edit"
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}
