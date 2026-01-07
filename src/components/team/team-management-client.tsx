'use client'

import { useState } from "react"
import { Usuario, Invitation, UserRole } from "@prisma/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { InviteDialog } from "./invite-dialog"
import { removeUser, updateUserRole } from "@/server/team"
import { deleteInvitation } from "@/server/invitations"
import { toast } from "sonner"
import { MoreHorizontal, Trash, Mail, Shield, UserX } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"

interface TeamManagementClientProps {
    initialUsers: any[] // Using any for now to match Prisma return type with checks
    initialInvitations: any[]
}

export function TeamManagementClient({ initialUsers, initialInvitations }: TeamManagementClientProps) {
    const [users, setUsers] = useState(initialUsers)
    const [invitations, setInvitations] = useState(initialInvitations)

    const handleRemoveUser = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este usuario del equipo?")) return
        try {
            await removeUser(id)
            setUsers(users.filter(u => u.id !== id))
            toast.success("Usuario eliminado")
        } catch (error) {
            toast.error("Error al eliminar usuario")
        }
    }

    const handleUpdateRole = async (id: string, newRole: UserRole) => {
        try {
            await updateUserRole(id, newRole)
            setUsers(users.map(u => u.id === id ? { ...u, rol: newRole } : u))
            toast.success("Rol actualizado")
        } catch (error) {
            toast.error("Error al actualizar rol")
        }
    }

    const handleRevokeInvite = async (id: string) => {
        try {
            await deleteInvitation(id)
            setInvitations(invitations.filter(i => i.id !== id))
            toast.success("Invitación revocada")
        } catch (error) {
            toast.error("Error al revocar invitación")
        }
    }

    const copyLink = (token: string) => {
        const link = `${window.location.origin}/invite/accept/${token}`
        navigator.clipboard.writeText(link)
        toast.success("Enlace copiado al portapapeles")
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <InviteDialog onInviteCreated={(invite) => setInvitations([invite, ...invitations])} />
            </div>

            <Tabs defaultValue="members" className="w-full">
                <TabsList>
                    <TabsTrigger value="members">Miembros ({users.length})</TabsTrigger>
                    <TabsTrigger value="invitations">Invitaciones Pendientes ({invitations.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="members">
                    <Card>
                        <CardHeader>
                            <CardTitle>Miembros del Equipo</CardTitle>
                            <CardDescription>Usuarios activos actualmente en la empresa.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.nombre}</TableCell>
                                            <TableCell>{user.email || 'Sin email'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{user.rol}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                        <DropdownMenuSub>
                                                            <DropdownMenuSubTrigger>
                                                                <Shield className="mr-2 h-4 w-4" />
                                                                Cambiar Rol
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuSubContent>
                                                                <DropdownMenuRadioGroup
                                                                    value={user.rol}
                                                                    onValueChange={(v) => handleUpdateRole(user.id, v as UserRole)}
                                                                >
                                                                    {Object.values(UserRole)
                                                                        .filter(r => typeof r === 'string' && r === r.toUpperCase()) // Filter legacy roles
                                                                        .map(role => (
                                                                            <DropdownMenuRadioItem key={role} value={role}>
                                                                                {role}
                                                                            </DropdownMenuRadioItem>
                                                                        ))}
                                                                </DropdownMenuRadioGroup>
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuSub>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() => handleRemoveUser(user.id)}
                                                        >
                                                            <UserX className="mr-2 h-4 w-4" />
                                                            Eliminar del Equipo
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="invitations">
                    <Card>
                        <CardHeader>
                            <CardTitle>Invitaciones Pendientes</CardTitle>
                            <CardDescription>Enlaces generados que aún no han sido aceptados.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Expira</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invitations.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                                No hay invitaciones pendientes.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {invitations.map((invite) => (
                                        <TableRow key={invite.id}>
                                            <TableCell>{invite.email}</TableCell>
                                            <TableCell><Badge variant="secondary">{invite.rol}</Badge></TableCell>
                                            <TableCell>{new Date(invite.expires_at).toLocaleDateString('es-AR')}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button variant="outline" size="sm" onClick={() => copyLink(invite.token)}>
                                                    Copiar Enlace
                                                </Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleRevokeInvite(invite.id)}>
                                                    <Trash className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
