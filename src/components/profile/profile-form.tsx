
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { LogOut, Save, User, Mail, Shield, Lock, Check } from 'lucide-react'
import { updateUserProfile, updateUserPassword } from '@/server/usuarios'
import { createClient } from '@/lib/supabase/client'
import { Progress } from "@/components/ui/progress"

interface ProfileFormProps {
    user: {
        id: string
        email: string | undefined
        nombre: string
        rol: string
    }
}

export function ProfileForm({ user }: ProfileFormProps) {
    const [nombre, setNombre] = useState(user.nombre)

    // Password State
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const supabase = createClient()

    // Calculate Strength
    const getStrength = (pass: string) => {
        let score = 0
        if (!pass) return 0
        if (pass.length > 4) score += 20
        if (pass.length >= 8) score += 40
        if (/[A-Z]/.test(pass)) score += 20
        if (/[0-9]/.test(pass)) score += 20
        return score
    }
    const strength = getStrength(password)
    const strengthColor = !password ? "bg-slate-200" : strength < 40 ? "bg-red-500" : strength < 80 ? "bg-yellow-500" : "bg-emerald-500"
    const strengthText = !password ? "..." : strength < 40 ? "Débil" : strength < 80 ? "Media" : "Fuerte"

    const handleSave = () => {
        if (!nombre.trim()) {
            toast.error("El nombre no puede estar vacío")
            return
        }

        startTransition(async () => {
            // Update Name
            if (nombre !== user.nombre) {
                const result = await updateUserProfile(nombre)
                if (!result.success) {
                    toast.error(result.error as string)
                    return
                }
            }

            // Update Password
            if (password) {
                if (password.length < 8) {
                    toast.error("La contraseña debe tener al menos 8 caracteres")
                    return
                }
                if (password !== confirmPassword) {
                    toast.error("Las contraseñas no coinciden")
                    return
                }

                const result = await updateUserPassword(password)
                if (result.success) {
                    toast.success("Contraseña actualizada")
                    setPassword("")
                    setConfirmPassword("")
                } else {
                    toast.error(result.error as string)
                }
            } else if (nombre !== user.nombre) {
                toast.success("Perfil actualizado")
            }
        })
    }

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            toast.error("Error al cerrar sesión")
        } else {
            router.refresh()
            router.push('/login')
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4">
            <Card>
                {/* CardHeader Removed for cleaner layout */}
                <CardContent className="space-y-4 pt-4 sm:pt-6">

                    {/* Email & Role (Disabled Inputs) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-slate-500">
                                <Mail className="h-4 w-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                value={user.email || ''}
                                disabled
                                className="bg-slate-50 text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rol" className="flex items-center gap-2 text-slate-500">
                                <Shield className="h-4 w-4" />
                                Rol
                            </Label>
                            <Input
                                id="rol"
                                value={user.rol}
                                disabled
                                className="bg-slate-50 text-slate-500 capitalize"
                            />
                        </div>
                    </div>

                    {/* Name (Editable) */}
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre Visible</Label>
                        <Input
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="text-lg"
                        />
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Shield className="h-3 w-3" />
                            Seguridad
                        </h3>

                        <div className="space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Nueva Contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mínimo 8 caracteres"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirmar</Label>
                                    <Input
                                        id="confirm"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={!password}
                                        placeholder="Repetir contraseña"
                                    />
                                </div>
                            </div>

                            {/* Strength Meter */}
                            <div className="pt-1">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-slate-500">Fortaleza: <span className="font-medium text-slate-700">{strengthText}</span></span>
                                        <span className="text-slate-400">{password.length}/8</span>
                                    </div>
                                    <Progress value={strength} className={`h-1.5 ${strengthColor}`} indicatorClassName={strengthColor} />
                                    <ul className="text-xs text-slate-500 mt-2 pl-1">
                                        <li className="flex items-center gap-1">
                                            {password.length >= 8 ? <Check className="h-3 w-3 text-emerald-500" /> : <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ml-0.5 mr-1" />}
                                            <span className={password.length >= 8 ? "text-slate-700" : "text-slate-500"}>Mín. 8 caracteres</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                </CardContent>
                <CardFooter className="flex justify-between border-t p-4 bg-slate-50/50">
                    <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={handleLogout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                    </Button>

                    <Button onClick={handleSave} disabled={isPending || (!password && nombre === user.nombre)} className="bg-emerald-600 hover:bg-emerald-700">
                        {isPending ? 'Guardando...' : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Guardar Cambios
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
