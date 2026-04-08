'use client'

import { useState } from "react"
import { createSubscription } from "@/server/billing"
import { Loader2 } from "lucide-react"

export function SuscribeButton() {
    const [loading, setLoading] = useState(false)

    async function handleSubscribe() {
        setLoading(true)
        try {
            const res = await createSubscription()
            if (res.success && res.init_point) {
                // Redirect user to Mercado Pago checkout
                window.location.href = res.init_point
            } else {
                alert(res.error || "Hubo un error al generar el link de pago.")
                setLoading(false)
            }
        } catch (e) {
            alert("Error de conexión.")
            setLoading(false)
        }
    }

    return (
        <button 
            onClick={handleSubscribe} 
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold bg-amber-400 text-emerald-950 hover:bg-amber-500 transition-colors flex items-center justify-center disabled:opacity-70"
        >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto mr-2" /> : null}
            {loading ? 'Redirigiendo a Mercado Pago...' : 'Suscribirme Ahora'}
        </button>
    )
}
