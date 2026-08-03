'use client'
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function GlobalAppError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Unhandled Application Error:', error)
    }, [error])

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4 border border-red-100 shadow-sm">
                <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Ocurrió un problema al cargar la sección
            </h2>
            
            <p className="text-slate-500 max-w-md mb-4 text-sm">
                {error.message || 'Se produjo un error inesperado al procesar la solicitud.'}
            </p>

            {error.digest && (
                <div className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-mono mb-6">
                    Código de Referencia: {error.digest}
                </div>
            )}

            <div className="flex items-center gap-3">
                <Button 
                    onClick={() => reset()}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reintentar
                </Button>
                <Link href="/">
                    <Button variant="outline" className="gap-2">
                        <Home className="w-4 h-4" />
                        Ir al Inicio
                    </Button>
                </Link>
            </div>
        </div>
    )
}
