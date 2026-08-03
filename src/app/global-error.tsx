'use client'

import { useEffect } from 'react'

export default function GlobalLayoutError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Fatal Global Layout Error:', error)
    }, [error])

    return (
        <html lang="es">
            <body className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
                <div className="max-w-md w-full bg-white rounded-2xl p-8 shadow-xl border border-slate-100 text-center flex flex-col items-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">🌱</span>
                    </div>
                    
                    <h1 className="text-xl font-bold text-slate-900 mb-2">
                        AgroDAFF - Error Temporal
                    </h1>
                    
                    <p className="text-slate-500 text-sm mb-6">
                        No se pudo inicializar la aplicación correctamente. Por favor recarga la página o intenta en unos momentos.
                    </p>

                    {error.digest && (
                        <p className="text-xs font-mono bg-slate-100 text-slate-500 px-3 py-1.5 rounded-md mb-6">
                            Ref: {error.digest}
                        </p>
                    )}

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={() => reset()}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 rounded-xl text-sm transition-all"
                        >
                            Reintentar
                        </button>
                        <a
                            href="/"
                            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium py-2.5 px-4 rounded-xl text-sm transition-all text-center flex items-center justify-center"
                        >
                            Ir a Inicio
                        </a>
                    </div>
                </div>
            </body>
        </html>
    )
}
