import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                <span className="text-3xl font-bold">404</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                Página no encontrada
            </h1>
            
            <p className="text-slate-500 max-w-md mb-8 text-sm sm:text-base">
                La página que estás buscando no existe, ha sido movida o el enlace es incorrecto.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3">
                <Link href="/dashboard">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6">
                        <Home className="w-4 h-4" />
                        Ir al Dashboard
                    </Button>
                </Link>
                <Link href="/">
                    <Button variant="outline" className="gap-2 px-6">
                        <ArrowLeft className="w-4 h-4" />
                        Inicio
                    </Button>
                </Link>
            </div>
        </div>
    )
}
