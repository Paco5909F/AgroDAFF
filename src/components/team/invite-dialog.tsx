'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { UserRole } from "@prisma/client"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createInvitation } from "@/server/invitations"
import { toast } from "sonner"
import { Plus, Copy, Check } from "lucide-react"

const formSchema = z.object({
    email: z.string().email("Email inválido"),
    rol: z.enum(["ADMIN", "ENCARGADO", "MAQUINISTA", "TRANSPORTISTA", "LECTOR"] as const),
})

interface InviteDialogProps {
    onInviteCreated: (invite: any) => void
}

export function InviteDialog({ onInviteCreated }: InviteDialogProps) {
    const [open, setOpen] = useState(false)
    const [inviteLink, setInviteLink] = useState<string | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            rol: "LECTOR",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const result = await createInvitation(values)
            if (result.success && result.link) {
                setInviteLink(result.link)
                toast.success("Invitación creada exitosamente")
                // Mock invite object to update UI immediately
                onInviteCreated({
                    id: crypto.randomUUID(), // Temporary ID until refresh
                    email: values.email,
                    rol: values.rol,
                    status: 'PENDING',
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    token: result.link.split('/').pop()
                })
            }
        } catch (error: any) {
            toast.error(error.message || "Error al crear invitación")
        }
    }

    const copyToClipboard = () => {
        if (inviteLink) {
            navigator.clipboard.writeText(inviteLink)
            toast.success("Enlace copiado")
        }
    }

    const handleClose = () => {
        setOpen(false)
        setInviteLink(null)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Invitar Miembro
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Invitar al Equipo</DialogTitle>
                    <DialogDescription>
                        Genera un enlace de invitación para un nuevo miembro.
                    </DialogDescription>
                </DialogHeader>

                {!inviteLink ? (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="usuario@ejemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="rol"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Rol</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="ADMIN">Admin</SelectItem>
                                                <SelectItem value="ENCARGADO">Encargado</SelectItem>
                                                <SelectItem value="MAQUINISTA">Maquinista</SelectItem>
                                                <SelectItem value="TRANSPORTISTA">Transportista</SelectItem>
                                                <SelectItem value="LECTOR">Lector</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Generando..." : "Generar Invitación"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-md text-center">
                            <p className="text-sm font-medium mb-2">¡Invitación Creada!</p>
                            <p className="text-xs text-muted-foreground mb-4">Comparte este enlace con el nuevo usuario:</p>
                            <div className="flex items-center gap-2 p-2 bg-background border rounded overflow-hidden">
                                <code className="text-xs flex-1 truncate">{inviteLink}</code>
                                <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleClose}>Cerrar</Button>
                        </DialogFooter>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
