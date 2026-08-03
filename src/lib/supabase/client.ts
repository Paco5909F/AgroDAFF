import { createBrowserClient } from '@supabase/ssr'

let clientInstance: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
    if (clientInstance) return clientInstance

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

    // Safety cookie sanitizer without crashing
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        try {
            const cookieStr = document.cookie || ''
            const cookies = cookieStr.split(';')
            for (const cookie of cookies) {
                const parts = cookie.split('=')
                if (parts.length >= 2) {
                    const name = parts[0].trim()
                    const value = parts.slice(1).join('=').trim()
                    if (name.startsWith('sb-') && name.endsWith('-auth-token')) {
                        try {
                            const decoded = decodeURIComponent(value)
                            if (decoded.startsWith('"{"') || decoded.startsWith('"{')) {
                                document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=${window.location.hostname};`
                                document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
                            }
                        } catch {
                            // ignore decode errors
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error sanitizing cookies:", e)
        }
    }

    try {
        if (!url || !anonKey) {
            console.warn("Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment variables.")
        }
        
        clientInstance = createBrowserClient(
            url || 'https://placeholder.supabase.co',
            anonKey || 'placeholder'
        )
    } catch (err) {
        console.error("Error initializing browser Supabase client:", err)
        clientInstance = createBrowserClient(
            'https://placeholder.supabase.co',
            'placeholder'
        )
    }

    return clientInstance
}
