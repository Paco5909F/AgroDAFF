'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const TIMEOUT_MS = 15 * 60 * 1000 // 15 minutes
// const TIMEOUT_MS = 10 * 1000 // 10 seconds for testing

export function AutoLogout() {
    const router = useRouter()
    const supabase = createClient()
    const timerRef = useRef<NodeJS.Timeout | null>(null)

    useEffect(() => {
        // Only run on client
        if (typeof window === 'undefined') return

        const resetTimer = () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            timerRef.current = setTimeout(handleLogout, TIMEOUT_MS)
        }

        const handleLogout = async () => {
            // Check if we actually have a session before logging out
            // This prevents loops or unnecessary calls if already out
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                await supabase.auth.signOut()
                toast.warning('Sesión cerrada por inactividad', {
                    duration: 5000,
                    description: 'Por seguridad, su sesión ha expirado.'
                })
                router.push('/login')
                router.refresh()
            }
        }

        // Events to monitor
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove']

        // Setup listeners
        const setup = () => {
            events.forEach(event => {
                window.addEventListener(event, resetTimer)
            })
            resetTimer() // Start timer immediately
        }

        setup()

        // Cleanup
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
            events.forEach(event => {
                window.removeEventListener(event, resetTimer)
            })
        }
    }, [router, supabase])

    return null // This component doesn't render anything
}
