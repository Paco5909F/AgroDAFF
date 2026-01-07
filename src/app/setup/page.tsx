'use client'

import { seedAdminUser } from "@/server/seed"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SetupPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSeed = async () => {
        setLoading(true)
        try {
            const res = await seedAdminUser()
            if (res.success) {
                toast.success("Usuario Admin creado correctamente: admin@eltrisquel.com")
                setTimeout(() => router.push('/login'), 2000)
            } else {
                toast.error("Error: " + res.error)
            }
        } catch (e) {
            toast.error("Error desconocido")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-zinc-950 text-white">
            <div className="text-center space-y-4">
                <h1 className="text-2xl font-bold">Configuración Inicial</h1>
                <p>Crear usuario admin@eltrisquel.com / admin123</p>
                <Button onClick={handleSeed} disabled={loading} size="lg" className="bg-green-600 hover:bg-green-700">
                    {loading ? "Creando..." : "Crear Admin & DB"}
                </Button>
            </div>
        </div>
    )
}
